import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import dotenv from 'dotenv';
import { generateSmartImage, extractSectionContext } from './utils/image-utils';
import { callGemini, callGeminiJSON } from './utils/ai-utils';

dotenv.config();
dotenv.config({ path: '.env.local' });

// --- Configuration ---
const CONTENT_DIR = path.join(process.cwd(), 'content');
const PUBLIC_IMAGE_DIR = path.join(process.cwd(), 'public', 'images', 'posts');
const KEYWORDS_DB_PATH = path.join(process.cwd(), 'scripts', 'keywords.json');
const TARGET_CATEGORIES = [
    "symptoms",
    "home-remedies",
    "supplements",
    "daily-health",
    "pharmacy-guide"
];

const SEARCHAPI_API_KEY = process.env.SEARCHAPI_API_KEY;

const CATEGORY_SEED_QUERIES: Record<string, string[]> = {
    "symptoms": ["두통 원인", "위염 증상", "불면증 해결법", "어지러움 원인", "소화불량 원인"],
    "home-remedies": ["감기에 좋은 음식", "기침 멈추는 법", "변비에 좋은 음식", "목아플때 좋은 음식", "속쓰림 해결"],
    "supplements": ["비타민D 효능", "오메가3 효능", "마그네슘 부족 증상", "유산균 추천", "철분제 복용법"],
    "daily-health": ["수면 질 높이는 법", "면역력 높이는 방법", "장건강 관리", "스트레스 해소법", "눈 건강 관리"],
    "pharmacy-guide": ["약 복용법", "처방전 없이 살 수 있는 약", "소화제 종류", "진통제 비교", "감기약 추천"]
};

// Ensure image directory exists
if (!fs.existsSync(PUBLIC_IMAGE_DIR)) {
    fs.mkdirSync(PUBLIC_IMAGE_DIR, { recursive: true });
}

// --- Interfaces ---
interface BlogPost {
    slug: string;
    title: string;
    category: string;
    date: string;
    pillar: boolean;
    mainKeyword?: string;
}

interface KeywordRecord {
    mainKeyword: string;
    slug: string;
    category: string;
    createdAt: string;
    source?: string;
    estimatedVolume?: string;
    competition?: string;
    intent?: string;
}

interface SeoStrategy {
    koreanTitle: string;
    mainKeyword: string;
    secondaryKeywords: string[];
    searchIntent: string;
    category: string;
    pillarSlug: string | null;
    ladderLevel: string;
    readerSituation: string;
    readerLevel: "Beginner" | "Intermediate" | "Advanced";
    differentiationPoints: string[];
    factCheckItems: string[];
    writingGoal: string;
}

// --- Helper Functions ---

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// 0. Image Generation — delegates to generateSmartImage (Gemini → HF → DALL-E 3 → Pollinations)
async function generateThumbnail(title: string, filename: string, category: string, description: string): Promise<string | null> {
    const filepath = path.join(PUBLIC_IMAGE_DIR, filename);
    const result = await generateSmartImage(title, filepath, category, description);
    return result ? `/images/posts/${filename}` : null;
}

async function generateContextualImage(prompt: string, filename: string, category: string = 'default'): Promise<string | null> {
    const filepath = path.join(PUBLIC_IMAGE_DIR, filename);
    const result = await generateSmartImage(prompt, filepath, category, '');
    return result ? `/images/posts/${filename}` : null;
}

// 0.2 Real-time Research via SearchApi (4 sources)
async function performResearch(category: string): Promise<string> {
    if (!SEARCHAPI_API_KEY) {
        console.warn("⚠️ SEARCHAPI_API_KEY is missing. Skipping real-time research.");
        return "Search results not available.";
    }

    try {
        console.log(`🔍 Performing real-time research for category: ${category}...`);

        const seeds = CATEGORY_SEED_QUERIES[category] || [category];
        const primaryQuery = seeds[Math.floor(Math.random() * seeds.length)];
        const secondaryQuery = seeds.filter(s => s !== primaryQuery)[0] || primaryQuery;

        // Fetch all 4 sources in parallel (Google Search includes PAA for free)
        const safeFetch = (url: string) => fetch(url).then(r => r.json()).then(data => {
            if (data.error) { console.warn(`  ⚠️ SearchAPI: ${data.error}`); return {}; }
            return data;
        }).catch(() => ({}));

        const [googleData, autocompleteData, youtubeData, newsData] = await Promise.all([
            // 1. Google Search (+ PAA)
            safeFetch(`https://www.searchapi.io/api/v1/search?engine=google&q=${encodeURIComponent(primaryQuery)}&gl=kr&hl=ko&api_key=${SEARCHAPI_API_KEY}`),
            // 2. Google Autocomplete
            safeFetch(`https://www.searchapi.io/api/v1/search?engine=google_autocomplete&q=${encodeURIComponent(secondaryQuery)}&gl=kr&hl=ko&api_key=${SEARCHAPI_API_KEY}`),
            // 3. YouTube
            safeFetch(`https://www.searchapi.io/api/v1/search?engine=youtube&q=${encodeURIComponent(primaryQuery + " 건강")}&gl=kr&hl=ko&api_key=${SEARCHAPI_API_KEY}`),
            // 4. Google News
            safeFetch(`https://www.searchapi.io/api/v1/search?engine=google_news&q=${encodeURIComponent("건강 영양제 의약품 " + primaryQuery)}&gl=kr&hl=ko&time_period=last_week&api_key=${SEARCHAPI_API_KEY}`)
        ]);

        const organicResults = (googleData.organic_results || []).slice(0, 5).map((r: any) => `- ${r.title}: ${r.snippet}`).join('\n');
        const relatedSearches = (googleData.related_searches || []).map((s: any) => s.query).join(', ');
        const paaQuestions = (googleData.related_questions || []).slice(0, 8).map((q: any) => `- ${q.question}`).join('\n');
        const suggestions = (autocompleteData.suggestions || []).slice(0, 10).map((s: any) => s.value || s.suggestion || s).join(', ');
        const videoResults = (youtubeData.video_results || []).slice(0, 5).map((v: any) => `- [Video] ${v.title} (${v.views || 'N/A'} views)`).join('\n');
        const newsResults = (newsData.news_results || []).slice(0, 5).map((a: any) => `- ${a.title}`).join('\n');

        const sourceCount = [organicResults, suggestions, videoResults, newsResults, paaQuestions].filter(Boolean).length;
        console.log(`  📊 Collected data from ${sourceCount}/5 research sources (incl. PAA)`);

        return `
## Google Search (query: "${primaryQuery}")
TOP RESULTS:
${organicResults || '데이터 없음'}

RELATED SEARCHES:
${relatedSearches || '없음'}

## People Also Ask (사람들이 자주 묻는 질문)
${paaQuestions || '데이터 없음'}

## Google Autocomplete (query: "${secondaryQuery}")
실제 검색 패턴:
${suggestions || '데이터 없음'}

## YouTube (query: "${primaryQuery} 건강")
인기 영상:
${videoResults || '데이터 없음'}

## Google News (최근 1주일)
최신 뉴스:
${newsResults || '데이터 없음'}
`;
    } catch (err: any) {
        console.error("❌ Research failed:", err.message);
        return "Research failed due to API error.";
    }
}

// 0.3 Extract Image Prompts from Content
async function extractImagePrompts(content: string, count: number): Promise<string[]> {
    const prompt = `
    As a Visual Director, design ${count} distinct, professional image/infographic prompts for a health & wellness blog post.

    ## Content Context:
    ${content.substring(0, 4000)}...

    ## Design Philosophy (Premium Health Blog):
    - 70% Infographic/Diagram: Focus on clear health data visualization, body diagrams, nutrition charts.
    - 30% High-End Illustration: Clean, calming health/medical illustrations.

    ## Visual Style Rules:
    1. STYLE: Clean, trustworthy medical/health aesthetic (Mayo Clinic / WebMD style).
    2. COLORS: Strict Green/Blue/White palette. Calming, professional gradients.
    3. TEXT: CRITICAL: ALL text inside the images MUST be English ONLY. ABSOLUTELY NO Chinese (汉字), NO Korean (한글), NO Japanese, NO Asian scripts.
    4. COMPLEXITY: Detailed, professional visuals that feel "trustworthy" and "medical".

    ## Each prompt MUST explicitly include these keywords:
    "Premium health blog infographic, detailed professional medical diagram, English text ONLY, NO ASIAN CHARACTERS, clean medical aesthetic, high resolution, calming green-blue design, 8k"

    ## Output Format (JSON Only):
    { "prompts": ["Prompt 1", "Prompt 2", ...] }
    `;

    const result = await callGeminiJSON<{ prompts: string[] }>(
        prompt,
        "You are a professional Health Visual Director. Output JSON only.",
        { prompts: Array(count).fill("Modern health infographic clean medical design") }
    );
    return result.prompts || [];
}

// 0.4 Generate FAQs (PAA-powered)
async function generateFAQs(content: string, paaQuestions?: string): Promise<{ q: string; a: string }[]> {
    const paaSection = paaQuestions
        ? `
    ## People Also Ask (실제 Google 검색 질문 — 최우선 반영):
    ${paaQuestions}

    위 PAA 질문 중 콘텐츠와 관련된 것을 최우선으로 FAQ에 포함하세요.
    PAA에 없는 질문도 2-3개 추가하되, PAA 질문이 우선입니다.`
        : '';

    const prompt = `
    Generate 7-8 High-CTR expert FAQs based on the health content.
    - Korean answer (3-6 sentences).
    - High intent queries that real users search for about health topics.
    - JSON format: { "faqs": [{"q": "...", "a": "..."}, ...] }
    ${paaSection}

    Content: ${content.substring(0, 4000)}
    `;

    const result = await callGeminiJSON<{ faqs: { q: string; a: string }[] }>(
        `You are a Health SEO Strategist. Output JSON only.\n\n${prompt}`,
        undefined,
        { faqs: [] }
    );
    return result.faqs || [];
}

// Helper: Convert FAQ array to YAML list format (prevents YAMLException)
function faqsToYaml(faqs: { q: string; a: string }[]): string {
    if (!faqs || faqs.length === 0) return '[]';
    return faqs.map(faq => {
        // Escape double quotes and remove any characters that could break YAML
        const q = faq.q.replace(/"/g, "'");
        const a = faq.a.replace(/"/g, "'");
        return `  - q: "${q}"\n    a: "${a}"`;
    }).join('\n');
}

// 0.5 Generate Meta Description
async function generateMetaDescription(content: string, mainKeyword: string): Promise<string> {
    const prompt = `Write a 150-char Korean meta description for health keyword "${mainKeyword}". Concise, high click-intent. Single line only, no line breaks. Content: ${content.substring(0, 2000)}`;
    return (await callGemini(`Health SEO meta specialist.\n\n${prompt}`))
        .trim()
        .replace(/\n/g, ' ')
        .replace(/"/g, "'")
        .substring(0, 160);
}

// 1. Database & Scan
function loadKeywordDB(): KeywordRecord[] {
    if (!fs.existsSync(KEYWORDS_DB_PATH)) return [];
    return JSON.parse(fs.readFileSync(KEYWORDS_DB_PATH, 'utf-8'));
}

function saveKeywordDB(db: KeywordRecord[]) {
    fs.writeFileSync(KEYWORDS_DB_PATH, JSON.stringify(db, null, 2));
}

function checkKeywordOverlap(newKeyword: string, db: KeywordRecord[]): boolean {
    const normalize = (s: string) => s.replace(/[^a-zA-Z0-9가-힣]/g, "").toLowerCase();
    const normNew = normalize(newKeyword);
    for (const record of db) {
        if (normNew === normalize(record.mainKeyword)) return true;
    }
    return false;
}

function getAllPosts(): BlogPost[] {
    const posts: BlogPost[] = [];
    if (!fs.existsSync(CONTENT_DIR)) return [];
    const categories = fs.readdirSync(CONTENT_DIR);
    for (const category of categories) {
        const catPath = path.join(CONTENT_DIR, category);
        if (!fs.statSync(catPath).isDirectory()) continue;
        const files = fs.readdirSync(catPath).filter(f => f.endsWith('.mdx'));
        for (const file of files) {
            const content = fs.readFileSync(path.join(catPath, file), 'utf-8');
            const { data } = matter(content);
            posts.push({
                slug: file.replace('.mdx', ''),
                title: data.title,
                category: category,
                date: data.date,
                pillar: data.pillar === true,
                mainKeyword: data.keywords?.[0]
            });
        }
    }
    return posts;
}

function identifyPillar(category: string, posts: BlogPost[]): string | null {
    const categoryPosts = posts.filter(p => p.category === category);
    const explicitPillar = categoryPosts.find(p => p.pillar);
    if (explicitPillar) return explicitPillar.slug;
    if (categoryPosts.length === 0) return null;
    categoryPosts.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    return categoryPosts[0].slug;
}

// 4. GPT Strategy & Content
async function generateSniperStrategy(category: string, researchData: string, pillarSlug: string | null, existingKeywords: string[]): Promise<SeoStrategy> {
    const prompt = `
    Act as a "Health Content Strategy Bot" — 건강 블로그 SEO 전략가.
    Context: ${researchData}
    Avoid (these keywords already exist — NEVER use any of these): ${JSON.stringify(existingKeywords.slice(-80))}

    100-Point Scoring Rule: Pick the highest ROI health-related long-tail topic.

    ## CTR Title Optimization:
    Ensure "koreanTitle" is highly engaging to maximize CTR.
    - Use phrases like "완벽 가이드", "효과 입증된", "꼭 알아야 할".
    - NEVER use "전문가 추천", "약사 추천", "의사 추천" in titles — AI가 전문가를 사칭하면 안 됩니다.
    - Include the current year (2026) if relevant.
    - Focus on the reader's health concern and practical solution.

    Output JSON ONLY:
    {
      "koreanTitle": "...",
      "mainKeyword": "...",
      "secondaryKeywords": ["...", ...],
      "searchIntent": "Informational",
      "category": "${category}",
      "pillarSlug": "${pillarSlug || ''}",
      "ladderLevel": "Level 3",
      "readerSituation": "...",
      "readerLevel": "Beginner",
      "differentiationPoints": ["Evidence-based", "Practical tips", "Expert sources"],
      "factCheckItems": ["...", "..."],
      "writingGoal": "..."
    }
    `;

    const seeds = CATEGORY_SEED_QUERIES[category] || [category];
    const fallbackKeyword = seeds[Math.floor(Math.random() * seeds.length)] + ` ${Date.now()}`;

    return await callGeminiJSON<SeoStrategy>(
        `Health Content Strategy Director. JSON output only.\n\n${prompt}`,
        undefined,
        {
            koreanTitle: `${category} 건강 가이드`,
            mainKeyword: fallbackKeyword,
            secondaryKeywords: ["건강", "증상"],
            searchIntent: "Informational",
            category: category,
            pillarSlug: pillarSlug,
            ladderLevel: "Level 1",
            readerSituation: "건강 정보 필요",
            readerLevel: "Beginner",
            differentiationPoints: ["기초가이드"],
            factCheckItems: ["의학 자료 기준"],
            writingGoal: "건강 정보 제공"
        }
    );
}

async function generateContent(strategy: SeoStrategy, pillarPost: BlogPost | undefined, internalLinks: BlogPost[]): Promise<string> {
    const prompt = `
    Write a 3,000+ character Masterclass health blog post (Korean).
    Persona: 15-year Senior Health Editor & Wellness Content Strategist.

    ## Custom MDX Components (STRICT USE):
    1. <Callout type="info" title="참고">...</Callout> : Useful health context.
    2. <Callout type="tip" title="건강 팁">...</Callout> : Practical health tips.
    3. <Callout type="warning" title="주의사항">...</Callout> : Critical health warnings or risks.
    4. <Callout type="success" title="효과 검증">...</Callout> : Scientifically proven results.
    5. <ProsCons pros="장점1, 장점2" cons="단점1, 단점2" /> : Comparison of treatments/supplements (Use comma-separated strings for props).

    ## Content Structure (Health Blog Specific):
    - 증상 설명 → 원인 분석 → 좋은 음식/민간요법 → 생활습관 팁 → 영양제 정보 (if relevant)
    - 하단에 반드시 이 문구 포함: "📍 **증상이 지속되면 가까운 약국을 방문하세요.** [약국찾자에서 가까운 약국 찾기 →](https://www.yakchatja.com)"
    - 맨 마지막에 면책조항 포함: "---\\n\\n> ⚠️ **면책조항**: 이 글은 일반적인 건강 정보 제공 목적이며, 의학적 조언을 대체하지 않습니다. 증상이 지속되거나 심각한 경우 반드시 의료 전문가와 상담하세요."

    ## Constraints
    - 2-3 line paragraphs max (high readability).
    - No typical AI intro/outro. Start with a hook about the health concern.
    - At least 6 H2 sections and multiple H3 subsections.
    - MUST INCLUDE:
        - **핵심 요약 (3줄 요약)**: Right after the hook/intro, 3 punchy bullet points.
        - **📋 목차 (Table of Contents)**: Immediately after the TL;DR, list all H2 headers with anchor links (e.g., [섹션명](#앵커)).
        - 1+ <ProsCons /> component.
        - 3+ <Callout /> components of different types.
        - Detailed Step-by-step Guide (7+ steps) for symptom management or health improvement.
        - Proper Markdown Checkbox list (start each line with "- ✅ ") with 10+ items.
        - In-depth Comparison Table (4+ columns, 5+ rows). Ensure standard GFM table format with header separators (e.g., |---|). Keep a blank line before and after the table.
        - "알아두면 좋은 점" 또는 "참고 사항" section with evidence-based insights. (절대 "전문가 의견", "전문가 추천"이라는 표현 사용 금지)
    - Decision Criteria: Provide specific health metrics and guidelines.

    ## 의약품/건강기능식품 관련 필수 규칙 (매우 중요):
    - 특정 의약품, 건강기능식품, 영양제를 "추천합니다", "권합니다", "드세요"라고 직접 권유하지 마세요.
    - 대신 "~이 있습니다", "~이 알려져 있습니다", "~을 고려해볼 수 있습니다" 등 정보 전달 형태로 작성하세요.
    - "전문가 의견", "전문가 추천", "약사 추천", "의사 추천"이라는 표현을 절대 사용하지 마세요. AI가 전문가를 사칭해서는 안 됩니다.
    - 의약품 관련 내용은 반드시 "구체적인 복용은 약사 또는 의사와 상담하세요"라는 안내를 포함하세요.
    - "~하세요", "~드세요" 같은 지시형 대신 "~하는 것이 좋습니다", "~할 수 있습니다" 같은 정보 제공형으로 작성하세요.

    ## SEO & Internal Linking
    - Naturally weave these links into the text (don't just list them):
    ${internalLinks.map(p => `- [${p.title}](/blog/${p.slug})`).join('\n')}

    ## Context
    - Strategy: ${JSON.stringify(strategy)}

    ## Images (CRITICAL)
    - Place 4-5 images (MAX) naturally throughout the post.
    - Place each image placeholder IMMEDIATELY AFTER a major H2 section header.
    - DO NOT group images together or put them all at the end.
    - UNIQUE Placeholder format: ![Image: precise_visual_description_of_this_section](CHECK_IMAGE_GENERATION)
    `;

    return await callGemini(
        prompt,
        "Master Health Editor. Produces premium, expert-level Korean health content using MDX components. Always includes pharmacy banner and medical disclaimer."
    );
}

// --- Main ---
async function main() {
    console.log("🚀 Starting Health Blog SEO Post Generation...");
    const keywordDB = loadKeywordDB();
    const allPosts = getAllPosts();

    const targetCategory = TARGET_CATEGORIES[Math.floor(Math.random() * TARGET_CATEGORIES.length)];
    const existingKeywords = keywordDB.map(k => k.mainKeyword);
    const pillarSlug = identifyPillar(targetCategory, allPosts);

    const researchData = await performResearch(targetCategory);

    let strategy: SeoStrategy | null = null;
    for (let i = 0; i < 7; i++) {
        const candidate = await generateSniperStrategy(targetCategory, researchData, pillarSlug, existingKeywords);
        console.log(`  🔄 Attempt ${i + 1}: keyword="${candidate.mainKeyword}"`);
        if (!checkKeywordOverlap(candidate.mainKeyword, keywordDB)) {
            strategy = candidate;
            break;
        }
        console.log(`  ⚠️ Keyword overlap detected, retrying...`);
        existingKeywords.push(candidate.mainKeyword); // 중복된 키워드도 피하도록 추가
    }
    if (!strategy) throw new Error("Strategy generation failed. All 7 keyword candidates overlapped with existing DB.");

    console.log(`🎯 Strategy: ${strategy.koreanTitle}`);

    const slugPrompt = `Translate "${strategy.mainKeyword}" to English kebab-case slug. ONLY output the slug, nothing else.`;
    const slug = (await callGemini(slugPrompt)).trim().toLowerCase().replace(/[^a-z0-9-]/g, '') || "temp-slug";

    const internalLinks = [allPosts.find(p => p.slug === pillarSlug), ...allPosts.filter(p => p.category === targetCategory).slice(0, 5)].filter((p): p is BlogPost => !!p);

    const thumbnailPath = await generateThumbnail(strategy.koreanTitle, `${slug}-thumb.png`, targetCategory, strategy.writingGoal || '');

    console.log("✍️  Writing Content...");
    let markdownBody = await generateContent(strategy, undefined, internalLinks);

    const imageRegex = /!\[Image: (.*?)\]\(CHECK_IMAGE_GENERATION\)/g;
    const matches = Array.from(markdownBody.matchAll(imageRegex));
    if (matches.length > 0) {
        const prompts = await extractImagePrompts(markdownBody, matches.length);
        for (let i = 0; i < matches.length; i++) {
            await delay(5000);

            // Extract section context for each image position
            const matchIndex = matches[i].index ?? 0;
            const sectionCtx = extractSectionContext(markdownBody, matchIndex, matches[i][0]);
            console.log(`   📌 New post body ${i + 1} — Section: "${sectionCtx.sectionHeading}" [${sectionCtx.sectionType}]`);

            const filepath = path.join(PUBLIC_IMAGE_DIR, `${slug}-body-${i + 1}.png`);
            const result = await generateSmartImage(
                prompts[i] || matches[i][1],
                filepath,
                targetCategory,
                '',
                false,
                'body',
                i,
                sectionCtx
            );
            if (result) {
                const imgPath = `/images/posts/${slug}-body-${i + 1}.png`;
                markdownBody = markdownBody.replace(matches[i][0], `![${matches[i][1]}](${imgPath})`);
            } else {
                console.warn(`⚠️ Warning: Failed to generate or save image for prompt: ${prompts[i] || matches[i][1]}. Using text fallback.`);
                markdownBody = markdownBody.replace(matches[i][0], `> [이미지: ${matches[i][1]}]`);
            }
        }
    }

    if (markdownBody.includes("CHECK_IMAGE_GENERATION")) {
        console.error("❌ Placeholder leakage detected in markdownBody!");
        throw new Error("Formatting error: CHECK_IMAGE_GENERATION placeholder still exists.");
    }

    // Extract PAA section from research data for FAQ generation
    const paaMatch = researchData.match(/## People Also Ask[^\n]*\n([\s\S]*?)(?=\n##|$)/);
    const paaForFaq = paaMatch?.[1]?.trim();
    if (paaForFaq && paaForFaq !== '데이터 없음') {
        console.log(`📋 Using PAA data for FAQ generation (${paaForFaq.split('\n').length} questions)`);
    }
    const faqs = await generateFAQs(markdownBody, paaForFaq && paaForFaq !== '데이터 없음' ? paaForFaq : undefined);
    const metaDesc = await generateMetaDescription(markdownBody, strategy.mainKeyword);

    const faqYaml = faqsToYaml(faqs);
    const safeTitle = strategy.koreanTitle.replace(/"/g, "'").replace(/\n/g, ' ').trim();
    const safeKeyword = strategy.mainKeyword.replace(/"/g, "'").replace(/\n/g, ' ').trim();

    const frontmatter = `---
title: "${safeTitle}"
date: "${new Date().toISOString().split('T')[0]}"
description: "${metaDesc}"
category: "${targetCategory}"
keywords: [${[safeKeyword, ...strategy.secondaryKeywords].map(k => `"${k.replace(/"/g, "'")}"`).join(", ")}]
author: "오늘도 건강"
slug: "${slug}"
pillar: false
image: "${thumbnailPath || ''}"
faq:
${faqYaml}
---

${markdownBody}
`;

    const filePath = path.join(CONTENT_DIR, targetCategory, `${slug}.mdx`);
    if (!fs.existsSync(path.dirname(filePath))) fs.mkdirSync(path.dirname(filePath), { recursive: true });
    fs.writeFileSync(filePath, frontmatter);

    keywordDB.push({ mainKeyword: strategy.mainKeyword, slug, category: targetCategory, createdAt: new Date().toISOString() });
    saveKeywordDB(keywordDB);
    console.log(`✅ Saved: ${filePath}`);

    if (process.env.GITHUB_OUTPUT) {
        const postUrl = `https://www.wellnesstodays.com/blog/${slug}`;
        fs.appendFileSync(process.env.GITHUB_OUTPUT, `POST_URL=${postUrl}\n`);
    }
}

main().catch(err => { console.error(err); process.exit(1); });
