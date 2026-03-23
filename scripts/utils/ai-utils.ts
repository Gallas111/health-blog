import * as dotenv from 'dotenv';
import path from 'path';

// Load environment variables immediately
dotenv.config();
dotenv.config({ path: path.join(process.cwd(), '.env.local') });

const CF_ACCOUNT_ID = process.env.CF_ACCOUNT_ID || '';
const CF_API_TOKEN = process.env.CF_API_TOKEN || '';
const CF_MODEL = '@cf/meta/llama-3.3-70b-instruct-fp8-fast';

if (!CF_ACCOUNT_ID || !CF_API_TOKEN) {
    console.warn("⚠️ CF_ACCOUNT_ID or CF_API_TOKEN is missing in ai-utils.ts!");
}

/**
 * Centralized AI caller using Cloudflare Workers AI.
 * Includes exponential backoff retry logic for resilience.
 */
export async function callGemini(
    prompt: string,
    systemInstruction?: string,
    retries: number = 3
): Promise<string> {
    const url = `https://api.cloudflare.com/client/v4/accounts/${CF_ACCOUNT_ID}/ai/run/${CF_MODEL}`;
    const messages: { role: string; content: string }[] = [];
    if (systemInstruction) {
        messages.push({ role: 'system', content: systemInstruction });
    }
    messages.push({ role: 'user', content: prompt });

    for (let attempt = 1; attempt <= retries; attempt++) {
        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${CF_API_TOKEN}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ messages, max_tokens: 8192 }),
            });

            if (response.status === 429 || response.status === 503) {
                if (attempt < retries) {
                    const waitMs = Math.pow(2, attempt) * 1000;
                    console.warn(`⏳ Rate limit hit. Retrying in ${waitMs / 1000}s... (Attempt ${attempt}/${retries})`);
                    await new Promise(r => setTimeout(r, waitMs));
                    continue;
                }
            }

            if (!response.ok) {
                throw new Error(`CF Workers AI error (${response.status}): ${await response.text()}`);
            }

            const data = await response.json() as any;
            return data.result?.response || '';
        } catch (err: any) {
            if (attempt < retries && (err.message?.includes('429') || err.message?.includes('503'))) {
                const waitMs = Math.pow(2, attempt) * 1000;
                console.warn(`⏳ Retrying in ${waitMs / 1000}s... (Attempt ${attempt}/${retries})`);
                await new Promise(r => setTimeout(r, waitMs));
            } else if (attempt === retries) {
                console.error(`❌ AI call failed after ${attempt} attempts: ${err.message}`);
                throw err;
            }
        }
    }
    throw new Error('AI call failed after all retries.');
}

/**
 * Calls AI and parses the JSON response.
 * Automatically strips markdown code fences if present.
 */
export async function callGeminiJSON<T>(
    prompt: string,
    systemInstruction?: string,
    fallback?: T
): Promise<T> {
    try {
        const raw = await callGemini(prompt, systemInstruction);
        // Strip ```json ... ``` fences if present
        const cleaned = raw.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/i, '').trim();
        return JSON.parse(cleaned) as T;
    } catch (err: any) {
        console.error(`❌ Failed to parse AI JSON response: ${err.message}`);
        if (fallback !== undefined) return fallback;
        throw err;
    }
}
