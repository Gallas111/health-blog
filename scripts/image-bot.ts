import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import dotenv from 'dotenv';
import { createHash } from 'node:crypto';
import { generateSmartImage, extractSectionContext, SectionContext, isValidImage } from './utils/image-utils';

dotenv.config();
dotenv.config({ path: '.env.local' });

const CONTENT_DIR = path.join(process.cwd(), 'content');
const PUBLIC_IMAGE_DIR = path.join(process.cwd(), 'public', 'images', 'posts');

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// ─── Track all generated images to detect duplicates ────────────────────────
const generatedImageHashes = new Map<string, string>(); // hash → filepath

function getFileHash(filepath: string): string {
    if (!fs.existsSync(filepath)) return '';
    const buf = fs.readFileSync(filepath);
    // Full-content SHA-256: distinct images never collide, identical images always match.
    return createHash('sha256').update(buf).digest('hex');
}

async function generateImage(
    title: string,
    filename: string,
    category: string = 'default',
    description: string = '',
    imageType: 'thumbnail' | 'body' = 'thumbnail',
    bodyIndex: number = 0,
    sectionContext?: SectionContext
): Promise<string | null> {
    const FORCE_REGEN = process.env.FORCE_REGEN === 'true';
    const SMART_REGEN = process.env.SMART_REGEN === 'true';
    const filepath = path.join(PUBLIC_IMAGE_DIR, filename);
    const metaPathFor = (p: string) => p.slice(0, -(path.extname(p).length)) + '.meta.json';
    const metaPath = metaPathFor(filepath);

    // SMART_REGEN: skip images that already have metadata (already processed by v3 pipeline)
    if (SMART_REGEN && !FORCE_REGEN && fs.existsSync(metaPath)) {
        console.log(`   ⏭️ SMART_REGEN: Skipping ${filename} (already has .meta.json)`);
        return fs.existsSync(filepath) ? `/images/posts/${filename}` : null;
    }

    const result = await generateSmartImage(
        title, filepath, category, description, FORCE_REGEN || SMART_REGEN,
        imageType, bodyIndex, sectionContext
    );

    if (result) {
        // save()가 실제 포맷에 맞춰 확장자를 바꿨을 수 있다. 이후 모든 경로는 실제 저장 경로를 쓴다.
        const savedPath = result;
        // Check for duplicates
        const hash = getFileHash(savedPath);
        const existingPath = generatedImageHashes.get(hash);
        if (existingPath && existingPath !== savedPath) {
            console.warn(`   ⚠️ DUPLICATE detected! ${filename} matches ${path.basename(existingPath)}`);
            console.warn(`   🔄 Regenerating with different seed...`);
            const retryResult = await generateSmartImage(
                title + ' (unique variation)', filepath, category, description, true,
                imageType, bodyIndex + 10, sectionContext
            );
            if (retryResult) {
                // Re-check the regenerated image once; do NOT loop further.
                const retryHash = getFileHash(retryResult);
                const stillColliding = generatedImageHashes.get(retryHash);
                if (stillColliding && stillColliding !== retryResult) {
                    console.warn(`   ⚠️ STILL DUPLICATE after regeneration! ${path.basename(retryResult)} still matches ${path.basename(stillColliding)}. Leaving as-is (no further retries).`);
                }
                generatedImageHashes.set(retryHash, retryResult);
            }
        } else {
            generatedImageHashes.set(hash, savedPath);
        }

        // Save .meta.json for SMART_REGEN tracking
        const meta = {
            pipelineVersion: 3,
            generatedAt: new Date().toISOString(),
            sectionType: sectionContext?.sectionType || 'thumbnail',
            sectionHeading: sectionContext?.sectionHeading || '',
            keyTopics: sectionContext?.sectionKeyTopics || [],
        };
        fs.writeFileSync(metaPathFor(savedPath), JSON.stringify(meta, null, 2));
    }

    // save()가 확장자를 바꿨을 수 있으므로 실제 저장된 파일명으로 참조를 만든다.
    return result ? `/images/posts/${path.basename(result)}` : null;
}

async function processFile(filePath: string) {
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    const { data, content } = matter(fileContent);
    let newContent = content;
    let modified = false;

    const slug = data.slug || path.basename(filePath, '.mdx');

    const FORCE_REGEN = process.env.FORCE_REGEN?.trim() === 'true';
    if (FORCE_REGEN) console.log(`ℹ️ FORCE_REGEN is active for ${filePath}`);

    console.log(`\n${'═'.repeat(60)}`);
    console.log(`📄 Processing: ${slug}`);
    console.log(`   Title: ${data.title?.slice(0, 60)}...`);
    console.log(`${'═'.repeat(60)}`);

    // ── 0. Thumbnail (Primary Image) ────────────────────────────────────────
    let shouldGenerateThumb = false;
    if (!data.image) {
        shouldGenerateThumb = true;
    } else {
        const thumbLocalPath = path.join(process.cwd(), 'public', data.image);
        if (!fs.existsSync(thumbLocalPath)) {
            shouldGenerateThumb = true;
        } else if (FORCE_REGEN) {
            console.log(`🔄 FORCE_REGEN active. Regenerating thumbnail: ${data.image}`);
            shouldGenerateThumb = true;
        } else {
            const buf = fs.readFileSync(thumbLocalPath);
            if (!isValidImage(buf)) {
                console.log(`⚠️ Found invalid existing thumbnail ${data.image} (${buf.length}b). Will regenerate.`);
                shouldGenerateThumb = true;
            }
        }
    }

    if (shouldGenerateThumb) {
        console.log(`🖼️ Generating thumbnail for: ${slug}`);
        const thumbFilename = `${slug}-thumb.png`;
        const thumbPath = await generateImage(
            data.title,
            thumbFilename,
            data.category || 'default',
            typeof data.description === 'string' ? data.description : '',
            'thumbnail',
            0
        );
        if (thumbPath) {
            data.image = thumbPath;
            modified = true;
            await delay(3000); // Increased delay between API calls
        }
    }

    // ── 1. Body placeholders: > [이미지: Description] ───────────────────────
    const placeholderRegex = /> \[이미지: (.*?)\]/g;
    const matches = Array.from(content.matchAll(placeholderRegex));

    for (let i = 0; i < matches.length; i++) {
        const description = matches[i][1];
        // Naming convention: {slug}-body-{n}.png (legacy {slug}-bot-body-{n}.png files still resolve via the '-body-' classifier below)
        const filename = `${slug}-body-${i + 1}.png`;

        // Extract section context for this image position
        const matchIndex = matches[i].index ?? 0;
        const sectionCtx = extractSectionContext(content, matchIndex, matches[i][0]);
        console.log(`   📌 Body ${i + 1} context — Heading: "${sectionCtx.sectionHeading}" | Type: ${sectionCtx.sectionType} | Topics: ${sectionCtx.sectionKeyTopics.join(', ')}`);

        const localPath = path.join(PUBLIC_IMAGE_DIR, filename);
        let shouldGenerate = false;

        if (!fs.existsSync(localPath)) {
            shouldGenerate = true;
        } else if (FORCE_REGEN) {
            console.log(`🔄 FORCE_REGEN active. Regenerating body image: ${filename}`);
            shouldGenerate = true;
        } else {
            const buf = fs.readFileSync(localPath);
            if (!isValidImage(buf)) {
                console.log(`⚠️ Found invalid existing body file ${filename} (${buf.length}b). Will regenerate.`);
                shouldGenerate = true;
            }
        }

        if (shouldGenerate) {
            console.log(`🔍 Processing body image ${i + 1}: "${description.slice(0, 50)}..."`);
            const contextTitle = `${data.title} — ${description}`;
            const imagePath = await generateImage(
                contextTitle,
                filename,
                data.category || 'default',
                typeof data.description === 'string' ? data.description : '',
                'body',
                i,
                sectionCtx
            );
            if (imagePath) {
                newContent = newContent.replace(matches[i][0], `![${description}](${imagePath})`);
                modified = true;
                await delay(3000);
            }
        } else {
            if (newContent.includes(matches[i][0])) {
                newContent = newContent.replace(matches[i][0], `![${description}](/images/posts/${filename})`);
                modified = true;
            }
        }
    }

    // ── 2. Existing image links ─────────────────────────────────────────────
    const imageLinkRegex = /!\[(.*?)\]\(\/(images\/posts\/.*?)\)/g;
    const linkMatches = Array.from(newContent.matchAll(imageLinkRegex));

    for (let idx = 0; idx < linkMatches.length; idx++) {
        const match = linkMatches[idx];
        const alt = match[1];
        const publicPath = match[2];
        const localPath = path.join(process.cwd(), 'public', publicPath);

        let shouldGenerate = false;
        if (!fs.existsSync(localPath)) {
            shouldGenerate = true;
        } else if (FORCE_REGEN) {
            console.log(`🔄 FORCE_REGEN active. Regenerating link image: ${publicPath}`);
            shouldGenerate = true;
        } else {
            const buf = fs.readFileSync(localPath);
            if (!isValidImage(buf)) {
                console.log(`⚠️ Found invalid linked image file ${publicPath} (${buf.length}b). Will regenerate.`);
                shouldGenerate = true;
            }
        }

        if (shouldGenerate) {
            console.log(`⚠️ Missing or invalid image file: ${publicPath}. Regenerating...`);
            const filename = path.basename(publicPath);
            const isBody = filename.includes('-body-');
            const bodyIdx = isBody ? parseInt(filename.match(/-body-(\d+)/)?.[1] || '1') - 1 : 0;

            // Extract section context for body images
            let linkSectionCtx: SectionContext | undefined;
            if (isBody && match.index !== undefined) {
                linkSectionCtx = extractSectionContext(newContent, match.index, match[0]);
            }

            const regenPath = await generateImage(
                alt || data.title,
                filename,
                data.category || 'default',
                typeof data.description === 'string' ? data.description : '',
                isBody ? 'body' : 'thumbnail',
                bodyIdx,
                linkSectionCtx
            );
            // save()가 실제 포맷에 맞춰 확장자를 바꿨을 수 있다. 그러면 본문 링크도 따라가야 한다.
            if (regenPath && regenPath !== `/${publicPath}`) {
                console.log(`   🔗 본문 링크 갱신: ${publicPath} → ${regenPath.slice(1)}`);
                newContent = newContent.replace(match[0], `![${alt}](${regenPath})`);
                modified = true;
            }
            await delay(3000);
        }
    }

    if (modified) {
        const updatedFile = matter.stringify(newContent, data);
        fs.writeFileSync(filePath, updatedFile);
        console.log(`✨ Updated MDX: ${filePath}`);
    }
}

async function main() {
    const targetFile = process.argv[2];
    console.log("🤖 Image Bot v2 starting...");
    console.log("📋 Changes: topic-specific prompts, no Picsum fallback, duplicate detection");

    if (!fs.existsSync(PUBLIC_IMAGE_DIR)) fs.mkdirSync(PUBLIC_IMAGE_DIR, { recursive: true });

    const walk = async (dir: string) => {
        const files = fs.readdirSync(dir);
        for (const file of files) {
            const fullPath = path.join(dir, file);
            if (fs.statSync(fullPath).isDirectory()) {
                await walk(fullPath);
            } else if (file.endsWith('.mdx')) {
                await processFile(fullPath);
            }
        }
    };

    if (targetFile) {
        if (!fs.existsSync(targetFile)) {
            console.error(`❌ File not found: ${targetFile}`);
        } else if (fs.statSync(targetFile).isDirectory()) {
            console.log(`📂 Targeting directory: ${targetFile}`);
            await walk(targetFile);
        } else {
            console.log(`🎯 Targeting specific file: ${targetFile}`);
            await processFile(targetFile);
        }
    } else {
        console.log("📂 Scanning all content...");
        await walk(CONTENT_DIR);
    }

    // ── Summary ─────────────────────────────────────────────────────────────
    console.log(`\n${'═'.repeat(60)}`);
    console.log(`🏁 Image Bot v2 finished.`);
    console.log(`📊 Total unique images tracked: ${generatedImageHashes.size}`);
    console.log(`${'═'.repeat(60)}`);
}

main().catch(console.error);
