
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const CONTENT_DIR = path.join(process.cwd(), 'content');

// Helper to check for HTML usage
function detectHtml(content: string): string[] {
    const forbidden = [
        '<!DOCTYPE html>', '<html>', '<body>', '<head>', '<style>', '<div', '<span', '<script'
    ];
    return forbidden.filter(tag => content.includes(tag));
}

// Helper to check for H1 count (Should be exactly 1)
function countH1(content: string): number {
    // Remove code blocks first to avoid matching comments like # Comment
    const cleanContent = content.replace(/```[\s\S]*?```/g, '');
    const h1Regex = /^#\s+(.+)$/gm;
    return (cleanContent.match(h1Regex) || []).length;
}

export function validateMdx() {
    console.log("🔍 Starting MDX Validation...");

    if (!fs.existsSync(CONTENT_DIR)) {
        console.error("❌ Content directory not found!");
        return;
    }

    const categories = fs.readdirSync(CONTENT_DIR);
    let errorCount = 0;
    let fileCount = 0;

    categories.forEach(category => {
        const catDir = path.join(CONTENT_DIR, category);
        if (!fs.statSync(catDir).isDirectory()) return;

        const files = fs.readdirSync(catDir).filter(f => f.endsWith('.mdx'));

        files.forEach(file => {
            fileCount++;
            const filePath = path.join(catDir, file);
            const content = fs.readFileSync(filePath, 'utf-8');
            const { data, content: body } = matter(content);
            const relativePath = `${category}/${file}`;
            let fileErrors: string[] = [];

            // 1. Frontmatter Check
            const requiredFields = ['title', 'date', 'category', 'tags', 'image', 'author'];
            requiredFields.forEach(field => {
                if (!data[field]) fileErrors.push(`Missing required frontmatter: '${field}'`);
            });

            // 2. Description Length Check (SEO)
            if (data.description) {
                if (data.description.length < 10) fileErrors.push(`Description too short (${data.description.length} chars). Min 10.`);
                // Relaxed max length for now, warn if over 160
                if (data.description.length > 180) fileErrors.push(`Description likely too long (${data.description.length} chars). Rec: ~160.`);
            } else {
                fileErrors.push(`Missing 'description'`);
            }

            // 3. HTML Tag Check
            const foundHtml = detectHtml(body);
            if (foundHtml.length > 0) {
                fileErrors.push(`Forbidden HTML tags found: ${foundHtml.join(', ')}`);
            }

            // 4. H1 Check
            const h1Count = countH1(body);
            // MDX files usually don't need H1 if the title is handled by layout/metadata, 
            // BUT if we want internal H1 for Semantic HTML, it should be 1.
            // If the system relies on frontmatter 'title' as H1, then body H1 might be redundant or needed depending on layout.
            // Assuming strict semantic rule: Page should have one H1. 
            // If title is rendered as H1 by layout, body should NOT have H1.
            // Let's assume body should NOT have H1 if title is used. 
            // OR let's assume standard markdown doc where # Title is the first line.
            // Adjusting logic: Warn if > 1 H1.
            if (h1Count > 1) {
                fileErrors.push(`Found ${h1Count} H1 tags (#). Should have at most 1 (or 0 if title used).`);
            }

            // Report Errors
            if (fileErrors.length > 0) {
                console.error(`\n❌ Error in ${relativePath}:`);
                fileErrors.forEach(e => console.error(`   - ${e}`));
                errorCount++;
            }
        });
    });

    console.log(`\n✨ Validation Complete!`);
    console.log(`- Files Scanned: ${fileCount}`);
    console.log(`- Files with Errors: ${errorCount}`);

    if (errorCount > 0) process.exit(1);
}

// Allow standalone execution
if (require.main === module) {
    validateMdx();
}
