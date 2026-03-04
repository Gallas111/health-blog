
import fs from 'fs';
import path from 'path';

const CONTENT_DIR = path.join(process.cwd(), 'content');

function hasHtmlTags(content: string): boolean {
    return (
        content.includes('<!DOCTYPE html>') ||
        content.includes('<html>') ||
        content.includes('<body>') ||
        content.includes('<head>') ||
        content.includes('<style>') ||
        content.includes('<div') ||
        content.includes('<span')
    );
}

function cleanup() {
    console.log("🧹 Starting MDX Cleanup (Direct HTML Detection Mode)...");

    if (!fs.existsSync(CONTENT_DIR)) {
        console.error("❌ Content directory not found!");
        return;
    }

    const categories = fs.readdirSync(CONTENT_DIR);
    let deletedCount = 0;
    let keptCount = 0;

    categories.forEach(category => {
        const catDir = path.join(CONTENT_DIR, category);
        if (!fs.statSync(catDir).isDirectory()) return;

        const files = fs.readdirSync(catDir).filter(f => f.endsWith('.mdx'));

        files.forEach(file => {
            const filePath = path.join(catDir, file);
            const content = fs.readFileSync(filePath, 'utf-8');

            if (hasHtmlTags(content)) {
                console.log(`🗑️  [DELETE] HTML file: ${category}/${file}`);
                fs.unlinkSync(filePath);
                deletedCount++;
            } else {
                console.log(`✅ [KEEP] Clean: ${category}/${file}`);
                keptCount++;
            }
        });
    });

    console.log(`\n✨ Cleanup Complete!`);
    console.log(`- Kept (Clean): ${keptCount}`);
    console.log(`- Deleted (HTML): ${deletedCount}`);
}

cleanup();
