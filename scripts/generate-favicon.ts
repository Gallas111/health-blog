import fs from 'fs';
import path from 'path';
// import Replicate from 'replicate';
import dotenv from 'dotenv';
import * as https from 'https';
import * as http from 'http';

dotenv.config({ path: '.env.local' });


// const replicate = new Replicate({ auth: process.env.REPLICATE_API_TOKEN });

const PUBLIC_DIR = path.join(process.cwd(), 'public');

if (!fs.existsSync(PUBLIC_DIR)) {
    fs.mkdirSync(PUBLIC_DIR, { recursive: true });
}

// Robust downloadImage with User-Agent
function downloadImage(url: string, filepath: string): Promise<void> {
    return new Promise((resolve, reject) => {
        const client = url.startsWith('https') ? https : http;
        const options = {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
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

async function generateFavicon() {
    const filename = 'logo.png'; // Using PNG for favicon/logo
    const filepath = path.join(PUBLIC_DIR, filename);

    console.log(`🎨 Generating Favicon/Logo (FLUX.1): ${filename}...`);

    const fullPrompt = `
    A minimalist, high-quality app icon logo for an AI tech blog named "HowtoAI".
    Symbol: A stylized abstract 'H' merged with a circuit node or brain synapse.
    Style: Flat vector, modern SaaS aesthetic, rounded corners (iOS app icon style), solid background.
    Colors: Deep Navy (#002244) background, Electric Blue (#3b82f6) and White symbol.
    Vibe: Professional, intelligent, clean, high-tech.
    No slight, no 3D effects, no realistic shading, distinct stroke.
    `;

    try {
        console.log(`🚀 Using Pollinations.ai for ${filename}...`);
        const encoded = encodeURIComponent(fullPrompt.trim());
        const imageUrl = `https://image.pollinations.ai/prompt/${encoded}?width=1024&height=1024&model=flux&nologo=true`;

        await downloadImage(imageUrl, filepath);
        console.log(`✅ Saved Logo (Pollinations): ${filename}`);

    } catch (err: any) {
        console.error(`❌ Failed: ${filename} - ${err.message}`);
    }
}

generateFavicon();
