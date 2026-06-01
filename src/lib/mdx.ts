
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
    lastModified?: string;
}

const contentDirectory = path.join(process.cwd(), "content");

// 한국어 기준 분당 약 500자 읽기 속도
export function calculateReadingTime(content: string): string {
    const text = content.replace(/[#*`\[\]()!>\-|]/g, '').trim();
    const charCount = text.length;
    const minutes = Math.ceil(charCount / 500);
    return `${Math.max(1, minutes)}분`;
}

// Build-time cache: 모든 MDX를 한 번만 walk + parse 하고 모든 호출에서 재사용.
// 캐시 없을 때 페이지당 getAllPosts/getPostBySlug/getPostsByCategory/getRelatedPosts/getAdjacentPosts가
// 매번 content 트리 전체를 readdir + readFileSync + matter() 재파싱 → 글 수 × 페이지 수의 N² 파싱으로
// 빌드가 느려짐. (ai-blog / saju-blog _allPostsCache 패턴 미러)
let _allPostsCache: Map<string, MDXPost> | null = null;

// content 트리를 한 번만 walk 해서 slug → MDXPost 맵을 만든다.
// readdir 순서를 그대로 유지하고, 같은 slug가 여러 카테고리에 있으면 먼저 만난 것(원래 getPostBySlug break 동작)을 보존.
function loadAllPosts(): Map<string, MDXPost> {
    if (_allPostsCache) return _allPostsCache;

    const cache = new Map<string, MDXPost>();
    if (!fs.existsSync(contentDirectory)) {
        _allPostsCache = cache;
        return cache;
    }

    const categories = fs.readdirSync(contentDirectory);
    categories.forEach((category) => {
        const categoryPath = path.join(contentDirectory, category);
        if (fs.statSync(categoryPath).isDirectory()) {
            const files = fs.readdirSync(categoryPath);
            files.forEach((file) => {
                if (file.endsWith(".mdx")) {
                    const slug = file.replace(/\.mdx$/, "");
                    if (cache.has(slug)) return; // first category in readdir order wins
                    const filePath = path.join(categoryPath, file);
                    const fileContent = fs.readFileSync(filePath, "utf8");
                    const { data, content } = matter(fileContent);
                    const lastModified = fs.statSync(filePath).mtime.toISOString();

                    cache.set(slug, {
                        slug,
                        category,
                        content,
                        frontmatter: data as MDXPost["frontmatter"],
                        readingTime: calculateReadingTime(content),
                        lastModified,
                    });
                }
            });
        }
    });

    _allPostsCache = cache;
    return cache;
}

// Get all MDX files recursively
export function getAllPosts(): MDXPost[] {
    const allPosts = Array.from(loadAllPosts().values());

    // Sort posts by date (newest first). Copy already returned by Array.from, so cache order stays intact.
    return allPosts.sort((a, b) => {
        return new Date(b.frontmatter.date).getTime() - new Date(a.frontmatter.date).getTime();
    });
}

export function getPostBySlug(slug: string): MDXPost | null {
    return loadAllPosts().get(slug) ?? null;
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
