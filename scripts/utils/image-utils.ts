import OpenAI from 'openai';
import dotenv from 'dotenv';
import fs from 'fs';
import { callGemini } from './ai-utils';

dotenv.config();
dotenv.config({ path: '.env.local' });

// ─── Visual element pools for unique prompt generation ──────────────────────
const VISUAL_SUBJECTS: Record<string, string[]> = {
    'symptoms': [
        'clean medical infographic showing human body with highlighted symptom areas',
        'professional diagnostic flowchart with symptom checkpoints and green-blue gradients',
        'calming medical illustration of body systems with gentle health indicators',
        'anatomical diagram with soft color-coded symptom regions and healing elements',
        'wellness dashboard showing health metrics with soothing green and blue tones',
    ],
    'home-remedies': [
        'beautiful arrangement of herbal teas and natural remedies on wooden surface',
        'colorful fresh fruits and vegetables arranged in a healing rainbow pattern',
        'warm kitchen scene with natural healing ingredients and gentle steam',
        'botanical illustration of medicinal herbs and healing plants',
        'cozy wellness scene with honey, ginger, lemon and herbal elements',
    ],
    'supplements': [
        'clean professional layout of vitamins and supplement capsules with molecular structures',
        'scientific infographic showing nutrient absorption pathways in the body',
        'modern pharmacy shelf with organized supplement bottles and health charts',
        'molecular structure visualization of vitamins with soft blue-green glow',
        'comparison layout of different supplement types with efficacy indicators',
    ],
    'daily-health': [
        'serene morning wellness routine scene with yoga mat and healthy breakfast',
        'balanced lifestyle infographic showing sleep, exercise, nutrition, and mindfulness',
        'peaceful exercise scene in nature with soft morning light',
        'healthy meal preparation scene with colorful ingredients and portion guides',
        'calming sleep environment with soft lighting and wellness elements',
    ],
    'pharmacy-guide': [
        'organized pharmacy counter with labeled medicine categories and professional setting',
        'clean medical infographic showing proper medication dosage and timing',
        'professional pharmacist workspace with organized medicine shelves',
        'medication guide layout with pill types, dosage charts, and safety indicators',
        'first aid kit contents neatly organized with medical cross symbol',
    ],
    'default': [
        'calming health and wellness illustration with green-blue color scheme',
        'professional medical infographic with body systems and health indicators',
        'serene nature scene with wellness and healing elements',
        'clean health dashboard visualization with soothing medical aesthetics',
        'botanical wellness illustration with natural healing themes',
    ],
};

// ─── Section Context System ──────────────────────────────────────────────────
export type SectionType =
    | 'tutorial-steps'
    | 'comparison'
    | 'error-diagnosis'
    | 'setup-guide'
    | 'conceptual'
    | 'workflow'
    | 'data-visualization'
    | 'case-study'
    | 'general';

export interface SectionContext {
    sectionHeading: string;
    surroundingText: string;
    sectionType: SectionType;
    sectionKeyTopics: string[];
}

const SECTION_STYLE_MAP: Record<SectionType, { visualStyle: string; composition: string; emphasis: string }> = {
    'tutorial-steps': {
        visualStyle: 'step-by-step process flow diagram with numbered stages',
        composition: 'horizontal or vertical pipeline showing clear progression from start to finish',
        emphasis: 'sequential numbered steps connected by glowing arrows, each step as a distinct card',
    },
    'comparison': {
        visualStyle: 'side-by-side symmetric comparison layout',
        composition: 'split-screen with two distinct platforms/tools on each side, connected by VS divider',
        emphasis: 'contrasting features highlighted with color-coded indicators, balanced visual weight',
    },
    'error-diagnosis': {
        visualStyle: 'before/after diagnostic visualization',
        composition: 'left side showing broken/red error state, right side showing fixed/green success state',
        emphasis: 'red-to-green transformation, debugging scan lines, error codes being repaired',
    },
    'setup-guide': {
        visualStyle: 'configuration dashboard with settings panels',
        composition: 'clean settings UI with toggles, input fields, and configuration options arranged neatly',
        emphasis: 'highlighted active settings, gear icons, installation progress indicators',
    },
    'conceptual': {
        visualStyle: 'concept map with interconnected knowledge nodes',
        composition: 'central core concept radiating outward to related sub-concepts via branching paths',
        emphasis: 'hierarchical structure, labeled connection lines, mind-map aesthetic',
    },
    'workflow': {
        visualStyle: 'automated pipeline with connected processing nodes',
        composition: 'left-to-right data flow through transformation stages with input/output endpoints',
        emphasis: 'data packets flowing through nodes, automation gears, integration connectors',
    },
    'data-visualization': {
        visualStyle: 'analytics dashboard with charts and metrics',
        composition: 'multi-panel dashboard layout with bar charts, line graphs, KPI cards, and data tables',
        emphasis: 'rising trend lines, highlighted peak values, color-coded data categories',
    },
    'case-study': {
        visualStyle: 'results showcase with achievement metrics',
        composition: 'before/after comparison with prominent success metrics and growth indicators',
        emphasis: 'upward arrows, percentage improvements, trophy/milestone markers',
    },
    'general': {
        visualStyle: 'modern tech illustration with abstract elements',
        composition: 'centered focal point with supportive contextual elements around it',
        emphasis: 'clean professional aesthetic, subtle tech patterns, relevant iconography',
    },
};

const COLOR_PALETTES = [
    'soft sage green and clean white',
    'calming sky blue and light mint',
    'warm teal and gentle cream',
    'fresh green and soft lavender',
    'ocean blue and pearl white',
    'gentle emerald and warm beige',
    'soft aqua and clean ivory',
    'healing green and tranquil blue',
];

// ─── Section Context Extraction ─────────────────────────────────────────────

const SECTION_TYPE_PATTERNS: Record<SectionType, RegExp[]> = {
    'tutorial-steps': [
        /단계|step|스텝|따라하|방법|how[\s-]?to|절차|과정|순서/i,
        /\d+\.\s|first|second|third|첫째|둘째|셋째/i,
    ],
    'comparison': [
        /비교|vs\.?|versus|차이|compared|대결|장단점|선택|어떤.*좋|어떤.*나을/i,
        /pros.*cons|advantage|disadvantage/i,
    ],
    'error-diagnosis': [
        /에러|오류|error|bug|fix|해결|문제|트러블|troubleshoot|디버그|debug|실패|안[되됨]|작동.*않/i,
    ],
    'setup-guide': [
        /설정|설치|연동|config|setup|install|integration|세팅|초기|시작하기|가입|등록/i,
    ],
    'workflow': [
        /자동화|automat|워크플로|workflow|파이프라인|pipeline|연결|trigger|zapier|make\b|integromat/i,
    ],
    'data-visualization': [
        /데이터|data|통계|분석|analytics|차트|chart|그래프|graph|대시보드|dashboard|지표|metric/i,
    ],
    'case-study': [
        /사례|case[\s-]?study|후기|리뷰|review|결과|result|성과|경험|실전|실제/i,
    ],
    'conceptual': [
        /개념|concept|원리|principle|이해|understand|기초|basic|fundamentals|구조|architecture/i,
    ],
    'general': [],
};

const STOP_WORDS = new Set([
    // Korean
    '있는', '하는', '되는', '위한', '대한', '통한', '있다', '하다', '되다', '이다',
    '그리고', '또는', '하지만', '그래서', '때문에', '하면', '에서', '으로', '부터',
    '까지', '보다', '처럼', '같은', '모든', '어떤', '이런', '그런', '저런', '많은',
    '좋은', '나쁜', '큰', '작은', '새로운', '가장', '매우', '정말', '아주', '더',
    '수', '것', '등', '및', '중', '후', '전', '내', '외',
    // English
    'the', 'a', 'an', 'is', 'are', 'was', 'were', 'be', 'been', 'being',
    'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could',
    'should', 'may', 'might', 'can', 'shall', 'must', 'need', 'and', 'or',
    'but', 'if', 'then', 'else', 'when', 'while', 'for', 'with', 'from',
    'to', 'in', 'on', 'at', 'by', 'of', 'about', 'into', 'through',
    'this', 'that', 'these', 'those', 'it', 'its', 'you', 'your', 'we',
    'our', 'they', 'their', 'not', 'no', 'so', 'as', 'up', 'out',
    'how', 'what', 'which', 'who', 'why', 'where', 'more', 'most', 'very',
]);

function classifySectionType(heading: string, text: string): SectionType {
    const combined = `${heading} ${text}`.toLowerCase();
    let bestType: SectionType = 'general';
    let bestScore = 0;

    for (const [type, patterns] of Object.entries(SECTION_TYPE_PATTERNS) as [SectionType, RegExp[]][]) {
        if (type === 'general') continue;
        let score = 0;
        for (const pattern of patterns) {
            const matches = combined.match(new RegExp(pattern.source, 'gi'));
            if (matches) score += matches.length;
        }
        if (score > bestScore) {
            bestScore = score;
            bestType = type;
        }
    }

    return bestType;
}

function extractKeyTopics(text: string): string[] {
    const freq = new Map<string, number>();

    // Korean nouns (2-6 char sequences of Hangul)
    const koreanMatches = text.match(/[가-힣]{2,6}/g) || [];
    for (const word of koreanMatches) {
        if (!STOP_WORDS.has(word)) {
            freq.set(word, (freq.get(word) || 0) + 1);
        }
    }

    // English proper nouns and tech terms (capitalized or known patterns)
    const englishMatches = text.match(/[A-Z][a-zA-Z0-9.+-]{2,20}|[a-z]{2,}[A-Z][a-zA-Z]*/g) || [];
    for (const word of englishMatches) {
        const lower = word.toLowerCase();
        if (!STOP_WORDS.has(lower)) {
            freq.set(word, (freq.get(word) || 0) + 2); // boost proper nouns
        }
    }

    return Array.from(freq.entries())
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([word]) => word);
}

export function extractSectionContext(
    fullContent: string,
    matchIndex: number,
    matchText: string
): SectionContext {
    // Find nearest H2/H3 heading above the match position
    const contentBefore = fullContent.slice(0, matchIndex);
    const headingMatches = Array.from(contentBefore.matchAll(/^#{2,3}\s+(.+)$/gm));
    const sectionHeading = headingMatches.length > 0
        ? headingMatches[headingMatches.length - 1][1].trim()
        : '';

    // Extract surrounding text (300 chars before + 300 chars after), strip markdown
    const start = Math.max(0, matchIndex - 300);
    const end = Math.min(fullContent.length, matchIndex + matchText.length + 300);
    const rawSurrounding = fullContent.slice(start, end);
    const surroundingText = rawSurrounding
        .replace(/^#{1,6}\s+/gm, '')       // headings
        .replace(/!\[.*?\]\(.*?\)/g, '')    // images
        .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1') // links → text only
        .replace(/[*_~`>#\-|]/g, '')        // markdown syntax
        .replace(/\s+/g, ' ')
        .trim()
        .slice(0, 250);

    const sectionType = classifySectionType(sectionHeading, surroundingText);
    const sectionKeyTopics = extractKeyTopics(`${sectionHeading} ${surroundingText}`);

    return { sectionHeading, surroundingText, sectionType, sectionKeyTopics };
}

// ─── Track used prompts to prevent duplicates within a session ──────────────
const usedPromptKeys = new Set<string>();

// ─── Gemini: generate a unique, topic-specific image prompt ─────────────────
async function generateTopicSpecificPrompt(
    title: string,
    category: string = 'default',
    description: string = '',
    imageType: 'thumbnail' | 'body' = 'thumbnail',
    bodyIndex: number = 0,
    sectionContext?: SectionContext
): Promise<string> {
    try {
        // Build section context block for the prompt
        let sectionBlock = '';
        if (sectionContext) {
            const style = SECTION_STYLE_MAP[sectionContext.sectionType];
            sectionBlock = `
== SECTION CONTEXT (USE THIS to make the image match the specific section) ==
Section Heading: "${sectionContext.sectionHeading}"
Section Type: ${sectionContext.sectionType}
Surrounding Content (excerpt): "${sectionContext.surroundingText.slice(0, 250)}"
Key Topics: ${sectionContext.sectionKeyTopics.join(', ')}

Visual Direction for this section type:
- Style: ${style.visualStyle}
- Composition: ${style.composition}
- Emphasis: ${style.emphasis}

IMPORTANT: Generate an image that illustrates what THIS SECTION teaches, like a textbook illustration.
The image should help the reader understand the section content at a glance.
===========================================================================
`;
        }

        const prompt = `You are an expert image prompt engineer for a Korean health & wellness blog (wellnesstodays.com).
Generate ONE highly specific English image prompt for this health blog post.

Blog Title: "${title}"
Category: ${category}
Description: "${description}"
Image Type: ${imageType}${imageType === 'body' ? ` (section ${bodyIndex + 1} — must be visually DIFFERENT from the thumbnail)` : ''}
${sectionBlock}
CRITICAL RULE: The image must clearly and IMMEDIATELY convey THIS SPECIFIC POST's health topic.
DO NOT generate generic "medical symbols", "stethoscopes", or "abstract healing lights" — those look identical for every post and are useless.

Step 1 — Identify: What health topic is this post actually teaching or showing?${sectionContext ? ' (Use the Section Context above)' : ''}
Step 2 — Visualize: What single image would make a viewer instantly understand the health topic?
Step 3 — Describe: Write a calming, professional prompt for that specific visual.

Topic-to-visual mapping (use the same logic for the given title):
- "두통 원인과 해결법" → anatomical head cross-section showing pain points with soothing blue relief indicators
- "감기에 좋은 음식" → warm, inviting arrangement of ginger tea, honey, citrus fruits, and steam on a cozy table
- "비타민D 효능" → golden sunlight rays illuminating vitamin capsules with molecular structure overlay
- "수면 질 높이는 법" → peaceful bedroom scene with sleep cycle infographic and calming blue-purple tones
- "위염 증상" → clean medical illustration of stomach lining with gentle diagnostic indicators
- "오메가3 비교" → professional comparison layout of fish oil capsules with efficacy data charts
- "면역력 높이는 방법" → shield-like immune cell visualization defending against pathogens with green energy
- "약 복용법" → organized pill organizer with timing chart and proper dosage guide layout
- "장건강 관리" → beautiful gut microbiome illustration with friendly beneficial bacteria
- "스트레스 해소법" → serene nature meditation scene with brain relaxation wave visualization

Style requirements: calming professional lighting, clean medical aesthetic, green-blue-white palette, trustworthy feel, 8K
Output: ONE paragraph, max 120 words, English only
Final line must be: "ABSOLUTELY NO text, letters, numbers, words, or characters of any language in the image."

Output ONLY the prompt, nothing else.`;

        const result = await callGemini(prompt, 'Health blog image prompt generator');
        const cleaned = result.trim().replace(/^["']|["']$/g, '');
        if (cleaned.length > 20) return cleaned;
    } catch (err: any) {
        console.error(`   ⚠️ Gemini prompt gen failed: ${err.message}`);
    }

    // Fallback: build a unique prompt locally
    return buildLocalPrompt(title, category, imageType, bodyIndex, sectionContext);
}

// ─── Local prompt builder (fallback, but now topic-aware) ───────────────────
function buildLocalPrompt(
    title: string,
    category: string,
    imageType: 'thumbnail' | 'body' = 'thumbnail',
    bodyIndex: number = 0,
    sectionContext?: SectionContext
): string {
    const titleHash = Array.from(title).reduce((acc, c) => acc + c.charCodeAt(0), 0);
    const colorIdx = (titleHash + bodyIndex * 3) % COLOR_PALETTES.length;
    const colors = COLOR_PALETTES[colorIdx];

    // If section context available, use SECTION_STYLE_MAP instead of generic VISUAL_SUBJECTS
    if (sectionContext) {
        const style = SECTION_STYLE_MAP[sectionContext.sectionType];
        const topicStr = sectionContext.sectionKeyTopics.slice(0, 3).join(', ');
        return (
            `Professional digital illustration: ${style.visualStyle}. ` +
            `Layout: ${style.composition}. ` +
            `Focus: ${style.emphasis}. ` +
            `Topic: ${sectionContext.sectionHeading || title}. ` +
            `Key concepts: ${topicStr}. ` +
            `${imageType === 'body' ? `Section variation ${bodyIndex + 1}. ` : ''}` +
            `Ultra-detailed, 8K, cinematic lighting, ` +
            `${colors} color palette, professional quality. ` +
            `ABSOLUTELY NO text, NO letters, NO words, NO numbers, NO UI, NO labels, ` +
            `NO Chinese, NO Korean, NO Japanese, NO Asian scripts, NO characters of any language.`
        );
    }

    // Original fallback for thumbnails / no context
    const subjects = VISUAL_SUBJECTS[category] || VISUAL_SUBJECTS['default'];
    const subjectIdx = (titleHash + bodyIndex) % subjects.length;
    const subject = subjects[subjectIdx];
    const topicHints = extractTopicHints(title);

    return (
        `Cinematic abstract digital art: ${subject}. ` +
        `Theme: ${topicHints}. ` +
        `${imageType === 'body' ? `Variation ${bodyIndex + 1}: focus on a different aspect. ` : ''}` +
        `Ultra-detailed, 8K, photorealistic volumetric lighting, ` +
        `${colors} color palette, smooth particles, ethereal glow. ` +
        `ABSOLUTELY NO text, NO letters, NO words, NO numbers, NO UI, NO labels, ` +
        `NO Chinese, NO Korean, NO Japanese, NO Asian scripts, NO characters of any language.`
    );
}

// ─── Extract topic hints from Korean title ──────────────────────────────────
function extractTopicHints(title: string): string {
    const hints: string[] = [];
    const lowerTitle = title.toLowerCase();

    const keywordMap: Record<string, string> = {
        '두통': 'headache pain relief medical illustration',
        '편두통': 'migraine headache brain pressure visualization',
        '위염': 'stomach gastritis digestive system illustration',
        '감기': 'cold flu immune system defense illustration',
        '불면증': 'insomnia sleep quality bedroom wellness',
        '수면': 'sleep cycle REM deep sleep visualization',
        '운동': 'exercise fitness workout healthy lifestyle',
        '식단': 'balanced diet nutrition meal planning',
        '영양': 'nutrition vitamins minerals healthy food',
        '비타민': 'vitamin supplements capsules health science',
        '오메가': 'omega-3 fish oil supplements heart health',
        '마그네슘': 'magnesium mineral supplement muscle relaxation',
        '유산균': 'probiotics gut health microbiome illustration',
        '면역': 'immune system defense cells medical',
        '장건강': 'gut health digestive system probiotics',
        '스트레스': 'stress relief mental health relaxation',
        '피로': 'fatigue recovery energy restoration wellness',
        '약국': 'pharmacy medicine professional healthcare',
        '약': 'medication pills prescription healthcare',
        '복용': 'medication dosage proper intake guide',
        '부작용': 'side effects medication warning medical',
        '소화': 'digestion stomach health enzyme illustration',
        '변비': 'constipation digestive relief fiber health',
        '다이어트': 'healthy diet weight management nutrition',
        '혈압': 'blood pressure heart cardiovascular health',
        '당뇨': 'diabetes blood sugar glucose management',
        '콜레스테롤': 'cholesterol heart health lipid management',
        '관절': 'joint health arthritis bone wellness',
        '피부': 'skin health dermatology skincare wellness',
        '눈': 'eye health vision care ophthalmology',
        '치아': 'dental health teeth oral care hygiene',
        '탈모': 'hair loss treatment scalp health care',
        '생강': 'ginger root natural remedy herbal tea',
        '꿀': 'honey natural remedy healing food',
        '녹차': 'green tea antioxidant wellness beverage',
    };

    for (const [keyword, hint] of Object.entries(keywordMap)) {
        if (lowerTitle.includes(keyword)) {
            hints.push(hint);
        }
    }

    return hints.length > 0
        ? hints.slice(0, 3).join(', ')
        : 'health wellness medical nutrition lifestyle';
}

// ─── Unsplash search keywords via Gemini ────────────────────────────────────
async function generateSearchKeywords(
    title: string,
    category: string = 'default'
): Promise<string> {
    const fallback = extractTopicHints(title).split(',')[0]?.trim() || 'health wellness nutrition medical';
    try {
        const prompt = `Given this Korean health blog post title: "${title}"
Category: ${category}

Generate 4 English search keywords for finding a relevant professional stock photo.
Rules:
- English only, health/wellness/medical related
- Be SPECIFIC to the blog topic (not generic nature photos)
- Keywords should find photos of: healthy food, medical settings, wellness scenes, supplements, exercise, etc.
- Output format: word1 word2 word3 word4 (space-separated, nothing else)`;

        const result = await callGemini(prompt, 'Health stock photo search keyword generator.');
        const cleaned = result.trim().replace(/[^\x20-\x7E]/g, '').replace(/\s+/g, ' ').trim();
        return cleaned.length > 3 ? cleaned : fallback;
    } catch {
        return fallback;
    }
}

// ═══════════════════════════════════════════════════════════════════════════════
// IMAGE GENERATION SOURCES
// ═══════════════════════════════════════════════════════════════════════════════

// ─── ★ NEW: Gemini Native Image Generation (FREE, uses existing API key) ────
/**
 * Uses Google Gemini's native image generation capability.
 * Requires: @google/genai package (NOT @google/generative-ai)
 * Install: npm install @google/genai
 *
 * This uses the Gemini 2.0 Flash model with responseModalities: ['Image']
 * FREE tier: ~10 images/minute, no billing required
 * Quality: Excellent for blog thumbnails, understands context well
 */
async function generateGeminiImage(prompt: string): Promise<Buffer | null> {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
        console.log(`   ⏭️ Gemini Image: No GEMINI_API_KEY found`);
        return null;
    }

    try {
        // Use the REST API directly for maximum compatibility
        // (no need to install @google/genai package)
        const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp-image-generation:generateContent?key=${apiKey}`;

        const requestBody = {
            contents: [{
                parts: [{
                    text: prompt
                }]
            }],
            generationConfig: {
                responseModalities: ['IMAGE', 'TEXT'],
                temperature: 1.0,
            },
        };

        console.log(`   🔄 Gemini Image: Generating...`);
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(requestBody),
            signal: AbortSignal.timeout(90000),
        });

        if (!response.ok) {
            const errText = await response.text();
            // Try alternative model name if first fails
            if (response.status === 404 || errText.includes('not found')) {
                console.log(`   🔄 Trying alternative Gemini model...`);
                return await generateGeminiImageAlt(prompt, apiKey);
            }
            throw new Error(`Gemini ${response.status}: ${errText.slice(0, 150)}`);
        }

        const data = await response.json();

        // Extract image from response
        const parts = data?.candidates?.[0]?.content?.parts;
        if (!parts) throw new Error('No parts in Gemini response');

        for (const part of parts) {
            if (part.inlineData?.mimeType?.startsWith('image/')) {
                const buf = Buffer.from(part.inlineData.data, 'base64');
                if (buf.length > 15000) return buf;
            }
        }

        throw new Error('No image found in Gemini response parts');
    } catch (err: any) {
        console.error(`   ❌ Gemini Image: ${err.message}`);
        return null;
    }
}

// Alternative Gemini model names to try
async function generateGeminiImageAlt(prompt: string, apiKey: string): Promise<Buffer | null> {
    const altModels = [
        'gemini-2.5-flash-image',
        'gemini-3.1-flash-image-preview',
    ];

    for (const model of altModels) {
        try {
            const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

            const requestBody = {
                contents: [{
                    parts: [{
                        text: `Generate an image: ${prompt}`
                    }]
                }],
                generationConfig: {
                    responseModalities: ['IMAGE', 'TEXT'],
                    temperature: 1.0,
                },
            };

            console.log(`   🔄 Trying model: ${model}...`);
            const response = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(requestBody),
                signal: AbortSignal.timeout(90000),
            });

            if (!response.ok) continue;

            const data = await response.json();
            const parts = data?.candidates?.[0]?.content?.parts;
            if (!parts) continue;

            for (const part of parts) {
                if (part.inlineData?.mimeType?.startsWith('image/')) {
                    const buf = Buffer.from(part.inlineData.data, 'base64');
                    if (buf.length > 15000) {
                        console.log(`   ✅ Model ${model} worked!`);
                        return buf;
                    }
                }
            }
        } catch {
            continue;
        }
    }
    return null;
}

// ─── Hugging Face FLUX (AI-generated, best quality) ─────────────────────────
export async function generateHFImageBuffer(prompt: string, retries: number = 3): Promise<Buffer | null> {
    let hfKey = process.env.HUGGINGFACE_API_KEY;
    if (!hfKey) {
        dotenv.config({ path: '.env.local' });
        hfKey = process.env.HUGGINGFACE_API_KEY;
    }
    if (!hfKey) return null;

    for (let attempt = 1; attempt <= retries; attempt++) {
        try {
            console.log(`   🔄 HF FLUX attempt ${attempt}/${retries}...`);
            const response = await fetch(
                'https://router.huggingface.co/hf-inference/models/black-forest-labs/FLUX.1-schnell',
                {
                    method: 'POST',
                    headers: {
                        Authorization: `Bearer ${hfKey}`,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ inputs: prompt }),
                    signal: AbortSignal.timeout(90000),
                }
            );

            if (response.status === 503) {
                const waitMs = Math.pow(2, attempt) * 3000;
                console.log(`   ⏳ Model loading, waiting ${waitMs / 1000}s...`);
                await new Promise(r => setTimeout(r, waitMs));
                continue;
            }

            if (response.status === 429) {
                const waitMs = Math.pow(2, attempt) * 5000;
                console.log(`   ⏳ Rate limited, waiting ${waitMs / 1000}s...`);
                await new Promise(r => setTimeout(r, waitMs));
                continue;
            }

            if (!response.ok) {
                const err = await response.text();
                throw new Error(`HF ${response.status}: ${err.slice(0, 100)}`);
            }
            const buf = Buffer.from(await response.arrayBuffer());
            return buf.length > 15000 ? buf : null;
        } catch (err: any) {
            if (attempt === retries) {
                console.error(`   ❌ HF FLUX: ${err.message}`);
                return null;
            }
            await new Promise(r => setTimeout(r, 2000));
        }
    }
    return null;
}

// ─── DALL-E 3 (AI-generated, high quality, paid) ───────────────────────────
let openaiInstance: OpenAI | null = null;

function getOpenAI(): OpenAI | null {
    if (!openaiInstance) {
        dotenv.config({ path: '.env.local' });
        const apiKey = process.env.OPENAI_API_KEY;
        if (!apiKey) return null;
        openaiInstance = new OpenAI({ apiKey });
    }
    return openaiInstance;
}

export async function generateDalle3Image(prompt: string): Promise<string | null> {
    const openai = getOpenAI();
    if (!openai) return null;
    try {
        const response = await openai.images.generate({
            model: 'dall-e-3',
            prompt,
            n: 1,
            size: '1024x1024',
            quality: 'standard',
        });
        return response.data?.[0]?.url ?? null;
    } catch (err: any) {
        console.error(`   ❌ DALL-E 3: ${err.message}`);
        return null;
    }
}

// ─── Pixazo Free API (FLUX Schnell, free tier, no payment needed) ───────────
/**
 * Pixazo offers free FLUX Schnell image generation.
 * Sign up at https://www.pixazo.ai to get an API key (free, no credit card).
 * Set PIXAZO_API_KEY in .env.local
 *
 * If no key is set, tries the free endpoint without auth.
 */
async function generatePixazoImage(prompt: string): Promise<Buffer | null> {
    const apiKey = process.env.PIXAZO_API_KEY;

    try {
        const url = 'https://api.pixazo.ai/v1/text-to-image/flux-schnell';
        const headers: Record<string, string> = {
            'Content-Type': 'application/json',
        };
        if (apiKey) {
            headers['Authorization'] = `Bearer ${apiKey}`;
        }

        console.log(`   🔄 Pixazo FLUX: Generating...`);
        const response = await fetch(url, {
            method: 'POST',
            headers,
            body: JSON.stringify({
                prompt,
                width: 1024,
                height: 1024,
            }),
            signal: AbortSignal.timeout(60000),
        });

        if (!response.ok) {
            const errText = await response.text();
            throw new Error(`Pixazo ${response.status}: ${errText.slice(0, 100)}`);
        }

        const data = await response.json();

        // Pixazo returns image URL or base64 depending on endpoint
        if (data.image_url) {
            const imgResp = await fetch(data.image_url, { signal: AbortSignal.timeout(30000) });
            if (imgResp.ok) {
                const buf = Buffer.from(await imgResp.arrayBuffer());
                if (buf.length > 15000) return buf;
            }
        } else if (data.image) {
            const buf = Buffer.from(data.image, 'base64');
            if (buf.length > 15000) return buf;
        } else if (data.data?.[0]?.url) {
            const imgResp = await fetch(data.data[0].url, { signal: AbortSignal.timeout(30000) });
            if (imgResp.ok) {
                const buf = Buffer.from(await imgResp.arrayBuffer());
                if (buf.length > 15000) return buf;
            }
        }

        throw new Error('No image data in Pixazo response');
    } catch (err: any) {
        console.error(`   ❌ Pixazo: ${err.message}`);
        return null;
    }
}

// ─── Unsplash API (real photos, ZERO Chinese text) ──────────────────────────
async function fetchUnsplashImage(keywords: string): Promise<Buffer | null> {
    const key = process.env.UNSPLASH_ACCESS_KEY;
    if (!key) return null;

    try {
        const url =
            `https://api.unsplash.com/photos/random` +
            `?query=${encodeURIComponent(keywords)}` +
            `&orientation=squarish&content_filter=high`;

        const metaResp = await fetch(url, {
            headers: { Authorization: `Client-ID ${key}` },
            signal: AbortSignal.timeout(15000),
        });
        if (!metaResp.ok) throw new Error(`Unsplash meta ${metaResp.status}`);

        const data = await metaResp.json();
        const imageUrl = data?.urls?.regular ?? data?.urls?.full;
        if (!imageUrl) throw new Error('No image URL in Unsplash response');

        const imgResp = await fetch(imageUrl, { signal: AbortSignal.timeout(30000) });
        if (!imgResp.ok) throw new Error(`Unsplash download ${imgResp.status}`);

        const buf = Buffer.from(await imgResp.arrayBuffer());
        return buf.length > 15000 ? buf : null;
    } catch (err: any) {
        console.error(`   ❌ Unsplash: ${err.message}`);
        return null;
    }
}

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN ORCHESTRATOR
// ═══════════════════════════════════════════════════════════════════════════════
/**
 * IMAGE PIPELINE (in priority order):
 *
 * 1. ★ Gemini Native     — FREE, uses existing GEMINI_API_KEY, excellent quality
 * 2.   Hugging Face FLUX — FREE, AI-generated, good quality
 * 3.   DALL-E 3          — PAID, AI-generated, excellent (backup)
 * 4.   Pixazo FLUX       — FREE, AI-generated (backup, optional PIXAZO_API_KEY)
 * 5.   Unsplash API      — FREE stock photos (when UNSPLASH_ACCESS_KEY is set)
 *
 * ❌ POLLINATIONS REMOVED — generates Chinese text
 * ❌ PICSUM REMOVED       — generates random irrelevant nature photos
 *
 * Each image gets a UNIQUE prompt based on blog title, description, and image index.
 */
export async function generateSmartImage(
    title: string,
    filepath: string,
    category: string = 'default',
    description: string = '',
    forceRegen: boolean = false,
    imageType: 'thumbnail' | 'body' = 'thumbnail',
    bodyIndex: number = 0,
    sectionContext?: SectionContext
): Promise<string | null> {
    // Return valid cached image unless force-regenerating
    if (!forceRegen && fs.existsSync(filepath)) {
        const stat = fs.statSync(filepath);
        if (stat.size > 15000) return filepath;
    }

    const slug = filepath.replace(/\\/g, '/').split('/').pop()?.replace('.png', '') ?? 'image';
    console.log(`\n🎨 [SmartImage] "${title.slice(0, 55)}..." [${imageType}${imageType === 'body' ? `-${bodyIndex + 1}` : ''}]`);
    if (sectionContext) {
        console.log(`   📌 Section: "${sectionContext.sectionHeading}" [${sectionContext.sectionType}] Topics: ${sectionContext.sectionKeyTopics.join(', ')}`);
    }

    const delay = (ms: number) => new Promise(r => setTimeout(r, ms));
    const save = (buf: Buffer, source: string): string => {
        fs.writeFileSync(filepath, buf);
        console.log(`   ✅ [${source}] Saved — ${buf.length.toLocaleString()} bytes → ${filepath}`);
        return filepath;
    };

    // Generate a unique, topic-specific prompt
    let imagePrompt: string;
    try {
        imagePrompt = await generateTopicSpecificPrompt(title, category, description, imageType, bodyIndex, sectionContext);
    } catch {
        imagePrompt = buildLocalPrompt(title, category, imageType, bodyIndex, sectionContext);
    }

    // Track to prevent exact duplicates
    const promptKey = `${slug}-${imageType}-${bodyIndex}`;
    if (usedPromptKeys.has(promptKey)) {
        imagePrompt += ` Unique variation seed: ${Date.now()}.`;
    }
    usedPromptKeys.add(promptKey);

    console.log(`   📝 Prompt: "${imagePrompt.slice(0, 120)}..."`);

    // ── 1. ★ Gemini Native Image Generation (FREE) ──────────────────────────
    try {
        console.log(`   🌟 [1/5] Trying Gemini Image (FREE, existing key)...`);
        const buf = await generateGeminiImage(imagePrompt);
        if (buf) return save(buf, 'Gemini Image');
    } catch { /* fall through */ }

    await delay(2000);

    // ── 2. Hugging Face FLUX (FREE) ─────────────────────────────────────────
    try {
        console.log(`   🔧 [2/5] Trying HF FLUX (FREE)...`);
        const buf = await generateHFImageBuffer(imagePrompt, 3);
        if (buf) return save(buf, 'HF FLUX');
    } catch { /* fall through */ }

    await delay(1000);

    // ── 3. DALL-E 3 (PAID backup) ───────────────────────────────────────────
    try {
        console.log(`   💰 [3/5] Trying DALL-E 3 (paid)...`);
        const url = await generateDalle3Image(imagePrompt);
        if (url) {
            const resp = await fetch(url, { signal: AbortSignal.timeout(30000) });
            if (resp.ok) {
                const buf = Buffer.from(await resp.arrayBuffer());
                if (buf.length > 15000) return save(buf, 'DALL-E 3');
            }
        }
    } catch { /* fall through */ }

    await delay(1000);

    // ── 4. Pixazo FLUX (FREE backup) ────────────────────────────────────────
    try {
        console.log(`   🎯 [4/5] Trying Pixazo FLUX (free)...`);
        const buf = await generatePixazoImage(imagePrompt);
        if (buf) return save(buf, 'Pixazo FLUX');
    } catch { /* fall through */ }

    await delay(1000);

    // ── 5. Unsplash API (topic-specific search) ─────────────────────────────
    try {
        console.log(`   🔍 [5/5] Trying Unsplash...`);
        const keywords = await generateSearchKeywords(title, category);
        console.log(`   🔑 Keywords: "${keywords}"`);
        const buf = await fetchUnsplashImage(keywords);
        if (buf) return save(buf, 'Unsplash');
    } catch { /* fall through */ }

    // ── NO PICSUM — no more random nature photos ────────────────────────────
    console.error(`   ❌ ALL 5 sources failed for: ${filepath}`);
    console.error(`   💡 TIP: Check API keys and network. At minimum GEMINI_API_KEY should work.`);
    return null;
}

// ─── Legacy exports (backwards compatibility) ───────────────────────────────
export function getStandardizedPrompt(prompt: string): string {
    return buildLocalPrompt(prompt, 'default');
}

export const POLLINATIONS_CONFIG = {
    getURL: (_prompt: string, _seed: number) => {
        throw new Error('Pollinations has been removed. Use generateSmartImage() instead.');
    },
};
