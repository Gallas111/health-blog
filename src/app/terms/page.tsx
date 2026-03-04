import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: '이용약관 | 오늘도 건강',
    description: '오늘도 건강(wellnesstodays.com) 이용약관',
};

export default function TermsPage() {
    return (
        <div className="container mx-auto px-4 py-12 max-w-3xl">
            <h1 className="text-2xl font-bold mb-2">이용약관</h1>
            <p className="text-sm text-gray-500 mb-8">시행일: 2026년 3월 1일</p>

            <div className="space-y-8 text-gray-700 leading-relaxed text-[0.9375rem]">
                <section>
                    <h2 className="text-lg font-bold text-gray-900 mb-2">제1조 (목적)</h2>
                    <p>
                        본 약관은 <strong>오늘도 건강</strong>(이하 "사이트", www.wellnesstodays.com)이
                        제공하는 건강 정보 서비스의 이용 조건 및 절차, 이용자와 사이트 간의 권리·의무 및
                        책임 사항을 규정함을 목적으로 합니다.
                    </p>
                </section>

                <section>
                    <h2 className="text-lg font-bold text-gray-900 mb-2">제2조 (정의)</h2>
                    <ul className="list-disc pl-5 space-y-1">
                        <li><strong>"사이트"</strong>란 오늘도 건강(www.wellnesstodays.com)이 제공하는 웹사이트를 말합니다.</li>
                        <li><strong>"이용자"</strong>란 본 사이트에 접속하여 서비스를 이용하는 모든 방문자를 말합니다.</li>
                        <li><strong>"콘텐츠"</strong>란 사이트에 게시된 글, 이미지, 영상 등 모든 정보를 말합니다.</li>
                    </ul>
                </section>

                <section>
                    <h2 className="text-lg font-bold text-gray-900 mb-2">제3조 (약관의 효력 및 변경)</h2>
                    <ul className="list-decimal pl-5 space-y-1">
                        <li>본 약관은 사이트에 공시함으로써 효력이 발생합니다.</li>
                        <li>사이트는 합리적인 사유가 발생할 경우 관련 법령에 위배되지 않는 범위 안에서 약관을 변경할 수 있으며, 변경 시 사이트 내 공지합니다.</li>
                        <li>변경된 약관은 공시된 날로부터 효력이 발생합니다.</li>
                    </ul>
                </section>

                <section>
                    <h2 className="text-lg font-bold text-gray-900 mb-2">제4조 (서비스의 내용)</h2>
                    <p>사이트는 다음과 같은 서비스를 제공합니다.</p>
                    <ul className="list-disc pl-5 mt-2 space-y-1">
                        <li>증상별 건강 정보 제공 (두통, 위염, 감기, 불면증 등)</li>
                        <li>민간요법 및 좋은 음식 정보</li>
                        <li>영양제 효능, 복용법, 부작용 정보</li>
                        <li>생활건강 상식 및 건강 생활습관 가이드</li>
                        <li>약국·의약품 관련 상식 제공</li>
                        <li>기타 건강 관련 콘텐츠</li>
                    </ul>
                </section>

                <section>
                    <h2 className="text-lg font-bold text-gray-900 mb-2">제5조 (의료 면책 조항)</h2>
                    <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                        <p className="font-semibold text-amber-800 mb-2">⚠️ 중요 안내</p>
                        <ul className="list-disc pl-5 space-y-1 text-amber-900">
                            <li>본 사이트의 모든 콘텐츠는 <strong>일반적인 건강 정보 제공</strong>을 목적으로 하며, 의학적 진단이나 치료를 대체하지 않습니다.</li>
                            <li>건강 관련 의사결정은 반드시 <strong>의료 전문가와 상담</strong> 후에 하시기 바랍니다.</li>
                            <li>사이트의 정보를 근거로 한 자가 진단 및 자가 치료로 인해 발생하는 문제에 대해 사이트는 책임을 지지 않습니다.</li>
                            <li>콘텐츠에 포함된 영양제, 식품, 생활습관 관련 정보는 개인의 건강 상태에 따라 다르게 적용될 수 있습니다.</li>
                        </ul>
                    </div>
                </section>

                <section>
                    <h2 className="text-lg font-bold text-gray-900 mb-2">제6조 (지적재산권)</h2>
                    <ul className="list-decimal pl-5 space-y-1">
                        <li>사이트에 게시된 모든 콘텐츠(글, 이미지, 디자인, 로고 등)의 저작권은 오늘도 건강에 귀속됩니다.</li>
                        <li>이용자는 사이트의 콘텐츠를 개인적 비상업적 용도로만 이용할 수 있으며, 무단 복제·배포·전송·변경·출판 등을 할 수 없습니다.</li>
                        <li>콘텐츠를 인용할 경우, 출처를 명확히 표기하고 원문 링크를 포함해야 합니다.</li>
                    </ul>
                </section>

                <section>
                    <h2 className="text-lg font-bold text-gray-900 mb-2">제7조 (이용자의 의무)</h2>
                    <p>이용자는 다음 행위를 하여서는 안 됩니다.</p>
                    <ul className="list-disc pl-5 mt-2 space-y-1">
                        <li>사이트의 정상적인 운영을 방해하는 행위</li>
                        <li>타인의 개인정보를 수집·저장·공개하는 행위</li>
                        <li>사이트의 콘텐츠를 무단으로 크롤링·스크래핑하는 행위</li>
                        <li>허위 정보를 유포하거나 사이트의 명예를 훼손하는 행위</li>
                        <li>기타 관련 법령에 위반되는 행위</li>
                    </ul>
                </section>

                <section>
                    <h2 className="text-lg font-bold text-gray-900 mb-2">제8조 (광고 게재)</h2>
                    <ul className="list-decimal pl-5 space-y-1">
                        <li>사이트는 서비스 운영을 위해 Google AdSense 등 제3자 광고 네트워크를 통한 광고를 게재할 수 있습니다.</li>
                        <li>광고로 인한 이용자와 광고주 간의 거래에 대해 사이트는 책임을 지지 않습니다.</li>
                        <li>광고 콘텐츠는 사이트의 편집 콘텐츠와 구분되며, 사이트가 해당 상품·서비스를 보증하는 것은 아닙니다.</li>
                    </ul>
                </section>

                <section>
                    <h2 className="text-lg font-bold text-gray-900 mb-2">제9조 (외부 링크)</h2>
                    <p>
                        사이트에는 약국찾자(yakchatja.com) 등 외부 웹사이트로의 링크가 포함될 수 있습니다.
                        외부 사이트의 콘텐츠, 개인정보 처리, 서비스 등에 대해서는 해당 사이트의 약관 및
                        정책이 적용되며, 오늘도 건강은 이에 대해 책임을 지지 않습니다.
                    </p>
                </section>

                <section>
                    <h2 className="text-lg font-bold text-gray-900 mb-2">제10조 (면책 조항)</h2>
                    <ul className="list-decimal pl-5 space-y-1">
                        <li>사이트는 천재지변, 서버 장애, 기타 불가항력적 사유로 인한 서비스 중단에 대해 책임을 지지 않습니다.</li>
                        <li>사이트는 이용자가 콘텐츠를 활용하여 얻은 결과에 대해 보증하지 않으며, 이로 인한 손해에 대해 책임을 지지 않습니다.</li>
                        <li>사이트의 콘텐츠는 작성 시점을 기준으로 하며, 의학 정보의 변경에 따라 내용이 달라질 수 있습니다.</li>
                    </ul>
                </section>

                <section>
                    <h2 className="text-lg font-bold text-gray-900 mb-2">제11조 (준거법 및 관할)</h2>
                    <p>
                        본 약관의 해석 및 분쟁 해결은 대한민국 법률에 따르며,
                        분쟁 발생 시 관할 법원은 민사소송법에 따른 관할 법원으로 합니다.
                    </p>
                </section>

                <section>
                    <h2 className="text-lg font-bold text-gray-900 mb-2">제12조 (문의)</h2>
                    <p>본 약관에 대한 문의사항은 아래로 연락해 주시기 바랍니다.</p>
                    <ul className="list-disc pl-5 mt-2 space-y-1">
                        <li>사이트명: 오늘도 건강</li>
                        <li>URL: www.wellnesstodays.com</li>
                        <li>이메일: contact@wellnesstodays.com</li>
                    </ul>
                </section>
            </div>
        </div>
    );
}
