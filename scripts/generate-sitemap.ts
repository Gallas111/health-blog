import fs from "fs";
import path from "path";
import matter from "gray-matter";

const baseUrl = "https://www.wellnesstodays.com";
const contentDir = path.join(process.cwd(), "content");

function getAllSlugs(): { slug: string; date: string }[] {
    if (!fs.existsSync(contentDir)) return [];
    const results: { slug: string; date: string }[] = [];
    const categories = fs.readdirSync(contentDir).filter(f =>
        fs.statSync(path.join(contentDir, f)).isDirectory()
    );
    for (const cat of categories) {
        const catDir = path.join(contentDir, cat);
        const files = fs.readdirSync(catDir).filter(f => f.endsWith(".mdx"));
        for (const file of files) {
            const raw = fs.readFileSync(path.join(catDir, file), "utf-8");
            const { data } = matter(raw);
            if (data.noindex) continue;
            results.push({
                slug: file.replace(/\.mdx$/, ""),
                date: data.dateModified || data.updated || data.date || new Date().toISOString(),
            });
        }
    }
    return results;
}

const staticPages = ["", "/blog", "/about", "/contact", "/privacy", "/terms"];
const categories = ["symptoms", "home-remedies", "supplements", "daily-health", "pharmacy-guide"];
const posts = getAllSlugs();
const today = new Date().toISOString().split("T")[0];

let xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

for (const page of staticPages) {
    const isHome = page === "";
    const isBlog = page === "/blog";
    const priority = isHome ? "1.0" : isBlog ? "0.8" : "0.3";
    const changefreq = isHome ? "daily" : isBlog ? "daily" : "yearly";
    xml += `  <url><loc>${baseUrl}${page}</loc><lastmod>${today}</lastmod><changefreq>${changefreq}</changefreq><priority>${priority}</priority></url>\n`;
}
for (const cat of categories) {
    xml += `  <url><loc>${baseUrl}/blog/category/${cat}</loc><lastmod>${today}</lastmod><changefreq>weekly</changefreq><priority>0.7</priority></url>\n`;
}
for (const post of posts) {
    const d = post.date.replace(/\.\s*/g, "-").replace(/-$/, "").trim();
    const date = new Date(d);
    const lastmod = isNaN(date.getTime()) ? today : date.toISOString().split("T")[0];
    xml += `  <url><loc>${baseUrl}/blog/${post.slug}</loc><lastmod>${lastmod}</lastmod><changefreq>monthly</changefreq><priority>0.6</priority></url>\n`;
}

xml += `</urlset>\n`;

fs.writeFileSync(path.join(process.cwd(), "public", "sitemap.xml"), xml);
console.log(`✅ sitemap.xml generated (${staticPages.length + categories.length + posts.length} URLs)`);
