import fs from 'fs';
import path from 'path';

const CONTENT_DIR = path.join(process.cwd(), 'content');

function walk(dir: string, callback: (filePath: string) => void) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            walk(fullPath, callback);
        } else if (file.endsWith('.mdx')) {
            callback(fullPath);
        }
    }
}

console.log('🔄 Starting bulk rename of TL;DR to Korean Summary...');

walk(CONTENT_DIR, (filePath) => {
    let content = fs.readFileSync(filePath, 'utf-8');
    const originalContent = content;

    // Replace both H2 and H3 variants as they might vary
    content = content.replace(/### 핵심 요약 \(TL;DR\)/g, '### 핵심 요약 (3줄 요약)');
    content = content.replace(/## 핵심 요약 \(TL;DR\)/g, '## 핵심 요약 (3줄 요약)');
    // Also handle possible Markdown variants just in case
    content = content.replace(/\*\*핵심 요약 \(TL;DR\)\*\*/g, '**핵심 요약 (3줄 요약)**');

    if (content !== originalContent) {
        fs.writeFileSync(filePath, content, 'utf-8');
        console.log(`✅ Updated: ${path.relative(process.cwd(), filePath)}`);
    }
});

console.log('🏁 Bulk rename finished.');
