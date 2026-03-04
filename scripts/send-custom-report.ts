import * as nodemailer from 'nodemailer';
import * as fs from 'fs';
import * as path from 'path';
import * as dotenv from 'dotenv';
import { marked } from 'marked';

// 환경 변수 로드
dotenv.config({ path: '.env.local' });

const EMAIL_USER = process.env.EMAIL_USER;
const EMAIL_PASS = process.env.EMAIL_PASS;
const EMAIL_RECEIVER = process.env.EMAIL_RECEIVER;

async function sendCustomEmail() {
    console.log('📧 how-toai 전용 리포트를 발송합니다...');

    if (!EMAIL_USER || !EMAIL_PASS || !EMAIL_RECEIVER) {
        throw new Error('이메일 설정이 완료되지 않았습니다. .env.local 파일을 확인해주세요.');
    }

    const reportPath = path.join(process.cwd(), 'reports', 'how-toai-focused-analysis.md');
    if (!fs.existsSync(reportPath)) {
        throw new Error('리포트 파일을 찾을 수 없습니다.');
    }

    const markdownContent = fs.readFileSync(reportPath, 'utf-8');
    const reportHtml = await marked.parse(markdownContent);
    const dateStr = new Date().toISOString().split('T')[0];

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: EMAIL_USER,
            pass: EMAIL_PASS,
        },
    });

    const emailTemplate = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <style>
        body { margin: 0; padding: 0; font-family: 'Pretendard', -apple-system, BlinkMacSystemFont, system-ui, Roboto, sans-serif; background-color: #f4f7f9; color: #333; line-height: 1.7; }
        .container { max-width: 680px; margin: 40px auto; background: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 20px 40px rgba(0,0,0,0.08); }
        .header { background: linear-gradient(135deg, #6366f1 0%, #a855f7 100%); padding: 50px 30px; text-align: center; color: white; }
        .header h1 { margin: 0; font-size: 30px; font-weight: 800; letter-spacing: -0.02em; }
        .header p { margin: 12px 0 0; font-size: 17px; opacity: 0.9; font-weight: 400; }
        
        .content { padding: 40px; }
        .report-body { font-size: 16px; color: #444; }
        
        /* Markdown Styling */
        h1, h2, h3 { color: #1e293b; margin-top: 32px; margin-bottom: 16px; font-weight: 700; }
        h1 { font-size: 24px; border-bottom: 2px solid #e2e8f0; padding-bottom: 8px; }
        h2 { font-size: 20px; color: #4f46e5; }
        h3 { font-size: 18px; }
        
        ul { padding-left: 24px; margin-bottom: 20px; }
        li { margin-bottom: 12px; }
        
        code { background: #f1f5f9; padding: 2px 6px; border-radius: 4px; font-family: monospace; font-size: 0.9em; color: #ef4444; }
        pre { background: #1e293b; color: #e2e8f0; padding: 20px; border-radius: 12px; overflow-x: auto; font-size: 14px; margin: 20px 0; }
        pre code { background: transparent; color: inherit; padding: 0; }
        
        blockquote { margin: 24px 0; padding: 16px 24px; background: #f8fafc; border-left: 4px solid #6366f1; color: #475569; font-style: italic; border-radius: 0 8px 8px 0; }
        
        .footer { padding: 30px; text-align: center; background: #f8fafc; color: #94a3b8; font-size: 14px; border-top: 1px solid #e2e8f0; }
        .accent { color: #6366f1; font-weight: 700; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🚀 how-toai 전담 분석 리포트</h1>
            <p>${dateStr} 핵심 데이터 및 개선 전략</p>
        </div>
        <div class="content">
            <div class="report-body">
                ${reportHtml}
            </div>
        </div>
        <div class="footer">
            본 리포트는 <b>Antigravity AI 전문 분석 시스템</b>에 의해 자동 생성 및 발송되었습니다.<br>
            © ${new Date().getFullYear()} how-toai Insights
        </div>
    </div>
</body>
</html>
    `;

    const mailOptions = {
        from: `"Antigravity 분석 도우미" <${EMAIL_USER}>`,
        to: EMAIL_RECEIVER,
        subject: `[how-toai] 📊 전담 분석 보고서 및 프롬프트 가이드 도착`,
        html: emailTemplate,
    };

    await transporter.sendMail(mailOptions);
    console.log(`✅ 이메일 발송 완료! 수신: ${EMAIL_RECEIVER}`);
}

sendCustomEmail().catch(err => {
    console.error('❌ 에러 발생:', err);
    process.exit(1);
});
