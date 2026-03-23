import { google } from 'googleapis';

import * as fs from 'fs';
import * as path from 'path';
import * as dotenv from 'dotenv';
import * as nodemailer from 'nodemailer';
import { marked } from 'marked';

// 환경 변수 연동
dotenv.config({ path: '.env.local' });
dotenv.config();

// 보안 및 권한 설정
const KEY_FILE_PATH = path.join(process.cwd(), 'google-credentials.json');
const GA_PROPERTY_ID = process.env.GA_PROPERTY_ID;
const GSC_SITE_URL = process.env.GSC_SITE_URL;
const CF_ACCOUNT_ID = process.env.CF_ACCOUNT_ID;
const CF_API_TOKEN = process.env.CF_API_TOKEN;

// 이메일 설정
const EMAIL_USER = process.env.EMAIL_USER;
const EMAIL_PASS = process.env.EMAIL_PASS;
const EMAIL_RECEIVER = process.env.EMAIL_RECEIVER;

/**
 * 1. Google API 인증 (Service Account)
 */
async function authenticateGoogle() {
    if (!fs.existsSync(KEY_FILE_PATH)) {
        throw new Error(`google-credentials.json 파일을 찾을 수 없습니다. 경로: ${KEY_FILE_PATH}\n(GCP에서 발급받은 서비스 계정 키를 프로젝트 최상단에 추가해주세요.)`);
    }
    const auth = new google.auth.GoogleAuth({
        keyFile: KEY_FILE_PATH,
        scopes: [
            'https://www.googleapis.com/auth/webmasters.readonly', // Search Console
            'https://www.googleapis.com/auth/analytics.readonly'   // Analytics Data
        ],
    });
    return await auth.getClient();
}

/**
 * 2. Search Console 데이터 수집 (최근 7일)
 */
async function fetchSearchConsoleData(authClient: any) {
    console.log('📊 Google Search Console 데이터를 수집합니다...');
    if (!GSC_SITE_URL) throw new Error('환경변수 GSC_SITE_URL이 설정되지 않았습니다.');

    const searchconsole = google.searchconsole({ version: 'v1', auth: authClient });

    // GSC 데이터는 보통 2~3일 정도 지연이 있으므로, 안전하게 3일 전부터 10일 전까지의 7일 데이터를 가져옵니다.
    const endDate = new Date();
    endDate.setDate(endDate.getDate() - 3);
    const startDate = new Date();
    startDate.setDate(endDate.getDate() - 10);

    const formatDate = (date: Date) => date.toISOString().split('T')[0];

    const response = await searchconsole.searchanalytics.query({
        siteUrl: GSC_SITE_URL,
        requestBody: {
            startDate: formatDate(startDate),
            endDate: formatDate(endDate),
            dimensions: ['query', 'page'],
            rowLimit: 20, // 상위 20개 키워드/페이지 조합
        },
    });

    return response.data.rows || [];
}

/**
 * 3. GA4 데이터 수집 (최근 7일)
 */
async function fetchAnalyticsData(authClient: any) {
    console.log('📈 Google Analytics 4 데이터를 수집합니다...');
    if (!GA_PROPERTY_ID) throw new Error('환경변수 GA_PROPERTY_ID가 설정되지 않았습니다.');

    const analyticsdata = google.analyticsdata({ version: 'v1beta', auth: authClient });

    // @ts-ignore
    const response = await analyticsdata.properties.runReport({
        property: `properties/${GA_PROPERTY_ID}`,
        requestBody: {
            dateRanges: [{ startDate: '7daysAgo', endDate: 'today' }],
            dimensions: [{ name: 'pageTitle' }, { name: 'pagePath' }, { name: 'hostName' }],
            metrics: [{ name: 'screenPageViews' }, { name: 'bounceRate' }, { name: 'averageSessionDuration' }, { name: 'engagementRate' }],
            dimensionFilter: {
                filter: {
                    fieldName: 'hostName',
                    stringFilter: {
                        matchType: 'CONTAINS',
                        value: 'how-toai.com',
                    },
                },
            },
            limit: 30,
        },
    }) as any;

    return response.data.rows || [];
}

/**
 * 4. Cloudflare Workers AI로 인사이트 및 리포트 도출
 */
async function generateInsightsWithGemini(gscData: any[], gaData: any[]) {
    console.log('🧠 Cloudflare Workers AI로 트래픽 분석 및 성장 리포트를 작성 중입니다...');
    if (!CF_ACCOUNT_ID || !CF_API_TOKEN) throw new Error('환경변수 CF_ACCOUNT_ID 또는 CF_API_TOKEN이 설정되지 않았습니다.');

    const CF_MODEL = '@cf/meta/llama-3.3-70b-instruct-fp8-fast';
    const url = `https://api.cloudflare.com/client/v4/accounts/${CF_ACCOUNT_ID}/ai/run/${CF_MODEL}`;

    const prompt = `
당신은 최고의 SEO 전문가이자 수익형 블로그 성장 컨설턴트 '자동성장 도우미'입니다.
다음은 내 블로그 **how-toai.com** (AI 오류 해결·설정·비교 전문 가이드)의 최근 7일간 데이터입니다.
※ 주의: IT핫딜랩(ithotdealab.com)은 별도 프로젝트이므로 분석에서 완전히 제외하세요. how-toai.com 블로그 데이터만 분석하세요.

[GSC 데이터 요약]
${JSON.stringify(gscData, null, 2)}

[GA4 데이터 요약]
${JSON.stringify(gaData, null, 2)}

위 데이터를 기반으로 전문적이고 시각적으로 구조화된 **마크다운 형식의 주간 성장 리포트**를 작성해주세요.
이메일로 발송될 예정이므로, 가독성이 매우 좋아야 하며 핵심 포인트가 눈에 확 띄어야 합니다.

리포트에는 반드시 다음 내용이 포함되어야 합니다:

1. **📊 이번 주 트래픽 성적표 (Performance Summary)**: 
   - 주요 유입 키워드 분석 및 전반적인 성장세 평가
   - 체류 시간 및 이탈률을 통한 사용자 반응 요약

2. **🚀 당장 실행해야 할 액션 플랜 (Urgent Action Items)**: 
   - 노출량은 많으나 클릭이 적은 글의 제목 수정 제안 (구체적인 대안 제시)
   - 트래픽은 많으나 이탈률이 높은 페이지의 개선 방안 제시

3. **🎯 다음 포스팅 추천 주제 (Next Topics to Cover)**: 
   - 현재 트래픽 데이터를 바탕으로 유입을 폭발시킬 수 있는 연관 주제 3가지 추천
   - 각 추천 이유와 예상 제목 제시

섹션 구분은 ## 또는 ### 마크다운 헤더를 사용하고, 중요 포인트는 **강조**표시를 적절히 사용해주세요.
`;

    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${CF_API_TOKEN}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            messages: [{ role: 'user', content: prompt }],
            max_tokens: 8192,
        }),
    });
    if (!response.ok) throw new Error(`CF Workers AI error (${response.status}): ${await response.text()}`);
    const data = await response.json();
    return (data as any).result?.response || '';
}

/**
 * 5. 마크다운 파일로 결과 저장
 */
async function saveReport(markdownContent: string) {
    const reportsDir = path.join(process.cwd(), 'reports');
    if (!fs.existsSync(reportsDir)) {
        fs.mkdirSync(reportsDir);
    }

    const dateStr = new Date().toISOString().split('T')[0];
    const reportPath = path.join(reportsDir, `growth-report-${dateStr}.md`);

    fs.writeFileSync(reportPath, markdownContent, 'utf-8');
    console.log(`\n🎉 자동성장 리포트가 성공적으로 발간되었습니다!\n-> 📄 파일 경로: ${reportPath}`);
    return reportPath;
}

/**
 * 6. 이메일로 리포트 발송 (Premium 스타일)
 */
async function sendReportEmail(markdownContent: string) {
    console.log('📧 프리미엄 리포트를 이메일로 발송합니다...');

    if (!EMAIL_USER || !EMAIL_PASS || !EMAIL_RECEIVER) {
        throw new Error('이메일 설정이 완료되지 않았습니다.');
    }

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: EMAIL_USER,
            pass: EMAIL_PASS,
        },
    });

    const reportHtml = marked.parse(markdownContent);
    const dateStr = new Date().toISOString().split('T')[0];

    const premiumTemplate = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <style>
        body { margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f0f2f5; color: #333; line-height: 1.6; }
        .container { max-width: 650px; margin: 30px auto; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 10px 25px rgba(0,0,0,0.05); }
        .header { background: #1a73e8; padding: 40px 20px; text-align: center; color: white; }
        .header h1 { margin: 0; font-size: 28px; font-weight: bold; }
        .header p { margin: 10px 0 0; font-size: 16px; opacity: 0.9; }
        
        .content { padding: 30px; }
        .report-section { margin-bottom: 30px; padding: 20px; border-radius: 8px; background: #f8f9fa; border-left: 5px solid #1a73e8; }
        
        /* Markdown Overrides */
        h1, h2, h3 { color: #1a73e8; margin-top: 0; }
        ul { padding-left: 20px; }
        li { margin-bottom: 10px; }
        strong { color: #d93025; }
        blockquote { background: #fff5f5; border-left: 4px solid #d93025; padding: 10px 20px; margin: 20px 0; color: #444; }
        
        .footer { padding: 20px; text-align: center; background: #f1f3f4; color: #5f6368; font-size: 13px; }
        .button { display: inline-block; padding: 12px 25px; background: #1a73e8; color: white !important; text-decoration: none; border-radius: 6px; font-weight: bold; margin-top: 20px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>📈 주간 블로그 성장 리포트</h1>
            <p>${dateStr} 분석 결과</p>
        </div>
        <div class="content">
            <div class="report-body">
                ${reportHtml}
            </div>
            <div style="text-align: center;">
                <a href="${GSC_SITE_URL}" class="button">Google Console에서 자세히 보기</a>
            </div>
        </div>
        <div class="footer">
            본 리포트는 <b>자동성장 도우미</b>에 의해 발송되었습니다.<br>
            © ${new Date().getFullYear()} AI Blog Insights
        </div>
    </div>
</body>
</html>
    `;

    const mailOptions = {
        from: `"자동성장 도우미" <${EMAIL_USER}>`,
        to: EMAIL_RECEIVER,
        subject: `[리포트] 🚀 ${dateStr} 블로그 성장을 위한 AI 인사이트`,
        html: premiumTemplate,
    };

    await transporter.sendMail(mailOptions);
    console.log(`✅ 프리미엄 이메일 발송 완료! 수신: ${EMAIL_RECEIVER}`);
}

/**
 * 메인 실행 함수
 */
async function main() {
    try {
        console.log('🚀 자동성장 도우미 분석을 시작합니다...');
        const authClient = await authenticateGoogle();

        const gscData = await fetchSearchConsoleData(authClient);
        const gaData = await fetchAnalyticsData(authClient);

        const insights = await generateInsightsWithGemini(gscData, gaData);
        await saveReport(insights);
        await sendReportEmail(insights);

    } catch (error) {
        console.error('\n❌ 실행 중 에러가 발생했습니다:');
        if (error instanceof Error) {
            console.error(error.message);
        } else {
            console.error(error);
        }
        process.exit(1);
    }
}

main();
