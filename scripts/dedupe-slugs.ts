
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const CONTENT_DIR = path.join(process.cwd(), 'content');

export function dedupeSlugs() {
    console.log("🔍 Checking for Duplicate Slugs...");

    if (!fs.existsSync(CONTENT_DIR)) {
        console.error("❌ Content directory not found!");
        return;
    }

    const categories = fs.readdirSync(CONTENT_DIR);
    const slugMap: { [slug: string]: string[] } = {};
    let duplicatesFound = 0;

    categories.forEach(category => {
        const catDir = path.join(CONTENT_DIR, category);
        if (!fs.statSync(catDir).isDirectory()) return;

        const files = fs.readdirSync(catDir).filter(f => f.endsWith('.mdx'));

        files.forEach(file => {
            // Slug derivation strategy:
            // 1. Explicit 'slug' in frontmatter?
            // 2. If not, filename (minus extension)

            const filePath = path.join(catDir, file);
            const content = fs.readFileSync(filePath, 'utf-8');
            const { data } = matter(content);

            let slug = data.slug;
            if (!slug) {
                slug = file.replace('.mdx', '');
            }

            if (!slugMap[slug]) {
                slugMap[slug] = [];
            }
            slugMap[slug].push(`${category}/${file}`);
        });
    });

    // Report Duplicates
    for (const [slug, paths] of Object.entries(slugMap)) {
        if (paths.length > 1) {
            console.error(`\n❌ Duplicate Slug Found: '${slug}'`);
            paths.forEach(p => console.error(`   - ${p}`));
            duplicatesFound++;
        }
    }

    if (duplicatesFound === 0) {
        console.log(`\n✨ No duplicate slugs found.`);
    } else {
        console.log(`\n⚠️ Found ${duplicatesFound} duplicate slugs.`);
        process.exit(1);
    }
}

// Allow standalone execution
if (require.main === module) {
    dedupeSlugs();
}
