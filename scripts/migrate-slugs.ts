
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

// Configuration
const CONTENT_DIR = path.join(process.cwd(), 'content');
const REDIRECTS_FILE = path.join(process.cwd(), 'redirects.json');

interface Redirect {
    source: string;
    destination: string;
    permanent: boolean;
}

// Helper to check if file exists (case insensitive for Windows safety)
function fileExists(filePath: string): boolean {
    return fs.existsSync(filePath);
}

function getSafeSlug(dir: string, baseSlug: string, originalFilename: string): string {
    let newSlug = baseSlug;
    let counter = 2;

    // If the base slug already exists AND it's not the file we are currently renaming
    // (This handles the case where we might run the script multiple times or have partial state)
    while (fileExists(path.join(dir, `${newSlug}.mdx`)) && `${newSlug}.mdx` !== originalFilename) {
        newSlug = `${baseSlug}-${counter}`;
        counter++;
    }
    return newSlug;
}

async function migrateSlugs() {
    console.log("🚀 Starting URL Slug Migration...");

    let redirects: Redirect[] = [];

    // Load existing redirects if any, to append rather than overwrite
    if (fs.existsSync(REDIRECTS_FILE)) {
        try {
            redirects = JSON.parse(fs.readFileSync(REDIRECTS_FILE, 'utf-8'));
            console.log(`📦 Loaded ${redirects.length} existing redirects.`);
        } catch (e) {
            console.error("⚠️ Failed to load existing redirects. Starting fresh.");
        }
    }

    const categories = fs.readdirSync(CONTENT_DIR);
    let changedCount = 0;

    for (const category of categories) {
        const catDir = path.join(CONTENT_DIR, category);
        if (!fs.statSync(catDir).isDirectory()) continue;

        const files = fs.readdirSync(catDir);

        for (const file of files) {
            if (!file.endsWith('.mdx')) continue;

            // Check if file has timestamp suffix (hyphen followed by 10+ digits)
            // Example: some-post-title-1771400147956.mdx
            const match = file.match(/^(.*)-(\d{10,})\.mdx$/);

            if (match) {
                const originalBaseSlug = match[1]; // "some-post-title"
                const timestamp = match[2];
                const oldSlug = file.replace('.mdx', '');

                // Determine new clean slug
                // We keep the Korean/original base slug as requested
                const newBaseSlug = originalBaseSlug;

                const finalNewSlug = getSafeSlug(catDir, newBaseSlug, file);
                const newFilename = `${finalNewSlug}.mdx`;

                const oldPath = path.join(catDir, file);
                const newPath = path.join(catDir, newFilename);

                // Rename file
                fs.renameSync(oldPath, newPath);
                console.log(`✅ Renamed: ${file} -> ${newFilename}`);

                // Add to redirects
                // Note: We need to handle encoded URI components for Korean URLs
                redirects.push({
                    source: `/blog/${oldSlug}`,
                    destination: `/blog/${finalNewSlug}`,
                    permanent: true,
                });

                // We also redirect the encoded version just in case
                redirects.push({
                    source: `/blog/${encodeURIComponent(oldSlug)}`,
                    destination: `/blog/${finalNewSlug}`, // Destination doesn't need to be encoded in Next.js config usually, but let's keep it safe or standard
                    permanent: true,
                });

                changedCount++;
            }
        }
    }

    // Save redirects
    fs.writeFileSync(REDIRECTS_FILE, JSON.stringify(redirects, null, 2));
    console.log(`🎉 Migration complete! ${changedCount} files renamed.`);
    console.log(`💾 Redirects saved to ${REDIRECTS_FILE}`);
}

migrateSlugs();
