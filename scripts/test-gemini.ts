import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

dotenv.config();
dotenv.config({ path: '.env.local' });

async function testGemini() {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
        console.error('❌ GEMINI_API_KEY is not set in .env.local');
        process.exit(1);
    }
    console.log(`✅ GEMINI_API_KEY found: ${apiKey.substring(0, 8)}...`);

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

    try {
        console.log('🔄 Calling Gemini 2.5 Flash API...');
        const result = await model.generateContent('Say "Gemini API is working correctly!" in Korean.');
        const text = result.response.text();
        console.log(`✅ Gemini Response: ${text}`);
        console.log('🎉 Gemini API key is valid and working!');
    } catch (err: any) {
        console.error(`❌ Gemini API call failed: ${err.message}`);
        process.exit(1);
    }
}

testGemini();
