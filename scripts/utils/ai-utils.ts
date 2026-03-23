import * as dotenv from 'dotenv';
import path from 'path';

dotenv.config();
dotenv.config({ path: path.join(process.cwd(), '.env.local') });

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || '';
const GROQ_API_KEY = process.env.GROQ_API_KEY || '';
const CF_ACCOUNT_ID = process.env.CF_ACCOUNT_ID || '';
const CF_API_TOKEN = process.env.CF_API_TOKEN || '';

// ─── 1순위: Gemini (최고 품질) ───
async function callGeminiDirect(prompt: string, systemInstruction?: string): Promise<string> {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`;
    const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            ...(systemInstruction && { systemInstruction: { parts: [{ text: systemInstruction }] } }),
        }),
    });
    if (response.status === 429) throw new Error('RATE_LIMIT');
    if (!response.ok) throw new Error(`Gemini error (${response.status}): ${await response.text()}`);
    const data = await response.json() as any;
    return data.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || '';
}

// ─── 2순위: Groq (빠르고 무료) ───
async function callGroq(prompt: string, systemInstruction?: string): Promise<string> {
    const messages: { role: string; content: string }[] = [];
    if (systemInstruction) messages.push({ role: 'system', content: systemInstruction });
    messages.push({ role: 'user', content: prompt });
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${GROQ_API_KEY}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ model: 'llama-3.3-70b-versatile', messages, max_tokens: 8192 }),
    });
    if (response.status === 429) throw new Error('RATE_LIMIT');
    if (!response.ok) throw new Error(`Groq error (${response.status}): ${await response.text()}`);
    const data = await response.json() as any;
    return data.choices?.[0]?.message?.content?.trim() || '';
}

// ─── 3순위: CF Workers AI (최후 폴백) ───
async function callCFWorkersAI(prompt: string, systemInstruction?: string): Promise<string> {
    const url = `https://api.cloudflare.com/client/v4/accounts/${CF_ACCOUNT_ID}/ai/run/@cf/meta/llama-3.3-70b-instruct-fp8-fast`;
    const messages: { role: string; content: string }[] = [];
    if (systemInstruction) messages.push({ role: 'system', content: systemInstruction });
    messages.push({ role: 'user', content: prompt });
    const response = await fetch(url, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${CF_API_TOKEN}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages, max_tokens: 8192 }),
    });
    if (!response.ok) throw new Error(`CF error (${response.status}): ${await response.text()}`);
    const data = await response.json() as any;
    return data.result?.response || '';
}

// ─── 메인: Gemini → Groq → CF Workers AI ───
const providers = [
    { name: 'Gemini', key: () => GEMINI_API_KEY, fn: callGeminiDirect },
    { name: 'Groq', key: () => GROQ_API_KEY, fn: callGroq },
    { name: 'CF Workers AI', key: () => CF_ACCOUNT_ID && CF_API_TOKEN, fn: callCFWorkersAI },
];

export async function callGemini(
    prompt: string,
    systemInstruction?: string,
    retries: number = 2
): Promise<string> {
    for (const provider of providers) {
        if (!provider.key()) continue;
        for (let attempt = 1; attempt <= retries; attempt++) {
            try {
                return await provider.fn(prompt, systemInstruction);
            } catch (err: any) {
                if (err.message === 'RATE_LIMIT') {
                    console.warn(`⚡ ${provider.name} 한도 초과 → 다음 provider로 전환`);
                    break;
                }
                if (attempt < retries) {
                    await new Promise(r => setTimeout(r, Math.pow(2, attempt) * 1000));
                } else {
                    console.warn(`⚠️ ${provider.name} 실패 → 다음 provider로 전환: ${err.message}`);
                    break;
                }
            }
        }
    }
    throw new Error('모든 AI provider 사용 불가. API 키를 확인하세요.');
}

export async function callGeminiJSON<T>(
    prompt: string,
    systemInstruction?: string,
    fallback?: T
): Promise<T> {
    try {
        const raw = await callGemini(prompt, systemInstruction);
        const cleaned = raw.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/i, '').trim();
        return JSON.parse(cleaned) as T;
    } catch (err: any) {
        console.error(`❌ Failed to parse AI JSON: ${err.message}`);
        if (fallback !== undefined) return fallback;
        throw err;
    }
}
