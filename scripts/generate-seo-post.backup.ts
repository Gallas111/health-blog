
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import OpenAI from 'openai';
// Imports removed
import matter from 'gray-matter';

// Load environment variables
dotenv.config({ path: '.env.local' });

// --- Configuration ---
const CONTENT_DIR = path.join(process.cwd(), 'content');

// Fallback Image Strategy (Safe Mode)
const SAFE_FALLBACK_PROMPT = "modern_saas_dashboard_ui_clean_white_blue_charts_analytics_high_resolution";

// --- OpenAI Setup ---
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

// --- Helper Functions ---

const getToday = () => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
};

// RSS and Scraping functions removed

// Ultimate Fallback: High-quality Unsplash images (No "AI Brain" / "Robots")
const CURATED_STOCK_IMAGES = [
    "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=1000", // Charts/Graphs
    "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&q=80&w=1000", // Macbook Coding
    "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?auto=format&fit=crop&q=80&w=1000", // Person typing
    "https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&q=80&w=1000", // Team meeting
    "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=1000"  // Data dashboard
];

// [New Function] Download Body Image with Fallback and User-Agent
async function downloadBodyImage(url: string, filename: string, attempt = 1): Promise<string | null> {
    try {
        const decodedUrl = decodeURIComponent(url);
        console.log(`⬇️ Downloading body image (Attempt ${attempt}): ${url}`);

        const res = await fetch(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
            }
        });
        if (!res.ok) throw new Error(`Status ${res.status}`);
        const buffer = Buffer.from(await res.arrayBuffer());

        const publicDir = path.join(process.cwd(), 'public/images');
        if (!fs.existsSync(publicDir)) fs.mkdirSync(publicDir, { recursive: true });

        const filepath = path.join(publicDir, filename);
        fs.writeFileSync(filepath, buffer);
        console.log(`✅ Saved body image to: public/images/${filename}`);
        return `/images/${filename}`;
    } catch (e) {
        console.error(`❌ Error downloading body image ${url}:`, e);

        // Attempt 2: Retry with SAFE FALLBACK PROMPT (Simplified Pollinations)
        if (attempt === 1) {
            console.log("⚠️ Detailed generation failed. Retrying with SAFE MODE (Minimalist UI)...");
            const fallbackUrl = `https://image.pollinations.ai/prompt/${SAFE_FALLBACK_PROMPT}?width=800&height=450&nologo=true`;
            return downloadBodyImage(fallbackUrl, filename, 2);
        }

        // Attempt 3: Ultimate Fallback (Curated Stock Photos)
        if (attempt === 2) {
            console.log("⚠️ Generation completely failed. Using CURATED STOCK PHOTO as final fallback...");
            const stockUrl = CURATED_STOCK_IMAGES[Math.floor(Math.random() * CURATED_STOCK_IMAGES.length)];
            return downloadBodyImage(stockUrl, filename, 3);
        }

        return null;
    }
}

// [New Function] Generate Thumbnail with DALL-E 3 (Design System Aligned)
async function generateThumbnail(prompt: string, slug: string) {
    console.log("🎨 Generating unique thumbnail with DALL-E 3...");
    try {
        const response = await openai.images.generate({
            model: "dall-e-3",
            prompt: `Modern SaaS application dashboard interface for: ${prompt}. Style: Clean UI design, high resolution, white background with subtle blue gradients, data visualization elements, professional software look, no text.`,
            n: 1,
            size: "1024x1024",
        });

        if (!response.data || !response.data[0]) {
            console.error("❌ No image data returned from DALL-E");
            const fallbackUrl = CURATED_STOCK_IMAGES[Math.floor(Math.random() * CURATED_STOCK_IMAGES.length)];
            return downloadBodyImage(fallbackUrl, `${slug}.png`, 3);
        }

        const imageUrl = response.data[0].url;
        if (!imageUrl) {
            console.error("❌ No image URL in response");
            const fallbackUrl = CURATED_STOCK_IMAGES[Math.floor(Math.random() * CURATED_STOCK_IMAGES.length)];
            return downloadBodyImage(fallbackUrl, `${slug}.png`, 3);
        }

        // Download and Save
        const imageRes = await fetch(imageUrl);
        const buffer = Buffer.from(await imageRes.arrayBuffer());

        // Ensure public/images exists
        const publicDir = path.join(process.cwd(), 'public/images');
        if (!fs.existsSync(publicDir)) fs.mkdirSync(publicDir, { recursive: true });

        const filename = `${slug}.png`;
        const filepath = path.join(publicDir, filename);
        fs.writeFileSync(filepath, buffer);
        console.log(`✅ Saved thumbnail to public/images/${filename}`);

        return `/images/${filename}`;
    } catch (error) {
        console.error("❌ DALL-E Generation Failed:", error);
        const fallbackUrl = CURATED_STOCK_IMAGES[Math.floor(Math.random() * CURATED_STOCK_IMAGES.length)];
        return downloadBodyImage(fallbackUrl, `${slug}.png`, 3);
    }
}

// [New Function] Get all existing MDX posts
function getAllExistingPosts() {
    const posts: { slug: string; title: string; category: string }[] = [];
    if (!fs.existsSync(CONTENT_DIR)) return posts;

    const categories = fs.readdirSync(CONTENT_DIR);
    categories.forEach(category => {
        const catDir = path.join(CONTENT_DIR, category);
        if (fs.statSync(catDir).isDirectory()) {
            const files = fs.readdirSync(catDir);
            files.forEach(file => {
                if (file.endsWith('.mdx')) {
                    const content = fs.readFileSync(path.join(catDir, file), 'utf-8');
                    const { data } = matter(content);
                    posts.push({
                        slug: file.replace('.mdx', ''),
                        title: data.title,
                        category: category
                    });
                }
            });
        }
    });
    return posts;
}

function getExistingPostTitles(): string[] {
    return getAllExistingPosts().map(p => p.title);
}

function getExistingSlugs(): { slug: string; title: string }[] {
    return getAllExistingPosts().map(p => ({ slug: p.slug, title: p.title }));
}

// [New Function] Calculate read time from HTML content
function calculateReadTime(html: string): string {
    // Strip HTML tags and count Korean characters
    const text = html.replace(/<[^>]*>/g, '').replace(/\s+/g, '');
    const charCount = text.length;
    // Average Korean reading speed: ~500 chars/min
    const minutes = Math.max(3, Math.ceil(charCount / 500));
    return `${minutes} min read`;
}

// [New Function] Process HTML to download and replace images
// [New Function] Generate a random seed for image variety
function generateRandomSeed(): number {
    return Math.floor(Math.random() * 1000000);
}

// [New Function] Process Markdown to download and replace images
async function processMarkdownImages(markdown: string, slugBase: string): Promise<string> {
    let processedMarkdown = markdown;
    // Matches ![alt](src)
    const imgRegex = /!\[(.*?)\]\((.*?)\)/g;
    let match;
    const replacements = [];
    let counter = 1;

    // Use a loop to find all matches
    while ((match = imgRegex.exec(markdown)) !== null) {
        const alt = match[1];
        let src = match[2];

        if (src.startsWith('http')) {
            // Append random seed if using Pollinations and not already present
            if (src.includes('pollinations.ai') && !src.includes('&seed=')) {
                const separator = src.includes('?') ? '&' : '?';
                src = `${src}${separator}seed=${generateRandomSeed()}`;
            }

            const filename = `${slugBase}-body-${counter}-${Date.now()}.png`;
            const localPath = await downloadBodyImage(src, filename);
            if (localPath) {
                replacements.push({ original: match[2], replacement: localPath }); // Use original src for replacement key
            }
            counter++;
        }
    }

    // Replace all instances
    for (const rep of replacements) {
        // We replace the EXACT original URL found in the markdown
        processedMarkdown = processedMarkdown.replace(rep.original, rep.replacement);
    }

    return processedMarkdown;
}

// [New Function] Clean MDX content to ensure no HTML tags
function cleanGeneratedMdx(content: string): string {
    let cleaned = content;

    // Remove code block wrappers if present
    cleaned = cleaned.replace(/^```markdown\s*/i, '').replace(/\s*```$/, '');

    // Remove HTML boilerplate
    cleaned = cleaned.replace(/<!DOCTYPE html>/gi, '');
    cleaned = cleaned.replace(/<html[^>]*>/gi, '');
    cleaned = cleaned.replace(/<\/html>/gi, '');
    cleaned = cleaned.replace(/<head>[\s\S]*?<\/head>/gi, '');
    cleaned = cleaned.replace(/<body[^>]*>/gi, '');
    cleaned = cleaned.replace(/<\/body>/gi, '');
    cleaned = cleaned.replace(/<style>[\s\S]*?<\/style>/gi, '');

    // Remove any lingering script tags
    cleaned = cleaned.replace(/<script[\s\S]*?<\/script>/gi, '');

    // Trim whitespace
    return cleaned.trim();
}

// Define interface for TrendData
interface TrendData {
    selectedTopic: string;
    targetKeyword: string;
    intent: string;
    competitorInsights: string[];
    suggestedStructure: string[];
    category?: string; // Optional override
}

export async function generateSEOPost(trendData?: TrendData) {
    if (!process.env.OPENAI_API_KEY) {
        console.error("❌ OPENAI_API_KEY is missing!");
        return;
    }

    let strategy;
    let deepContext = "";

    // --- Target Categories for Tutorial Generation ---
    const TARGET_CATEGORIES = [
        "chatgpt-사용법",
        "claude-사용법",
        "ai-자동화",
        "ai-seo",
        "ai-블로그-만들기" // Corrected folder name for "AI 블로그 만들기"
    ];

    if (trendData) {
        // ... (existing manual override logic) ...
        console.log("🚀 Using provided Trend Data for generation...");
        strategy = {
            koreanTitle: trendData.selectedTopic,
            topicEnglish: trendData.targetKeyword,
            mainKeyword: trendData.targetKeyword,
            searchIntent: trendData.intent,
            structure: trendData.suggestedStructure
        };
    } else {
        // --- NEW: Topic-Based Generation Logic (No RSS) ---
        console.log("🎲 mode: Automatic Tutorial Generation (Topic-Based)...");

        // 1. Select Random Category
        const selectedCategory = TARGET_CATEGORIES[Math.floor(Math.random() * TARGET_CATEGORIES.length)];
        console.log(`📂 Selected Target Category: ${selectedCategory}`);

        // 2. Get Existing Titles in that Category
        const allPosts = getAllExistingPosts();
        // Relaxed filtering: Look for posts that arguably belong to this category based on title or folder
        const categoryPosts = allPosts.filter(p => p.category === selectedCategory || p.title.includes(selectedCategory.split('-')[0]));
        const existingTitles = categoryPosts.map(p => p.title);

        console.log(`📋 Found ${existingTitles.length} existing posts in this category.`);

        // 3. Prompt GPT-4o for a NEW Tutorial Topic
        const strategyPrompt = `
            You are an expert AI Tutorial Planner. 
            Target Category: "${selectedCategory}" (Korean Context)
            
            [Existing Articles - DO NOT REPEAT]
            ${existingTitles.map(t => `- ${t}`).join('\n')}
            
            [Goal]
            Suggest **ONE** high-demand, practical tutorial topic for this category that is NOT covered above.
            Focus on "How-to", "Guide", "Best Practices", or "Workflow" content.
            The topic should be specific and actionable (e.g., "How to automate X with Y", "Z Best prompts for coding").

            [Output Format - JSON Only]
            {
                "koreanTitle": "A click-worthy Korean title for the tutorial",
                "topicEnglish": "English description for DALL-E",
                "mainKeyword": "Primary SEO keyword (Korean or English)",
                "searchIntent": "How-to/Tutorial",
                "category": "${selectedCategory}" 
            }
        `;

        const strategyCompletion = await openai.chat.completions.create({
            model: "gpt-4o",
            messages: [{ role: "system", content: strategyPrompt }],
            response_format: { type: "json_object" }
        });

        strategy = JSON.parse(strategyCompletion.choices[0].message.content || "{}");

        // Override category in strategy to match the selected one
        // (Just in case GPT hallucinations)
        if (!strategy.category) strategy.category = selectedCategory;
    }

    console.log("✅ Selected Strategy:", strategy);

    // Determine Category using centralized config logic OR explicit override
    let category = "ai-news"; // Default fallback

    if (trendData?.category) {
        category = trendData.category;
        console.log(`📂 Using explicit category: ${category}`);
    } else {
        const titleLower = strategy.koreanTitle.toLowerCase();
        if (titleLower.includes("chatgpt")) category = "chatgpt-사용법";
        else if (titleLower.includes("claude")) category = "claude-사용법";
        else if (titleLower.includes("이미지") || titleLower.includes("image")) category = "ai-이미지-생성";
        else if (titleLower.includes("자동화") || titleLower.includes("automation")) category = "ai-자동화";
        else if (titleLower.includes("블로그") || titleLower.includes("수익")) category = "ai-blog";
        else if (titleLower.includes("seo")) category = "ai-seo";
    }

    // [Step 2.5] Generate Thumbnail & Clean Slug
    // Only allow Korean, English, numbers, and whitespace, then replace whitespace with hyphens
    let baseSlug = strategy.mainKeyword.replace(/[^a-zA-Z0-9가-힣\s]/g, '').replace(/\s+/g, '-').toLowerCase();

    // Check for duplicates and append suffix if needed
    let slug = baseSlug;
    let counter = 2;
    while (true) {
        // Simple check: check if slug exists in ANY category
        const existing = getExistingSlugs().find(p => p.slug === slug);
        if (!existing) break;
        slug = `${baseSlug}-${counter}`;
        counter++;
    }

    const thumbnailPath = await generateThumbnail(strategy.topicEnglish, slug);

    // [Step 2.6] Prepare Internal Links Context
    const allPosts = getExistingSlugs();
    const sameCategoryPosts = allPosts.filter(p => p.slug !== slug && p.slug.includes(category)).slice(0, 5);
    const otherPosts = allPosts.filter(p => !p.slug.includes(category)).sort(() => 0.5 - Math.random()).slice(0, 3);

    const linkContext = `
    [Linkable Articles within same category]
    ${sameCategoryPosts.map(p => `- Title: "${p.title}" (Path: /blog/${p.slug})`).join('\n')}

    [Other Recommended Articles]
    ${otherPosts.map(p => `- Title: "${p.title}" (Path: /blog/${p.slug})`).join('\n')}
    `;

    const writerPrompt = `
        You are an Expert Technical Writer. Write a high-retention **TUTORIAL** in Korean.
        Title: ${strategy.koreanTitle}
        Main Keyword: ${strategy.mainKeyword}
        Target Category: ${category}
        
        [Existing Articles]
        ${linkContext}
        
        **CRITICAL INTERNAL LINKING RULES**: 
        1.  **Series Header**: Start the post with a blockquote:
            > 이 글은 [${category}](/blog/category/${category}) 시리즈의 글입니다.
        2.  **Contextual Links**: 
            - When mentioning concepts covered in [Existing Articles], YOU MUST link to them using the EXACT path provided.
            - **IMPORTANT**: Link format must be relative: \`[Title](/blog/slug)\`. 
            - **NEVER** use "https://blog..." or "example.com". ONLY use \`/blog/...\`.
            - **Density**: You MUST include **5 to 8 internal links** naturally throughout the content. THIS IS CRITICAL.
            - If no relevant concept matches, do not force a link in the body.
        3.  **Further Reading (Recommended)**: 
            - At the very end, add a section exactly like this:
            ## 더 읽어보기
            - [Title from list](/blog/slug)
            - [Title from list](/blog/slug)
            - [Title from list](/blog/slug)
            - [Title from list](/blog/slug)
            - [Title from list](/blog/slug)
            - (Select 5 items from [Existing Articles] that are most relevant)

        [Image Generation Rules - CRITICAL]
        1.  **NO ABSTRACT ART**: Do not generate "brain networks", "robots shaking hands", or "futuristic cityscapes".
        2.  **REALISTIC UI FOCUS**: Every image must look like a **Real Software Screenshot** or **Technical Diagram**.
        3.  **Prompt Structure**:
            -   For Tools (ChatGPT, Claude): "High quality screenshot of [Tool Name] interface showing [Specific Action], clean white background, modern ui"
            -   For Concepts: "Minimalist flowchart diagram showing [Process], flat design, white background, blue accents"
            -   For Data: "Bar chart visualization of [Data Metric], modern saas dashboard style"
        4.  **Variety Injection (MANDATORY)**: Append this exact string to EVERY image prompt:
            ", unique layout, different UI composition, modern software interface, realistic screenshot, professional SaaS UI"
        5.  **Format**: Insert images using this specific Pollinations URL format:
            \`![Alt Text](https://image.pollinations.ai/prompt/[URL_ENCODED_PROMPT]?width=1280&height=720&nologo=true)\`
            (Do NOT manually add &seed= here, the script will add it automatically)

        [Requirements]
        - Format: **Pure Markdown Only** (NO HTML tags).
        - Structure: 
            1. **Introduction**: Hook + "Why read this?"
            2. **Prerequisites**: Tools needed.
            3. **Step-by-Step Guide**: H2/H3 structure. **MUST include at least 1 UI screenshot per major step.**
            4. **Practical Examples**: Code blocks / Prompts.
            5. **FAQ**: 3 core questions.
            6. **Conclusion**: Summary.
            7. **Further Reading**: As requested above.
        - Content: detailed, step-by-step, actionable.
        - **Total Images**: Minimum 4-5 images (mix of UI screenshots and diagrams).
        
        [Tone]
        Professional, technical, direct. Like a senior developer explaining to a junior.
    `;

    // max_tokens increased to 8000 for 2000+ char Korean content
    const writerCompletion = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [{ role: "system", content: writerPrompt }],
        max_tokens: 8000
    });

    const mdContent = writerCompletion.choices[0].message.content || "";

    // Clean the content first
    const cleanMd = cleanGeneratedMdx(mdContent);

    // [New Step] Process and Download Images in Body
    console.log("🖼️ Processing and downloading body images...");
    const finalMd = await processMarkdownImages(cleanMd, slug);

    // [New Step] Generate SEO-optimized excerpt via GPT
    console.log("📝 Generating SEO-optimized excerpt...");
    let excerpt = `${strategy.koreanTitle}에 대한 심층 분석과 인사이트.`;
    try {
        const excerptCompletion = await openai.chat.completions.create({
            model: "gpt-4o",
            messages: [{
                role: "system",
                content: `아래 블로그 글 제목을 보고, 검색 결과에 노출될 매력적인 메타 디스크립션(1~2문장, 80자 이내)을 한국어로 작성하세요. 클릭하고 싶게 만드세요. 제목: "${strategy.koreanTitle}". 키워드: ${strategy.mainKeyword}. 출력은 메타 디스크립션 텍스트만 출력하세요.`
            }],
            max_tokens: 100
        });
        excerpt = excerptCompletion.choices[0].message.content?.trim() || excerpt;
    } catch (e) {
        console.warn("⚠️ Excerpt generation failed, using default.");
    }

    // [New Step] Calculate read time from content
    const readTime = calculateReadTime(finalMd);
    console.log(`⏱️ Calculated read time: ${readTime}`);

    // Create MDX content
    console.log(`💾 Saving post to MDX...`);
    const mdxContent = `---
title: "${strategy.koreanTitle.replace(/"/g, '\\"')}"
description: "${excerpt.replace(/"/g, '\\"')}"
date: "${getToday()}"
category: "${category}"
tags: ["${category}", "${strategy.mainKeyword}"]
image: "${thumbnailPath}"
author: "HowtoAI"
---

${finalMd}
`;

    const categoryDir = path.join(CONTENT_DIR, category);
    if (!fs.existsSync(categoryDir)) fs.mkdirSync(categoryDir, { recursive: true });

    const filePath = path.join(categoryDir, `${slug}.mdx`);
    fs.writeFileSync(filePath, mdxContent);

    console.log(`✨ Done! High-SEO Post generated at ${filePath}`);
}

// Allow standalone execution
if (require.main === module) {
    generateSEOPost();
}
