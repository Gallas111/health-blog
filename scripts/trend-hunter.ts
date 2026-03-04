import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import { callGemini, callGeminiJSON } from './utils/ai-utils';

dotenv.config();
dotenv.config({ path: '.env.local' });

const KEYWORDS_DB_PATH = path.join(process.cwd(), 'scripts', 'keywords.json');
const SEARCHAPI_API_KEY = process.env.SEARCHAPI_API_KEY;

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

const CATEGORIES = [
    "symptoms",
    "home-remedies",
    "supplements",
    "daily-health",
    "pharmacy-guide"
];

// --- SearchAPI Sources ---

/** 1. 실제 한국 실시간 트렌딩 키워드 (하드코딩 X, 실제 데이터) */
async function fetchTrendingNow(): Promise<string> {
    try {
        const url = `https://www.searchapi.io/api/v1/search?engine=google_trends_trending_now&geo=KR&time=past_7_days&api_key=${SEARCHAPI_API_KEY}`;
        const res = await fetch(url);
        const data = await res.json();

        const trends = (data.trends || [])
            .slice(0, 20)
            .map((t: any) => {
                const keywords = (t.keywords || []).join(', ');
                return `- ${t.query} (검색량: ${t.search_volume || 'N/A'}, +${t.percentage_increase || 0}%) [${keywords}]`;
            })
            .join('\n');

        console.log(`  ✅ Trending Now KR: ${trends ? 'found trends' : 'no trends'}`);
        return trends;
    } catch (err: any) {
        console.error(`  ❌ Trending Now failed: ${err.message}`);
        return '';
    }
}

/** 2. 건강 관련 최신 뉴스 (한국) */
async function fetchHealthNews(): Promise<string> {
    try {
        const url = `https://www.searchapi.io/api/v1/search?engine=google_news&q=${encodeURIComponent('건강 영양제 의약품')}&gl=kr&hl=ko&time_period=last_week&api_key=${SEARCHAPI_API_KEY}`;
        const res = await fetch(url);
        const data = await res.json();

        const articles = (data.news_results || [])
            .slice(0, 10)
            .map((a: any) => `- ${a.title}${a.snippet ? ': ' + a.snippet : ''}`)
            .join('\n');

        console.log(`  ✅ Health News: ${articles ? 'found articles' : 'no articles'}`);
        return articles;
    } catch (err: any) {
        console.error(`  ❌ Health News failed: ${err.message}`);
        return '';
    }
}

/** 3. Google Autocomplete - 실시간 검색 패턴 (동적 쿼리) */
async function fetchAutocomplete(query: string): Promise<string> {
    try {
        const url = `https://www.searchapi.io/api/v1/search?engine=google_autocomplete&q=${encodeURIComponent(query)}&gl=kr&hl=ko&api_key=${SEARCHAPI_API_KEY}`;
        const res = await fetch(url);
        const data = await res.json();

        const suggestions = (data.suggestions || [])
            .slice(0, 10)
            .map((s: any) => s.value || s.suggestion || s)
            .join(', ');

        console.log(`  ✅ Autocomplete "${query}": ${suggestions ? 'found' : 'none'}`);
        return suggestions;
    } catch (err: any) {
        console.error(`  ❌ Autocomplete failed: ${err.message}`);
        return '';
    }
}

/** 4. YouTube 인기 건강 영상 */
async function fetchYouTube(query: string): Promise<string> {
    try {
        const url = `https://www.searchapi.io/api/v1/search?engine=youtube&q=${encodeURIComponent(query)}&gl=kr&hl=ko&api_key=${SEARCHAPI_API_KEY}`;
        const res = await fetch(url);
        const data = await res.json();

        const videos = (data.video_results || [])
            .slice(0, 8)
            .map((v: any) => `- ${v.title} (${v.views || 'N/A'} views)`)
            .join('\n');

        console.log(`  ✅ YouTube: ${videos ? 'found videos' : 'no videos'}`);
        return videos;
    } catch (err: any) {
        console.error(`  ❌ YouTube failed: ${err.message}`);
        return '';
    }
}

/** 5. People Also Ask */
async function fetchPAA(query: string): Promise<string> {
    try {
        const url = `https://www.searchapi.io/api/v1/search?engine=google&q=${encodeURIComponent(query)}&gl=kr&hl=ko&api_key=${SEARCHAPI_API_KEY}`;
        const res = await fetch(url);
        const data = await res.json();

        const paaQuestions = (data.related_questions || [])
            .slice(0, 8)
            .map((q: any) => `- ${q.question}${q.snippet ? ' → ' + q.snippet.substring(0, 80) : ''}`)
            .join('\n');

        console.log(`  ✅ PAA: ${paaQuestions ? 'found questions' : 'no questions'}`);
        return paaQuestions;
    } catch (err: any) {
        console.error(`  ❌ PAA failed: ${err.message}`);
        return '';
    }
}

// --- Main Collection ---

interface TrendData {
    trendingNow: string;
    news: string;
    autocomplete: string;
    youtube: string;
    paa: string;
}

async function collectTrendData(): Promise<TrendData> {
    if (!SEARCHAPI_API_KEY) {
        console.warn("⚠️ SEARCHAPI_API_KEY is missing.");
        return { trendingNow: '', news: '', autocomplete: '', youtube: '', paa: '' };
    }

    // Phase 1: 실제 트렌딩 + 뉴스 먼저 수집 (seed query 없이)
    console.log("📡 Phase 1: Fetching real trending data (no hardcoded seeds)...");
    const [trendingNow, news] = await Promise.all([
        fetchTrendingNow(),
        fetchHealthNews()
    ]);

    // Phase 2: 트렌딩에서 건강 관련 키워드를 뽑아 동적 쿼리 생성
    const dynamicQuery = await pickDynamicQuery(trendingNow, news);
    console.log(`🎯 Dynamic query from trends: "${dynamicQuery}"`);

    // Phase 3: 동적 쿼리로 심화 검색
    console.log("📡 Phase 2: Deep search with dynamic query...");
    const [autocomplete, youtube, paa] = await Promise.all([
        fetchAutocomplete(dynamicQuery),
        fetchYouTube(dynamicQuery),
        fetchPAA(dynamicQuery)
    ]);

    return { trendingNow, news, autocomplete, youtube, paa };
}

/** 트렌딩 데이터에서 건강 관련 동적 쿼리를 Gemini로 추출 */
async function pickDynamicQuery(trendingNow: string, news: string): Promise<string> {
    if (!trendingNow && !news) return '건강 관리법 2026';

    const prompt = `
아래는 한국의 실시간 트렌딩 데이터와 최신 건강 뉴스입니다.

## 실시간 트렌딩
${trendingNow || '없음'}

## 최신 건강 뉴스
${news || '없음'}

위 데이터에서 **건강/의료/영양/운동/생활건강과 관련된 가장 핫한 주제 1개**를 골라,
한국어 검색 쿼리 형태로 변환하세요. (예: "비타민D 부족 증상", "면역력 높이는 음식", "불면증 해결법")

규칙:
- 반드시 위 데이터에서 실제로 언급된 주제를 기반으로 할 것
- 건강과 전혀 관련 없으면 "건강" + 해당 주제로 연결할 것
- 검색하기 좋은 자연스러운 한국어 구문으로 출력
- 쿼리 문자열 하나만 출력 (따옴표, 설명 없이)
`;

    try {
        const result = await callGemini(
            prompt,
            '검색 쿼리 하나만 출력하세요. JSON이 아닌 일반 텍스트로.'
        );
        const query = result.replace(/['"]/g, '').trim();
        return query || '건강 관리법 2026';
    } catch {
        return '건강 관리법 2026';
    }
}

// --- AI Analysis ---

async function analyzeWithAI(
    data: TrendData,
    recentKeywords: string[]
): Promise<KeywordRecord[]> {
    console.log("🤖 AI analyzing real trend data for health topics...");

    const hasData = data.trendingNow || data.news || data.autocomplete || data.youtube || data.paa;
    if (!hasData) {
        console.warn("⚠️ No data collected from any source.");
        return [];
    }

    const prompt = `
당신은 한국 건강 블로그 전문 SEO 키워드 리서처입니다.

## 실제 수집된 트렌드 데이터

### 1. 한국 실시간 트렌딩 (Google Trends Trending Now KR)
${data.trendingNow || '데이터 없음'}

### 2. 최신 건강 뉴스 (지난 7일)
${data.news || '데이터 없음'}

### 3. Google Autocomplete (실제 검색 패턴)
${data.autocomplete || '데이터 없음'}

### 4. YouTube 인기 영상
${data.youtube || '데이터 없음'}

### 5. People Also Ask (사람들이 자주 묻는 질문)
${data.paa || '데이터 없음'}

## 핵심 지시

위 데이터는 **실제 실시간 트렌드**입니다. 이 데이터에 기반하여 건강 관련 키워드를 선정하세요.
절대 데이터에 없는 주제를 임의로 만들지 마세요.

### 선별 기준 (중요도 순):
1. **실제 트렌드 기반** — 위 데이터에서 실제로 뜨고 있는 건강/의료 관련 주제 (최우선)
2. **검색 수요 확인** — autocomplete/PAA에서 사람들이 실제로 검색하는 건강 패턴
3. **뉴스 시의성** — 최근 뉴스에서 언급된 새로운 건강 트렌드
4. **실용적 가치** — "증상", "좋은 음식", "효능", "복용법", "해결법" 등 실용 검색의도
5. **낮은 경쟁** — 대형 사이트가 아직 다루지 않은 틈새

### 제외 (최근 사용됨):
${JSON.stringify(recentKeywords)}

### 카테고리:
- symptoms: 증상별 건강정보 (두통, 위염, 감기 등)
- home-remedies: 민간요법, 좋은 음식 (감기에 좋은 음식 등)
- supplements: 영양제 정보 (비타민D, 오메가3 등)
- daily-health: 생활건강 상식 (수면, 운동, 식단)
- pharmacy-guide: 약국/의약품 상식 (OTC 정보)

## 출력 (JSON 배열만)

[
  {
    "mainKeyword": "한국어 롱테일 건강 키워드",
    "slug": "english-kebab-case-slug",
    "category": "카테고리명",
    "source": "trending|news|autocomplete|youtube|paa",
    "estimatedVolume": "high|medium|low",
    "competition": "high|medium|low",
    "intent": "informational|commercial|transactional"
  }
]
`;

    const parsed = await callGeminiJSON<any>(
        prompt,
        '당신은 건강 SEO 키워드 리서처입니다. JSON 배열만 출력하세요.',
        { keywords: [] }
    );

    const result = Array.isArray(parsed) ? parsed : (parsed.keywords || parsed.trends || []);

    return result.map((k: any) => ({
        mainKeyword: k.mainKeyword,
        slug: k.slug,
        category: CATEGORIES.includes(k.category) ? k.category : 'daily-health',
        createdAt: new Date().toISOString(),
        source: k.source,
        estimatedVolume: k.estimatedVolume,
        competition: k.competition,
        intent: k.intent
    }));
}

// --- Entry Point ---

async function main() {
    console.log("🏹 Health Trend Hunter Bot — Real Trends, No Hardcoded Seeds");

    // 1. Collect REAL trend data
    const trendData = await collectTrendData();

    const sourceCount = [trendData.trendingNow, trendData.news, trendData.autocomplete, trendData.youtube, trendData.paa].filter(Boolean).length;
    console.log(`📊 Collected data from ${sourceCount}/5 sources`);

    if (sourceCount === 0) {
        console.log("⚠️ No trend data from any source. Exiting.");
        return;
    }

    // 2. Load existing keywords for dedup
    const dbRaw = fs.readFileSync(KEYWORDS_DB_PATH, 'utf-8');
    const db: KeywordRecord[] = JSON.parse(dbRaw);
    const recentKeywords = db.slice(-30).map(k => k.mainKeyword);

    // 3. AI analysis on REAL data
    const newKeywords = await analyzeWithAI(trendData, recentKeywords);
    console.log(`✨ AI identified ${newKeywords.length} new potential health topics.`);

    if (newKeywords.length === 0) return;

    // 4. Filter duplicates
    const filteredKeywords = newKeywords.filter(nk =>
        !db.some(ek => ek.slug === nk.slug) &&
        !db.some(ek => {
            const normalize = (s: string) => s.replace(/[^a-zA-Z0-9가-힣]/g, "").toLowerCase();
            return normalize(ek.mainKeyword) === normalize(nk.mainKeyword);
        })
    );

    if (filteredKeywords.length > 0) {
        const updatedDb = [...db, ...filteredKeywords];
        fs.writeFileSync(KEYWORDS_DB_PATH, JSON.stringify(updatedDb, null, 2));
        console.log(`✅ Added ${filteredKeywords.length} new health keywords to keywords.json`);
        filteredKeywords.forEach(k => {
            const meta = [k.source, k.estimatedVolume ? `vol:${k.estimatedVolume}` : '', k.competition ? `comp:${k.competition}` : ''].filter(Boolean).join(', ');
            console.log(`   - [${k.category}] ${k.mainKeyword} (${meta})`);
        });
    } else {
        console.log("⏭️ All identified trends already exist. No updates made.");
    }

    console.log("🏁 Health Trend Hunter Bot finished.");
}

main().catch(console.error);
