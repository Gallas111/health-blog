
import fs from "fs";
import path from "path";
import matter from "gray-matter";

// Define the shape of our MDX metadata
export interface MDXPost {
    slug: string;
    category: string;
    content: string;
    frontmatter: {
        title: string;
        description?: string;
        date: string;
        category: string;
        tags?: string[];
        image?: string;
        relatedPosts?: string[];
        [key: string]: any;
    };
    readingTime?: string;
}

const contentDirectory = path.join(process.cwd(), "content");

// Get all MDX files recursively
export function getAllPosts(): MDXPost[] {
    if (!fs.existsSync(contentDirectory)) return [];

    const categories = fs.readdirSync(contentDirectory);
    const allPosts: MDXPost[] = [];

    categories.forEach((category) => {
        const categoryPath = path.join(contentDirectory, category);
        if (fs.statSync(categoryPath).isDirectory()) {
            const files = fs.readdirSync(categoryPath);
            files.forEach((file) => {
                if (file.endsWith(".mdx")) {
                    const filePath = path.join(categoryPath, file);
                    const fileContent = fs.readFileSync(filePath, "utf8");
                    const { data, content } = matter(fileContent);
                    const slug = file.replace(/\.mdx$/, "");

                    allPosts.push({
                        slug,
                        category,
                        content,
                        frontmatter: data as MDXPost["frontmatter"],
                    });
                }
            });
        }
    });

    // Sort posts by date (newest first)
    return allPosts.sort((a, b) => {
        return new Date(b.frontmatter.date).getTime() - new Date(a.frontmatter.date).getTime();
    });
}

export function getPostBySlug(slug: string): MDXPost | null {
    if (!fs.existsSync(contentDirectory)) return null;

    const categories = fs.readdirSync(contentDirectory);
    let foundPost: MDXPost | null = null;

    for (const category of categories) {
        const categoryPath = path.join(contentDirectory, category);
        if (fs.statSync(categoryPath).isDirectory()) {
            const filePath = path.join(categoryPath, `${slug}.mdx`);
            if (fs.existsSync(filePath)) {
                const fileContent = fs.readFileSync(filePath, "utf8");
                const { data, content } = matter(fileContent);
                foundPost = {
                    slug,
                    category,
                    content,
                    frontmatter: data as MDXPost["frontmatter"],
                };
                break;
            }
        }
    }

    return foundPost;
}

// Get posts by category
export function getPostsByCategory(category: string): MDXPost[] {
    const allPosts = getAllPosts();
    return allPosts.filter((post) => post.category === category);
}

// Get related posts based on tags (simple implementation)
export function getRelatedPosts(currentPost: MDXPost, limit: number = 3): MDXPost[] {
    const allPosts = getAllPosts();
    return allPosts
        .filter((post) => post.slug !== currentPost.slug) // Exclude current post
        .map((post) => {
            let score = 0;
            if (post.category === currentPost.category) score += 2;
            if (post.frontmatter.tags && currentPost.frontmatter.tags) {
                const sharedTags = post.frontmatter.tags.filter(tag => currentPost.frontmatter.tags?.includes(tag));
                score += sharedTags.length;
            }
            return { post, score };
        })
        .sort((a, b) => b.score - a.score)
        .slice(0, limit)
        .map((item) => item.post);
}

export function getHeadings(content: string) {
    // Simple regex to extract H2 and H3 headings
    // This matches: ## Title or ### Title
    const regex = /^(#{2,3})\s+(.*)$/gm;
    const headings = [];
    let match;

    while ((match = regex.exec(content)) !== null) {
        const text = match[2].trim().replace(/\*\*/g, '');
        // Generate ID compatible with rehype-slug (kebab-case)
        const id = text
            .toLowerCase()
            .replace(/\s+/g, '-')
            .replace(/[^\w\-\uAC00-\uD7A3]+/g, '');

        headings.push({
            level: match[1].length,
            text,
            id
        });
    }
    return headings;
}

export function getAdjacentPosts(slug: string) {
    const allPosts = getAllPosts();
    const index = allPosts.findIndex((p) => p.slug === slug);

    // Assuming getAllPosts returns newest first
    // Next (Newer) -> index - 1
    // Prev (Older) -> index + 1
    const next = index > 0 ? allPosts[index - 1] : null;
    const prev = index < allPosts.length - 1 ? allPosts[index + 1] : null;

    return { prev, next };
}
