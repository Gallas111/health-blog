// Quick script to list available Gemini models for the API key
import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

dotenv.config();
dotenv.config({ path: '.env.local' });

const apiKey = process.env.GEMINI_API_KEY || '';

async function listModels() {
    console.log('Fetching available models...');
    const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`
    );
    const data = await res.json();
    if (data.models) {
        const flashModels = data.models
            .filter((m: any) => m.name.includes('flash') || m.name.includes('pro'))
            .map((m: any) => `  - ${m.name} (${m.displayName})`);
        console.log('Available flash/pro models:\n' + flashModels.join('\n'));
    } else {
        console.log(JSON.stringify(data, null, 2));
    }
}

listModels().catch(console.error);
