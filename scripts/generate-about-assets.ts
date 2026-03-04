import fs from 'fs';
import path from 'path';
// import Replicate from 'replicate';
import dotenv from 'dotenv';
import * as https from 'https';
import * as http from 'http';

dotenv.config({ path: '.env.local' });


// const replicate = new Replicate({ auth: process.env.REPLICATE_API_TOKEN });

const PUBLIC_IMAGE_DIR = path.join(process.cwd(), 'public', 'images');

// Ensure image directory exists
if (!fs.existsSync(PUBLIC_IMAGE_DIR)) {
    fs.mkdirSync(PUBLIC_IMAGE_DIR, { recursive: true });
}

// Robust downloadImage with User-Agent
function downloadImage(url: string, filepath: string): Promise<void> {
    return new Promise((resolve, reject) => {
        const client = url.startsWith('https') ? https : http;
        const options = {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                // 'Referer': 'https://pollinations.ai/', // Optional, sometimes helps
            }
        };

        client.get(url, options, (res) => {
            if (res.statusCode === 301 || res.statusCode === 302) {
                downloadImage(res.headers.location!, filepath).then(resolve).catch(reject);
                return;
            }
            if (res.statusCode !== 200) {
                reject(new Error(`Failed to download image: StatusCode ${res.statusCode}`));
                return;
            }
            const fileStream = fs.createWriteStream(filepath);
            res.pipe(fileStream);
            fileStream.on('finish', () => { fileStream.close(); resolve(); });
            fileStream.on('error', reject);
        }).on('error', reject);
    });
}

async function generateAboutHero() {
    const filename = 'about-hero.png';
    const filepath = path.join(PUBLIC_IMAGE_DIR, filename);

    console.log(`🎨 Generating About Hero Image (FLUX.1): ${filename}...`);

    const fullPrompt = `
    A high-quality, flat vector illustration of a human and an AI robot working together on a futuristic holographic interface.
    Style: Minimalist SaaS tech interface, deep navy (#002244) and white, clean lines.
    Composition: Wide shot, balanced, plenty of whitespace on the sides.
    Vibe: Professional, collaborative, innovative, productivity.
    No photorealism, no 3D shading, no gradients, no complex textures.
    `;

    try {
        console.log(`🚀 Using Pollinations.ai for ${filename}...`);
        // Encode the prompt
        const encoded = encodeURIComponent(fullPrompt.trim());
        // Use image.pollinations.ai
        const imageUrl = `https://image.pollinations.ai/prompt/${encoded}?width=1024&height=1024&model=flux&nologo=true`;

        await downloadImage(imageUrl, filepath);
        console.log(`✅ Saved Image (Pollinations): ${filename}`);

    } catch (err: any) {
        console.error(`❌ Failed: ${filename} - ${err.message}`);
    }
}

generateAboutHero();
