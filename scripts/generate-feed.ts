import fs from "fs";
import path from "path";
import matter from "gray-matter";

const SITE_URL = "https://www.wellnesstodays.com";
const contentDir = path.join(process.cwd(), "content");

interface Post {
    slug: string;
    title: string;
    description: string;
    date: string;
    category: string;
}

function getAllPosts(): Post[] {
    if (!fs.existsSync(contentDir)) return [];
    const results: Post[] = [];
    const categories = fs.readdirSync(contentDir).filter(f =>
        fs.statSync(path.join(contentDir, f)).isDirectory()
    );
    for (const cat of categories) {
        const catDir = path.join(contentDir, cat);
        const files = fs.readdirSync(catDir).filter(f => f.endsWith(".mdx"));
        for (const file of files) {
            const raw = fs.readFileSync(path.join(catDir, file), "utf-8");
            const { data } = matter(raw);
            results.push({
                slug: file.replace(/\.mdx$/, ""),
                title: data.title || "",
                description: data.description || "",
                date: data.date || new Date().toISOString(),
                category: data.category || cat,
            });
        }
    }
    return results.sort((a, b) =>
        new Date(b.date).getTime() - new Date(a.date).getTime()
    );
}

const posts = getAllPosts();

const items = posts.slice(0, 30).map((post) => {
    const pubDate = new Date(post.date).toUTCString();
    const link = `${SITE_URL}/blog/${post.slug}`;
    return `    <item>
      <title><![CDATA[${post.title}]]></title>
      <link>${link}</link>
      <guid isPermaLink="true">${link}</guid>
      <description><![CDATA[${post.description}]]></description>
      <pubDate>${pubDate}</pubDate>
      <category>${post.category}</category>
    </item>`;
});

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>오늘도 건강</title>
    <link>${SITE_URL}</link>
    <description>증상별 원인과 대처법, 영양제 효능, 민간요법, 생활건강 상식까지 한 곳에서.</description>
    <language>ko</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${SITE_URL}/feed.xml" rel="self" type="application/rss+xml"/>
${items.join("\n")}
  </channel>
</rss>`;

fs.writeFileSync(path.join(process.cwd(), "public", "feed.xml"), xml);
console.log(`✅ feed.xml generated (${Math.min(posts.length, 30)} items)`);
