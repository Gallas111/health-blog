import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import OpenAI from 'openai';
import dotenv from 'dotenv';

dotenv.config();
dotenv.config({ path: '.env.local' });

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

const PUBLIC_IMAGE_DIR = path.join(process.cwd(), 'public', 'images', 'posts');
const CONTENT_DIR = path.join(process.cwd(), 'content');

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

async function generateImageHF(prompt: string, filename: string): Promise<string | null> {
    const filepath = path.join(PUBLIC_IMAGE_DIR, filename);

    // Always delete if it exists to force regeneration
    if (fs.existsSync(filepath)) {
        fs.unlinkSync(filepath);
    }

    const apiKey = process.env.HUGGINGFACE_API_KEY;
    if (!apiKey) {
        console.error("❌ HUGGINGFACE_API_KEY is missing.");
        return null;
    }

    console.log(`🎨 Generating Image (FLUX.1-schnell): ${filename}...`);
    const MODEL_URL = "https://router.huggingface.co/hf-inference/models/black-forest-labs/FLUX.1-schnell";

    // Enhanced prompt style
    const styleSuffix = ", professional Silicon Valley tech aesthetic, clean desktop UI, modern office setting, high resolution, 4k, minimalist composition. Ensure all UI elements look like European/Western software with no Asian characters.";
    const enhancedPrompt = prompt.endsWith('.') ? prompt.slice(0, -1) + styleSuffix : prompt + styleSuffix;

    let attempts = 0;
    while (attempts < 3) {
        try {
            const response = await fetch(MODEL_URL, {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${apiKey}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ inputs: enhancedPrompt })
            });

            if (!response.ok) {
                const errText = await response.text();
                if (response.status === 503) {
                    console.warn(`⏳ Model loading... retrying in 15s`);
                    await delay(15000);
                    attempts++;
                    continue;
                }
                throw new Error(`HF API Error: ${response.status} ${errText}`);
            }

            const arrayBuffer = await response.arrayBuffer();
            const buffer = Buffer.from(arrayBuffer);

            fs.writeFileSync(filepath, buffer);
            console.log(`✅ Saved Image: ${filename}`);
            return `/images/posts/${filename}`;

        } catch (err: any) {
            console.error(`❌ Failed generation (Attempt ${attempts + 1}): ${err.message}`);
            await delay(5000);
            attempts++;
        }
    }
    return null;
}

async function extractImagePrompts(content: string, count: number): Promise<string[]> {
    const prompt = `
    Analyze the following blog post content and extract ${count} specific image descriptions.
    The images must be "Contextual UI Screenshots" that visually explain the steps.

    ## Content:
    ${content.substring(0, 3000)}...

    ## Requirements:
    1. Describe a REAL SaaS UI screen (Western style).
    2. Focus on action and clarity.
    3. NO abstract concepts.
    4. NO Asian characters.

    ## Output Format (JSON Array of Strings):
    ["Description 1...", "Description 2...", "Description 3..."]
    `;

    const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [{ role: "system", content: "You are a Technical Editor." }, { role: "user", content: prompt }],
        response_format: { type: "json_object" }
    });

    const result = JSON.parse(response.choices[0].message.content || "{\"prompts\": []}");
    return result.prompts || result.descriptions || result.image_descriptions || result.result || result.images || [];
}

async function main() {
    const slug = process.argv[2];
    if (!slug) {
        console.error("Usage: npx ts-node scripts/regenerate-post-images.ts <slug>");
        process.exit(1);
    }

    console.log(`🚀 Regenerating images for: ${slug}`);

    // Find MDX file
    const findMdx = (dir: string): string | null => {
        const files = fs.readdirSync(dir);
        for (const file of files) {
            const fullPath = path.join(dir, file);
            if (fs.statSync(fullPath).isDirectory()) {
                const found = findMdx(fullPath);
                if (found) return found;
            } else if (file === `${slug}.mdx`) {
                return fullPath;
            }
        }
        return null;
    };

    const mdxPath = findMdx(CONTENT_DIR);
    if (!mdxPath) {
        console.error(`❌ MDX file not found for slug: ${slug}`);
        process.exit(1);
    }

    const mdxContent = fs.readFileSync(mdxPath, 'utf-8');
    const { data, content } = matter(mdxContent);

    // 1. Regenerate Thumbnail
    const thumbnailFilename = `${slug}-thumb.png`;
    const thumbPrompt = `editorial style illustration for blog post about ${data.title}, modern 3d render, colorful, minimal, isometric tech elements`;
    await generateImageHF(thumbPrompt, thumbnailFilename);

    // 2. Regenerate Body Images
    // Flexible regex to match any markdown image
    const imageRegex = /!\[(.*?)\]\((.*?)\)/g;
    const allMatches = Array.from(content.matchAll(imageRegex));

    // Filter for body images belonging to this post
    const bodyImageMatches = allMatches.filter(match =>
        match[2].includes(`${slug}-body-`)
    );

    if (bodyImageMatches.length > 0) {
        console.log(`🖼️  Found ${bodyImageMatches.length} body images to regenerate. Extracting prompts...`);
        const specificPrompts = await extractImagePrompts(content, bodyImageMatches.length);

        for (let i = 0; i < bodyImageMatches.length; i++) {
            const filename = `${slug}-body-${i + 1}.png`;
            const prompt = specificPrompts[i] || bodyImageMatches[i][1];
            await delay(15000); // Avoid rate limits
            await generateImageHF(prompt, filename);
        }
    } else {
        console.log("ℹ️  No matching body images found in MDX content.");
    }

    console.log("✨ All images regenerated successfully (or failed gracefully).");
}

main().catch(console.error);
