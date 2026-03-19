/**
 * MDX Syntax Auto-Fixer
 * Fixes common MDX issues that break static export builds:
 * - Broken closing tags (</n>, </nCallout>, </nazar>, etc.)
 * - Bare <br> tags → <br />
 * - HTML comments <!-- --> → {/* */}
 * - Indented code fences (4-space indent)
 * - Unescaped {{ }} template literals
 */

import fs from "fs";
import path from "path";

const contentDir = path.join(process.cwd(), "content");
const KNOWN_COMPONENTS = ["Callout", "ProsCons", "KeyTakeaway", "YouTubeEmbed"];

let totalFixed = 0;
let totalIssues = 0;

function fixFile(filePath: string): number {
    let content = fs.readFileSync(filePath, "utf8");
    const original = content;
    const rel = path.relative(contentDir, filePath);
    const issues: string[] = [];

    // 1. Fix indented code fences (4 spaces before ```)
    const fenceFixed = content.replace(/^( {4})`{3}/gm, "```");
    if (fenceFixed !== content) {
        issues.push("indented code fences");
        content = fenceFixed;
    }

    // 2. Fix HTML comments → MDX comments
    const commentFixed = content.replace(/<!--\s*(.*?)\s*-->/g, "{/* $1 */}");
    if (commentFixed !== content) {
        issues.push("HTML comments");
        content = commentFixed;
    }

    // 3. Fix bare <br> tags (not inside code blocks)
    const lines = content.split("\n");
    let inCodeBlock = false;
    let changed = false;

    for (let i = 0; i < lines.length; i++) {
        if (lines[i].trim().startsWith("```")) {
            inCodeBlock = !inCodeBlock;
            continue;
        }
        if (inCodeBlock) continue;

        // Fix bare <br> → <br />
        if (/<br>/.test(lines[i]) && !/<br\s*\/>/.test(lines[i])) {
            lines[i] = lines[i].replace(/<br>/g, "<br />");
            changed = true;
        }
    }
    if (changed) {
        issues.push("bare <br> tags");
        content = lines.join("\n");
    }

    // 4. Fix broken closing tags
    const brokenTagPattern = /<\/([a-z][a-zA-Z]*)>/g;
    const validHtmlTags = new Set([
        "div", "span", "a", "p", "ul", "ol", "li", "table", "tr", "td", "th",
        "thead", "tbody", "code", "pre", "blockquote", "em", "strong", "b", "i",
        "u", "s", "small", "mark", "del", "ins", "sub", "sup", "details", "summary",
        "h1", "h2", "h3", "h4", "h5", "h6", "img", "br", "hr", "nav", "header",
        "footer", "section", "article", "main", "aside", "figure", "figcaption",
        "button", "form", "input", "label", "select", "option", "textarea",
        "video", "audio", "source", "abbr", "caption", "title",
    ]);

    const contentLines = content.split("\n");
    inCodeBlock = false;
    let tagFixed = false;

    for (let i = 0; i < contentLines.length; i++) {
        if (contentLines[i].trim().startsWith("```")) {
            inCodeBlock = !inCodeBlock;
            continue;
        }
        if (inCodeBlock) continue;

        const match = contentLines[i].match(/<\/([a-z][a-zA-Z]*)>/);
        if (match && !validHtmlTags.has(match[1])) {
            // Find the most recent unclosed component tag
            for (let j = i - 1; j >= 0; j--) {
                const openMatch = contentLines[j].match(new RegExp(`<(${KNOWN_COMPONENTS.join("|")})\\s`));
                if (openMatch) {
                    contentLines[i] = contentLines[i].replace(match[0], `</${openMatch[1]}>`);
                    tagFixed = true;
                    break;
                }
            }
        }
    }
    if (tagFixed) {
        issues.push("broken closing tags");
        content = contentLines.join("\n");
    }

    // 5. Fix unescaped {{ }} (outside code blocks)
    const escapedLines = content.split("\n");
    inCodeBlock = false;
    let braceFixed = false;

    for (let i = 0; i < escapedLines.length; i++) {
        if (escapedLines[i].trim().startsWith("```")) {
            inCodeBlock = !inCodeBlock;
            continue;
        }
        if (inCodeBlock) continue;

        if (/\{\{[^}]*\}\}/.test(escapedLines[i])) {
            escapedLines[i] = escapedLines[i].replace(/\{\{([^}]*)\}\}/g, '{"{"}{"{"}$1{"}"}{"}"}');
            braceFixed = true;
        }
    }
    if (braceFixed) {
        issues.push("unescaped {{ }}");
        content = escapedLines.join("\n");
    }

    // Write if changed
    if (content !== original) {
        fs.writeFileSync(filePath, content);
        totalFixed++;
        totalIssues += issues.length;
        console.log(`  Fixed: ${rel} (${issues.join(", ")})`);
        return issues.length;
    }
    return 0;
}

function scanDir(dir: string) {
    for (const f of fs.readdirSync(dir)) {
        const fp = path.join(dir, f);
        if (fs.statSync(fp).isDirectory()) {
            scanDir(fp);
        } else if (f.endsWith(".mdx")) {
            fixFile(fp);
        }
    }
}

console.log("🔧 MDX Syntax Auto-Fixer running...");
if (fs.existsSync(contentDir)) {
    scanDir(contentDir);
}

if (totalFixed > 0) {
    console.log(`✅ Fixed ${totalIssues} issues in ${totalFixed} files`);
} else {
    console.log("✅ No MDX syntax issues found");
}
