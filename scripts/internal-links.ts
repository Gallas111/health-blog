import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const CONTENT_DIR = path.join(process.cwd(), 'content');
const MAX_LINKS_PER_POST = 3;

interface PostInfo {
  slug: string;
  title: string;
  filePath: string;
  keywords: string[];
}

// Manual keyword mapping for posts — these are the terms to match in body text
const KEYWORD_MAP: Record<string, string[]> = {
  'zapier-chatgpt-연동': ['Zapier와 ChatGPT', 'Zapier ChatGPT'],
  'zapier-guide-google-sheets-automation': ['Zapier로 구글 시트', '구글 시트 자동화'],
  'zapier-chatgpt-customer-response-automation': ['고객 응대 자동화'],
  'zapier-make-migration-ai-automation-cost-savings': ['Zapier에서 Make로'],
  'dalle-3-사용법-chatgpt-이미지-생성-가이드': ['DALL-E 3', 'DALL-E'],
  'midjourney-완벽-가이드-프롬프트-작성법': ['미드저니', 'Midjourney'],
  '구글-서치-콘솔-gsc-완벽-가이드': ['서치 콘솔', 'GSC', '구글 서치 콘솔'],
  '테크니컬-seo-체크리스트-2026': ['테크니컬 SEO'],
  '구글-애드센스-승인-받는-법-ai-블로그-전략': ['애드센스', '구글 애드센스'],
  '구글-상위-노출-ai-블로그-seo-완벽-가이드': ['SEO 전략', 'SEO 최적화'],
  'ai-블로그-시작하는-법-완벽-가이드-2026': ['AI 블로그 시작'],
  'chatgpt-블로그-글쓰기-자동화-월-100만원-수익-로드맵': ['블로그 글쓰기 자동화'],
  'claude-35-코딩': ['Claude 3.5', 'Claude 코딩'],
  'claude-ai-keyword-analysis-blog-post-optimization': ['키워드 분석', 'Claude AI 키워드'],
  'claude-blog-text-summary-automation': ['콘텐츠 요약 자동화'],
  'make-integromat-사용법-zapier-대안': ['Make 사용법', 'Make vs Zapier'],
  'integromat-usage-instructions': ['Integromat', 'Make(Integromat)'],
  'make-custom-app-integration': ['Make 커스텀 앱'],
  '무료-ai-이미지-생성-사이트-top5-비교': ['AI 이미지 생성'],
  '2026년-무료-ai-업무-자동화-툴-추천-top-3-코딩-없이-칼퇴하는-법-클로바노트-뤼튼-코파일럿': ['클로바노트', '뤼튼', '코파일럿'],
  '2026년-최고의-ai-코딩-도구-3가지-비교-cursor-v2-claude-45-copilot': ['AI 코딩 도구', 'Cursor'],
  'chatgpt5-model-o3-vs-claude-45-sonnet-2026년-개발자를-위한-승자는': ['ChatGPT-5', 'Claude 4.5'],
  'python-업무-자동화-엑셀-취합': ['파이썬 자동화', 'Python 자동화', '엑셀 자동화'],
  'crm-system-automation': ['CRM 자동화'],
  'chat-gpt-ai-meeting-minutes-generation': ['회의록 자동'],
  'chatgpt-meeting-summary-automation-settings': ['회의 요약 자동화'],
  'chatgpt-enterprise-data-analysis': ['기업용 ChatGPT'],
  'chatgpt-data-analysis-security': ['데이터 분석 보안'],
  'chatgpt-emoji-generation-guide': ['이모티콘 만들기', 'DALL-E 이모티콘'],
  '뉴스-뉴스레터-자동화-ai-요약': ['뉴스레터 자동화', '뉴스 자동 요약'],
  'claude-schedule-management-automatic-generation': ['일정 관리 자동화', 'Claude 일정'],
  'ai-automation-tools-comparison': ['자동화 도구 비교'],
  'blog-ai-productivity-improvement': ['블로그 생산성'],
  'generative-ai-company-integration': ['생성형 AI 도입'],
  'google-ai-studio-error': ['AI 스튜디오 오류', 'Google AI Studio'],
  'ai-productivity-enhancement': ['AI 업무 생산성', 'AI 에이전트'],
};

function getAllPosts(): PostInfo[] {
  const posts: PostInfo[] = [];

  function walk(dir: string) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        walk(fullPath);
      } else if (entry.name.endsWith('.mdx')) {
        const raw = fs.readFileSync(fullPath, 'utf-8');
        const { data } = matter(raw);
        if (data.slug) {
          const keywords = KEYWORD_MAP[data.slug] || [];
          posts.push({
            slug: data.slug,
            title: data.title || '',
            filePath: fullPath,
            keywords,
          });
        }
      }
    }
  }

  walk(CONTENT_DIR);
  return posts;
}

function isInsideMarkdownLink(text: string, matchIndex: number): boolean {
  // Check if the match position is inside [...](...)
  const before = text.substring(0, matchIndex);
  // Find the last [ before our match
  const lastOpen = before.lastIndexOf('[');
  const lastClose = before.lastIndexOf(']');
  // If there's an unclosed [ before us, we might be inside a link text
  if (lastOpen > lastClose) {
    return true;
  }
  // Check if inside the URL part ](...)
  const lastParenOpen = before.lastIndexOf('](');
  if (lastParenOpen > -1) {
    const afterParen = text.substring(lastParenOpen);
    const closeParenIdx = afterParen.indexOf(')');
    if (closeParenIdx === -1 || lastParenOpen + closeParenIdx > matchIndex) {
      return true;
    }
  }
  return false;
}

function isInsideCodeBlock(lines: string[], lineIndex: number): boolean {
  let insideCode = false;
  for (let i = 0; i < lineIndex; i++) {
    if (lines[i].trim().startsWith('```')) {
      insideCode = !insideCode;
    }
  }
  return insideCode;
}

function isHeadingLine(line: string): boolean {
  return /^#{1,6}\s/.test(line.trim());
}

function isImageAltOrSpecial(line: string): boolean {
  const trimmed = line.trim();
  return (
    trimmed.startsWith('![') ||
    trimmed.startsWith('> [이미지:') ||
    trimmed.startsWith('|') ||  // table rows
    trimmed.startsWith('<')     // JSX/HTML tags
  );
}

function processPost(post: PostInfo, allPosts: PostInfo[]): { modified: boolean; linksAdded: number } {
  const raw = fs.readFileSync(post.filePath, 'utf-8');
  const { data, content } = matter(raw);

  const lines = content.split('\n');
  let linksAdded = 0;
  const linkedSlugs = new Set<string>();

  // Find existing internal links to avoid duplicates
  const existingLinkPattern = /\[.*?\]\(\/blog\/([^)]+)\)/g;
  let existingMatch;
  while ((existingMatch = existingLinkPattern.exec(content)) !== null) {
    linkedSlugs.add(existingMatch[1]);
  }

  for (let i = 0; i < lines.length && linksAdded < MAX_LINKS_PER_POST; i++) {
    const line = lines[i];

    // Skip headings, code blocks, images, tables, html
    if (isHeadingLine(line)) continue;
    if (isInsideCodeBlock(lines, i)) continue;
    if (isImageAltOrSpecial(line)) continue;
    if (line.trim() === '') continue;
    if (line.trim().startsWith('---')) continue;

    for (const targetPost of allPosts) {
      if (linksAdded >= MAX_LINKS_PER_POST) break;
      if (targetPost.slug === post.slug) continue; // Skip self
      if (linkedSlugs.has(targetPost.slug)) continue; // Already linked
      if (targetPost.keywords.length === 0) continue;

      // Sort keywords by length (longest first) for best matching
      const sortedKeywords = [...targetPost.keywords].sort((a, b) => b.length - a.length);

      for (const keyword of sortedKeywords) {
        const idx = lines[i].indexOf(keyword);
        if (idx === -1) continue;

        // Verify not inside existing link
        if (isInsideMarkdownLink(lines[i], idx)) continue;

        // Replace first occurrence only
        const linkText = `[${keyword}](/blog/${targetPost.slug})`;
        lines[i] = lines[i].substring(0, idx) + linkText + lines[i].substring(idx + keyword.length);
        linksAdded++;
        linkedSlugs.add(targetPost.slug);
        break; // Move to next target post
      }
    }
  }

  if (linksAdded > 0) {
    const newContent = matter.stringify(lines.join('\n'), data);
    fs.writeFileSync(post.filePath, newContent, 'utf-8');
  }

  return { modified: linksAdded > 0, linksAdded };
}

async function main() {
  console.log('=== Internal Link Insertion Script ===\n');

  const allPosts = getAllPosts();
  console.log(`Found ${allPosts.length} posts\n`);

  let totalModified = 0;
  let totalLinks = 0;

  for (const post of allPosts) {
    const { modified, linksAdded } = processPost(post, allPosts);
    if (modified) {
      console.log(`✅ ${post.slug}: +${linksAdded} links`);
      totalModified++;
      totalLinks += linksAdded;
    }
  }

  console.log(`\n=== Done ===`);
  console.log(`Modified: ${totalModified} posts`);
  console.log(`Total links added: ${totalLinks}`);
}

main().catch(console.error);
