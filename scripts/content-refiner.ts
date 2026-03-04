import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import dotenv from 'dotenv';
import { callGemini } from './utils/ai-utils';

dotenv.config();
dotenv.config({ path: '.env.local' });

const CONTENT_DIR = path.join(process.cwd(), 'content');

async function refineContent(content: string, title: string): Promise<{ refinedContent: string; refinedTitle: string }> {
    console.log(`✍️ Refining content and optimizing title for: "${title}"...`);

    const prompt = `
    As a Senior Health Editor and CTR Expert for a premium Korean health blog (오늘도 건강), refine the following Korean health blog post and its title.

    ## Goals:
    1. Title Optimization (CRITICAL):
       - Create a high-CTR, catchy Korean title based on the original title: "${title}".
       - Use power words like "완벽 가이드", "전문가 추천", "효과 입증된", "꼭 알아야 할", "2026년 최신".
       - Focus on health concern and practical solution angles.
    2. Humanize Body:
       - Remove repetitive or stiff AI-like phrasing.
       - Use natural, warm, yet professional Korean (trustworthy health advisor tone).
       - Ensure it doesn't sound like a direct translation.
    3. 요약: MUST add/update a section at the very top titled "핵심 요약 (3줄 요약)" with 3 punchy bullet points.
    4. Table of Contents: Immediately after 요약, add/update a "📋 목차" section with anchor links to all H2 headers.
    5. Integrity: Keep all MDX components (Callout, ProsCons, etc.) and images exactly as they are.
    6. Pharmacy Banner: Ensure the 약국찾자 CTA link (https://www.yakchatja.com) is preserved.
    7. Disclaimer: Ensure the medical disclaimer at the bottom is preserved.

    ## Original Content:
    ${content}

    ## Output Format (Strict JSON):
    {
      "title": "Optimized Korean Title",
      "body": "Full refined Markdown body starting from '핵심 요약 (3줄 요약)'"
    }
    `;

    try {
        const response = await callGemini(prompt, 'You are a Senior Health Editor and SEO Strategist. Output ONLY valid JSON.');

        // Clean up markdown code block wrapping if present
        let cleanJson = response.trim();
        if (cleanJson.startsWith('```json')) {
            cleanJson = cleanJson.substring(7, cleanJson.lastIndexOf('```')).trim();
        } else if (cleanJson.startsWith('```')) {
            cleanJson = cleanJson.substring(3, cleanJson.lastIndexOf('```')).trim();
        }

        const parsed = JSON.parse(cleanJson);
        return {
            refinedContent: parsed.body,
            refinedTitle: parsed.title
        };
    } catch (err: any) {
        console.error(`❌ Gemini Refinement failed: ${err.message}`);
        return { refinedContent: content, refinedTitle: title };
    }
}

async function processFile(filePath: string) {
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    const { data, content } = matter(fileContent);

    const { refinedContent, refinedTitle } = await refineContent(content, data.title || filePath);

    let hasChanged = false;
    if (refinedContent && refinedContent !== content) {
        hasChanged = true;
    }
    if (refinedTitle && refinedTitle !== data.title) {
        data.title = refinedTitle;
        hasChanged = true;
    }

    if (hasChanged) {
        const updatedFile = matter.stringify(refinedContent || content, data);
        fs.writeFileSync(filePath, updatedFile);
        console.log(`✨ Refined and updated: ${filePath}`);
    } else {
        console.log(`ℹ️ No changes needed for: ${filePath}`);
    }
}

async function main() {
    console.log("✨ Health Content Refiner Bot starting...");

    const walk = async (dir: string) => {
        if (!fs.existsSync(dir)) return;
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

    await walk(CONTENT_DIR);
    console.log("🏁 Health Content Refiner Bot finished.");
}

main().catch(console.error);
