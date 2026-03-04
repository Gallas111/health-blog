import { GoogleGenerativeAI } from '@google/generative-ai';
import * as dotenv from 'dotenv';
import path from 'path';

dotenv.config();
dotenv.config({ path: path.join(process.cwd(), '.env.local') });

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

async function main() {
    try {
        console.log('Fetching available models...');
        // The listModels method is not directly on genAI, but we can try to fetch it via the REST API or use a common ID.
        // Usually, gemini-1.5-flash-latest or gemini-pro works.
        // Let's try to just call a simple prompt with gemini-1.5-flash-latest first.
        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
        const result = await model.generateContent('List your model ID.');
        console.log('Success with gemini-1.5-flash:', result.response.text());
    } catch (err: any) {
        console.error('Failed with gemini-1.5-flash:', err.message);
    }

    try {
        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash-latest' });
        const result = await model.generateContent('List your model ID.');
        console.log('Success with gemini-1.5-flash-latest:', result.response.text());
    } catch (err: any) {
        console.error('Failed with gemini-1.5-flash-latest:', err.message);
    }
}

main();
