
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import OpenAI from 'openai';

dotenv.config({ path: '.env.local' });

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

const PUBLIC_IMAGE_DIR = path.join(process.cwd(), 'public', 'images', 'posts');
const API_KEY = process.env.HUGGINGFACE_API_KEY;
const MODEL_URL = "https://router.huggingface.co/hf-inference/models/black-forest-labs/FLUX.1-schnell";

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function generateImageHF(prompt, filename) {
    const filepath = path.join(PUBLIC_IMAGE_DIR, filename);
    // Overwrite existing images for regeneration

    console.log(`🎨 Regenerating Image: ${filename}...`);
    const enhancedPrompt = `${prompt}, professional Silicon Valley tech aesthetic, clean desktop UI, modern office setting, high resolution, 4k, minimalist composition. Ensure all UI elements look like European/Western software with no Asian characters.`;

    try {
        const response = await fetch(MODEL_URL, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${API_KEY}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ inputs: enhancedPrompt })
        });

        if (!response.ok) {
            throw new Error(`HF API Error: ${response.status} ${await response.text()}`);
        }

        const arrayBuffer = await response.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        fs.writeFileSync(filepath, buffer);
        console.log(`✅ Saved Image: ${filename}`);
        return true;
    } catch (err) {
        console.error(`❌ Failed: ${err.message}`);
        return false;
    }
}

async function run() {
    const slug = "bard-ai-blog-post-seo-optimization";
    const images = [
        { prompt: "editorial style illustration for blog post about Bard AI Blog Post SEO Optimization, modern 3d render, colorful, minimal, isometric tech elements", filename: `${slug}-thumb.png` },
        { prompt: "Bard AI Dashboard with SEO Template selection screen, professional software interface", filename: `${slug}-body-1.png` },
        { prompt: "Workflow diagram showing SEO optimization steps in a modern SaaS tool", filename: `${slug}-body-2.png` },
        { prompt: "Modern analytics dashboard showing SEO results and traffic growth", filename: `${slug}-body-3.png` }
    ];

    for (const img of images) {
        await generateImageHF(img.prompt, img.filename);
        await delay(5000); // 5s delay between regenerations
    }
}

run();
