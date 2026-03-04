import { MetadataRoute } from "next";
import { getAllPosts } from "@/lib/mdx";
import { CATEGORY_LIST } from "@/lib/categories";

function parseDate(dateStr: string): Date {
    if (!dateStr) return new Date();
    // Handle "2026. 02. 18" or "2026.02.18" → "2026-02-18"
    const normalized = dateStr
        .replace(/\.\s*/g, "-")  // "2026. 02. 18" → "2026-02-18-"
        .replace(/-$/, "")        // remove trailing dash
        .trim();
    const parsed = new Date(normalized);
    return isNaN(parsed.getTime()) ? new Date() : parsed;
}

export default function sitemap(): MetadataRoute.Sitemap {
    const baseUrl = "https://www.wellnesstodays.com";
    const posts = getAllPosts();

    const blogPosts = posts
        .filter((post) => !post.frontmatter.noindex)
        .map((post) => ({
            url: `${baseUrl}/blog/${post.slug}`,
            lastModified: parseDate(post.frontmatter.date),
        }));

    const categoryPages = CATEGORY_LIST.map((category) => ({
        url: `${baseUrl}/blog/category/${category.slug}`,
        lastModified: new Date(),
    }));

    return [
        {
            url: baseUrl,
            lastModified: new Date(),
        },
        {
            url: `${baseUrl}/blog`,
            lastModified: new Date(),
        },
        {
            url: `${baseUrl}/about`,
            lastModified: new Date(),
        },
        {
            url: `${baseUrl}/contact`,
            lastModified: new Date(),
        },
        {
            url: `${baseUrl}/privacy`,
            lastModified: new Date(),
        },
        {
            url: `${baseUrl}/terms`,
            lastModified: new Date(),
        },
        ...categoryPages,
        ...blogPosts,
    ];
}
