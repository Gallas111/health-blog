import { getAllPosts } from "@/lib/mdx";

const SITE_URL = "https://www.wellnesstodays.com";

export async function GET() {
    const posts = getAllPosts();

    const items = posts.slice(0, 30).map((post) => {
        const pubDate = new Date(post.frontmatter.date).toUTCString();
        const link = `${SITE_URL}/blog/${post.slug}`;
        const description = post.frontmatter.description || "";

        return `    <item>
      <title><![CDATA[${post.frontmatter.title}]]></title>
      <link>${link}</link>
      <guid isPermaLink="true">${link}</guid>
      <description><![CDATA[${description}]]></description>
      <pubDate>${pubDate}</pubDate>
      <category>${post.frontmatter.category || post.category}</category>
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

    return new Response(xml, {
        headers: {
            "Content-Type": "application/xml; charset=utf-8",
            "Cache-Control": "s-maxage=3600, stale-while-revalidate",
        },
    });
}
