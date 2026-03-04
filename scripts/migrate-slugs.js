
const fs = require('fs');
const path = require('path');

// Configuration
const CONTENT_DIR = path.join(process.cwd(), 'content');
const REDIRECTS_FILE = path.join(process.cwd(), 'redirects.json');

// Helper to check if file exists (case insensitive for Windows safety)
function fileExists(filePath) {
    return fs.existsSync(filePath);
}

function getSafeSlug(dir, baseSlug, originalFilename) {
    let newSlug = baseSlug;
    let counter = 2;

    while (fileExists(path.join(dir, `${newSlug}.mdx`)) && `${newSlug}.mdx` !== originalFilename) {
        newSlug = `${baseSlug}-${counter}`;
        counter++;
    }
    return newSlug;
}

function migrateSlugs() {
    console.log("🚀 Starting URL Slug Migration (JS Version)...");

    let redirects = [];

    // Load existing redirects if any
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

            const match = file.match(/^(.*)-(\d{10,})\.mdx$/);

            if (match) {
                const originalBaseSlug = match[1];
                const timestamp = match[2];
                const oldSlug = file.replace('.mdx', '');

                const newBaseSlug = originalBaseSlug;

                const finalNewSlug = getSafeSlug(catDir, newBaseSlug, file);
                const newFilename = `${finalNewSlug}.mdx`;

                const oldPath = path.join(catDir, file);
                const newPath = path.join(catDir, newFilename);

                fs.renameSync(oldPath, newPath);
                console.log(`✅ Renamed: ${file} -> ${newFilename}`);

                redirects.push({
                    source: `/blog/${oldSlug}`,
                    destination: `/blog/${finalNewSlug}`,
                    permanent: true,
                });

                redirects.push({
                    source: `/blog/${encodeURIComponent(oldSlug)}`,
                    destination: `/blog/${finalNewSlug}`,
                    permanent: true,
                });

                changedCount++;
            }
        }
    }

    fs.writeFileSync(REDIRECTS_FILE, JSON.stringify(redirects, null, 2));
    console.log(`🎉 Migration complete! ${changedCount} files renamed.`);
    console.log(`💾 Redirects saved to ${REDIRECTS_FILE}`);
}

migrateSlugs();
