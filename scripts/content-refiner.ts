import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import dotenv from 'dotenv';
import { callGemini } from './utils/ai-utils';

dotenv.config();
dotenv.config({ path: '.env.local' });

const CONTENT_DIR = path.join(process.cwd(), 'content');

async function refineContent(content: string, title: string): Promise<{ refinedContent: string; refinedTitle: string }> {
    console.log(`✍️ Refining content and optimizing title for: "${title}"...`);

    const prompt = `
    As a Senior Health Editor and CTR Expert for a premium Korean health blog (오늘도 건강), refine the following Korean health blog post and its title.

    ## Goals:
    1. Title Optimization (CRITICAL):
       - Create a high-CTR, catchy Korean title based on the original title: "${title}".
       - Use power words like "완벽 가이드", "효과 입증된", "꼭 알아야 할", "2026년 최신".
       - NEVER use "전문가 추천", "약사 추천", "의사 추천" — AI가 전문가를 사칭하면 안 됩니다.
       - Focus on health concern and practical solution angles.
    8. 의약품/건강기능식품 안전 규칙 (매우 중요):
       - "전문가 의견", "전문가 추천" 섹션이 있으면 "알아두면 좋은 점" 또는 "참고 사항"으로 변경하세요.
       - 특정 약/영양제를 "추천합니다", "권합니다" 같은 직접 권유 표현이 있으면, "~이 있습니다", "~이 알려져 있습니다", "~을 고려해볼 수 있습니다"로 변경하세요.
       - 의약품 관련 내용에는 "구체적인 복용은 약사 또는 의사와 상담하세요"라는 안내를 포함하세요.
    2. Humanize Body:
       - Remove repetitive or stiff AI-like phrasing.
       - Use natural, warm, yet professional Korean (trustworthy health advisor tone).
       - Ensure it doesn't sound like a direct translation.
    3. 요약: MUST add/update a section at the very top titled "핵심 요약 (3줄 요약)" with 3 punchy bullet points.
    4. Table of Contents: Immediately after 요약, add/update a "📋 목차" section with anchor links to all H2 headers.
    5. Integrity: Keep all MDX components (Callout, ProsCons, etc.) and images exactly as they are.
    6. Pharmacy Banner: Ensure the 약국찾자 CTA link (https://www.yakchatja.com) is preserved.
    7. Disclaimer: Ensure the medical disclaimer at the bottom is preserved.

    ## Original Content:
    ${content}

    ## Output Format (Strict JSON):
    {
      "title": "Optimized Korean Title",
      "body": "Full refined Markdown body starting from '핵심 요약 (3줄 요약)'"
    }
    `;

    try {
        const response = await callGemini(prompt, 'You are a Senior Health Editor and SEO Strategist. Output ONLY valid JSON.');

        // Clean up markdown code block wrapping if present
        let cleanJson = response.trim();
        if (cleanJson.startsWith('```json')) {
            cleanJson = cleanJson.substring(7, cleanJson.lastIndexOf('```')).trim();
        } else if (cleanJson.startsWith('```')) {
            cleanJson = cleanJson.substring(3, cleanJson.lastIndexOf('```')).trim();
        }

        const parsed = JSON.parse(cleanJson);
        return {
            refinedContent: parsed.body,
            refinedTitle: parsed.title
        };
    } catch (err: any) {
        console.error(`❌ Gemini Refinement failed: ${err.message}`);
        return { refinedContent: content, refinedTitle: title };
    }
}

async function processFile(filePath: string) {
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    const { data, content } = matter(fileContent);

    const { refinedContent, refinedTitle } = await refineContent(content, data.title || filePath);

    let hasChanged = false;
    if (refinedContent && refinedContent !== content) {
        hasChanged = true;
    }
    if (refinedTitle && refinedTitle !== data.title) {
        data.title = refinedTitle;
        hasChanged = true;
    }

    if (hasChanged) {
        const updatedFile = matter.stringify(refinedContent || content, data);
        fs.writeFileSync(filePath, updatedFile);
        console.log(`✨ Refined and updated: ${filePath}`);
    } else {
        console.log(`ℹ️ No changes needed for: ${filePath}`);
    }
}

async function main() {
    console.log("✨ Health Content Refiner Bot starting...");

    const walk = async (dir: string) => {
        if (!fs.existsSync(dir)) return;
        const files = fs.readdirSync(dir);
        for (const file of files) {
            const fullPath = path.join(dir, file);
            if (fs.statSync(fullPath).isDirectory()) {
                await walk(fullPath);
            } else if (file.endsWith('.mdx')) {
                await processFile(fullPath);
            }
        }
    };

    await walk(CONTENT_DIR);
    console.log("🏁 Health Content Refiner Bot finished.");
}

main().catch(console.error);
