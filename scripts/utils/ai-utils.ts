import * as dotenv from 'dotenv';
import path from 'path';

// Load environment variables immediately
dotenv.config();
dotenv.config({ path: path.join(process.cwd(), '.env.local') });

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || '';
const CF_ACCOUNT_ID = process.env.CF_ACCOUNT_ID || '';
const CF_API_TOKEN = process.env.CF_API_TOKEN || '';
const CF_MODEL = '@cf/meta/llama-3.3-70b-instruct-fp8-fast';

/**
 * Gemini API 호출 (무료 티어)
 */
async function callGeminiDirect(prompt: string, systemInstruction?: string): Promise<string> {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`;
    const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            ...(systemInstruction && {
                systemInstruction: { parts: [{ text: systemInstruction }] },
            }),
        }),
    });

    if (response.status === 429) {
        throw new Error('GEMINI_RATE_LIMIT');
    }
    if (!response.ok) {
        throw new Error(`Gemini error (${response.status}): ${await response.text()}`);
    }

    const data = await response.json() as any;
    return data.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || '';
}

/**
 * Cloudflare Workers AI 호출 (폴백)
 */
async function callCFWorkersAI(prompt: string, systemInstruction?: string): Promise<string> {
    const url = `https://api.cloudflare.com/client/v4/accounts/${CF_ACCOUNT_ID}/ai/run/${CF_MODEL}`;
    const messages: { role: string; content: string }[] = [];
    if (systemInstruction) messages.push({ role: 'system', content: systemInstruction });
    messages.push({ role: 'user', content: prompt });

    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${CF_API_TOKEN}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ messages, max_tokens: 8192 }),
    });

    if (!response.ok) {
        throw new Error(`CF Workers AI error (${response.status}): ${await response.text()}`);
    }

    const data = await response.json() as any;
    return data.result?.response || '';
}

/**
 * Gemini 우선 → 한도 초과 시 CF Workers AI 자동 전환
 */
export async function callGemini(
    prompt: string,
    systemInstruction?: string,
    retries: number = 3
): Promise<string> {
    // 1차: Gemini 무료 티어 시도
    if (GEMINI_API_KEY) {
        for (let attempt = 1; attempt <= retries; attempt++) {
            try {
                return await callGeminiDirect(prompt, systemInstruction);
            } catch (err: any) {
                if (err.message === 'GEMINI_RATE_LIMIT') {
                    console.warn('⚡ Gemini 무료 한도 초과 → CF Workers AI로 전환');
                    break; // CF 폴백으로
                }
                if (attempt < retries) {
                    const waitMs = Math.pow(2, attempt) * 1000;
                    console.warn(`⏳ Gemini 재시도 ${attempt}/${retries}...`);
                    await new Promise(r => setTimeout(r, waitMs));
                } else {
                    console.warn(`⚠️ Gemini 실패 → CF Workers AI로 전환: ${err.message}`);
                    break; // CF 폴백으로
                }
            }
        }
    }

    // 2차: CF Workers AI 폴백
    if (CF_ACCOUNT_ID && CF_API_TOKEN) {
        for (let attempt = 1; attempt <= retries; attempt++) {
            try {
                return await callCFWorkersAI(prompt, systemInstruction);
            } catch (err: any) {
                if (attempt < retries && (err.message?.includes('429') || err.message?.includes('503'))) {
                    const waitMs = Math.pow(2, attempt) * 1000;
                    await new Promise(r => setTimeout(r, waitMs));
                } else if (attempt === retries) {
                    throw err;
                }
            }
        }
    }

    throw new Error('Gemini과 CF Workers AI 모두 사용 불가. API 키를 확인하세요.');
}

/**
 * AI 호출 후 JSON 파싱. 마크다운 코드 펜스 자동 제거.
 */
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
        console.error(`❌ Failed to parse AI JSON response: ${err.message}`);
        if (fallback !== undefined) return fallback;
        throw err;
    }
}
