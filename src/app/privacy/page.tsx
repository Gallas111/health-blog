import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: '개인정보 처리방침 | 오늘도 건강',
    description: '오늘도 건강(wellnesstodays.com) 개인정보 처리방침',
};

export default function PrivacyPage() {
    return (
        <div className="container mx-auto px-4 py-12 max-w-3xl">
            <h1 className="text-2xl font-bold mb-2">개인정보 처리방침</h1>
            <p className="text-sm text-gray-500 mb-8">시행일: 2026년 3월 1일</p>

            <div className="space-y-8 text-gray-700 leading-relaxed text-[0.9375rem]">
                <section>
                    <h2 className="text-lg font-bold text-gray-900 mb-2">1. 개인정보 처리방침의 목적</h2>
                    <p>
                        <strong>오늘도 건강</strong>(www.wellnesstodays.com, 이하 "사이트")은 이용자의
                        개인정보를 중요시하며, 「개인정보 보호법」 등 관련 법령을 준수하고 있습니다.
                        본 개인정보 처리방침을 통해 이용자의 개인정보가 어떤 목적과 방식으로
                        수집·이용·관리되는지 알려드립니다.
                    </p>
                </section>

                <section>
                    <h2 className="text-lg font-bold text-gray-900 mb-2">2. 수집하는 개인정보 항목</h2>

                    <h3 className="font-semibold text-gray-800 mt-3 mb-1">가. 자동 수집 정보</h3>
                    <p>사이트 이용 과정에서 다음 정보가 자동으로 수집될 수 있습니다.</p>
                    <ul className="list-disc pl-5 mt-2 space-y-1">
                        <li>IP 주소, 브라우저 종류 및 버전</li>
                        <li>운영체제, 기기 정보 (데스크톱/모바일)</li>
                        <li>방문 일시, 페이지 조회 기록, 체류 시간</li>
                        <li>유입 경로 (검색엔진, 외부 링크 등)</li>
                        <li>쿠키(Cookie) 정보</li>
                    </ul>

                    <h3 className="font-semibold text-gray-800 mt-3 mb-1">나. 이용자 제공 정보</h3>
                    <p>문의하기 등을 통해 이용자가 직접 제공하는 경우에 한해 수집됩니다.</p>
                    <ul className="list-disc pl-5 mt-2 space-y-1">
                        <li>이메일 주소 (문의 시)</li>
                        <li>이름 (선택 사항, 문의 시)</li>
                    </ul>
                </section>

                <section>
                    <h2 className="text-lg font-bold text-gray-900 mb-2">3. 개인정보의 수집 및 이용 목적</h2>
                    <p>수집된 정보는 다음의 목적으로만 이용됩니다.</p>
                    <ul className="list-disc pl-5 mt-2 space-y-1">
                        <li><strong>웹사이트 운영 및 개선:</strong> 방문자 통계 분석, 사이트 이용 현황 파악, 서비스 품질 개선</li>
                        <li><strong>문의 응대:</strong> 이용자 문의에 대한 답변 및 처리</li>
                        <li><strong>광고 서비스:</strong> Google AdSense를 통한 맞춤형 광고 제공</li>
                        <li><strong>법적 의무 이행:</strong> 관련 법령에 따른 의무 이행</li>
                    </ul>
                </section>

                <section>
                    <h2 className="text-lg font-bold text-gray-900 mb-2">4. 쿠키(Cookie)의 사용</h2>

                    <h3 className="font-semibold text-gray-800 mt-3 mb-1">가. 쿠키란?</h3>
                    <p>
                        쿠키는 웹사이트 방문 시 이용자의 브라우저에 저장되는 작은 텍스트 파일로,
                        사이트 이용 환경을 개선하고 맞춤형 서비스를 제공하는 데 사용됩니다.
                    </p>

                    <h3 className="font-semibold text-gray-800 mt-3 mb-1">나. 사용하는 쿠키 유형</h3>
                    <ul className="list-disc pl-5 mt-2 space-y-1">
                        <li><strong>필수 쿠키:</strong> 웹사이트 기본 기능 작동에 필요한 쿠키</li>
                        <li><strong>분석 쿠키 (Google Analytics):</strong> 방문자 수, 페이지 조회, 유입 경로 등 사이트 이용 통계를 수집하여 서비스 개선에 활용합니다. Google Analytics는 익명화된 데이터를 수집하며, <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="text-green-600 underline">Google 개인정보처리방침</a>이 적용됩니다.</li>
                        <li><strong>광고 쿠키 (Google AdSense):</strong> 이용자의 관심사에 기반한 맞춤형 광고를 제공합니다. Google의 광고 쿠키에 대한 자세한 내용은 <a href="https://policies.google.com/technologies/ads" target="_blank" rel="noopener noreferrer" className="text-green-600 underline">Google 광고 정책</a>을 참고하세요.</li>
                    </ul>

                    <h3 className="font-semibold text-gray-800 mt-3 mb-1">다. 쿠키 거부 방법</h3>
                    <p>
                        이용자는 브라우저 설정을 통해 쿠키 저장을 거부할 수 있습니다.
                        다만, 쿠키를 거부할 경우 사이트 일부 기능의 이용이 제한될 수 있습니다.
                    </p>
                    <ul className="list-disc pl-5 mt-2 space-y-1">
                        <li>Chrome: 설정 → 개인정보 및 보안 → 쿠키 및 기타 사이트 데이터</li>
                        <li>Safari: 환경설정 → 개인 정보 보호</li>
                        <li>Google 맞춤 광고 해제: <a href="https://adssettings.google.com" target="_blank" rel="noopener noreferrer" className="text-green-600 underline">ads.google.com/settings</a></li>
                    </ul>
                </section>

                <section>
                    <h2 className="text-lg font-bold text-gray-900 mb-2">5. 개인정보의 보유 및 이용 기간</h2>
                    <ul className="list-disc pl-5 space-y-1">
                        <li><strong>자동 수집 정보:</strong> 수집일로부터 1년간 보유 후 파기 (Google Analytics 데이터 보유 정책에 따름)</li>
                        <li><strong>문의 정보:</strong> 문의 처리 완료 후 30일 이내 파기</li>
                        <li>관련 법령에 의해 보존이 필요한 경우, 해당 법령이 정한 기간 동안 보관합니다.</li>
                    </ul>
                </section>

                <section>
                    <h2 className="text-lg font-bold text-gray-900 mb-2">6. 개인정보의 제3자 제공</h2>
                    <p>
                        사이트는 이용자의 개인정보를 원칙적으로 제3자에게 제공하지 않습니다.
                        다만, 다음의 경우는 예외로 합니다.
                    </p>
                    <ul className="list-disc pl-5 mt-2 space-y-1">
                        <li>이용자가 사전에 동의한 경우</li>
                        <li>법령에 의해 요구되는 경우</li>
                        <li>서비스 운영에 필요한 최소한의 범위 내에서 위탁하는 경우 (아래 참고)</li>
                    </ul>
                </section>

                <section>
                    <h2 className="text-lg font-bold text-gray-900 mb-2">7. 개인정보 처리 위탁</h2>
                    <p>사이트는 서비스 운영을 위해 다음과 같이 개인정보 처리를 위탁하고 있습니다.</p>
                    <div className="mt-3 overflow-x-auto">
                        <table className="w-full border-collapse text-sm">
                            <thead>
                                <tr className="bg-gray-50">
                                    <th className="border border-gray-200 px-4 py-2 text-left font-semibold">수탁업체</th>
                                    <th className="border border-gray-200 px-4 py-2 text-left font-semibold">위탁 업무</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td className="border border-gray-200 px-4 py-2">Google LLC</td>
                                    <td className="border border-gray-200 px-4 py-2">웹 트래픽 분석 (Google Analytics), 광고 서비스 (Google AdSense)</td>
                                </tr>
                                <tr>
                                    <td className="border border-gray-200 px-4 py-2">Vercel Inc.</td>
                                    <td className="border border-gray-200 px-4 py-2">웹사이트 호스팅 및 CDN 서비스</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </section>

                <section>
                    <h2 className="text-lg font-bold text-gray-900 mb-2">8. 이용자의 권리</h2>
                    <p>이용자는 다음의 권리를 행사할 수 있습니다.</p>
                    <ul className="list-disc pl-5 mt-2 space-y-1">
                        <li><strong>열람권:</strong> 본인의 개인정보 처리 현황을 열람할 수 있습니다.</li>
                        <li><strong>정정·삭제권:</strong> 부정확하거나 불필요한 개인정보의 정정 또는 삭제를 요청할 수 있습니다.</li>
                        <li><strong>처리정지권:</strong> 개인정보 처리의 정지를 요청할 수 있습니다.</li>
                        <li><strong>동의 철회권:</strong> 개인정보 수집·이용에 대한 동의를 철회할 수 있습니다.</li>
                    </ul>
                    <p className="mt-2">
                        위 권리 행사는 이메일(contact@wellnesstodays.com)을 통해 요청하실 수 있으며,
                        접수 후 10일 이내에 처리합니다.
                    </p>
                </section>

                <section>
                    <h2 className="text-lg font-bold text-gray-900 mb-2">9. 개인정보의 안전성 확보 조치</h2>
                    <p>사이트는 개인정보의 안전성 확보를 위해 다음의 조치를 취하고 있습니다.</p>
                    <ul className="list-disc pl-5 mt-2 space-y-1">
                        <li>SSL/TLS 암호화를 통한 데이터 전송 보안</li>
                        <li>개인정보 접근 권한 최소화</li>
                        <li>정기적인 보안 점검 및 업데이트</li>
                    </ul>
                </section>

                <section>
                    <h2 className="text-lg font-bold text-gray-900 mb-2">10. 아동의 개인정보 보호</h2>
                    <p>
                        사이트는 만 14세 미만 아동의 개인정보를 의도적으로 수집하지 않습니다.
                        만 14세 미만 아동의 개인정보가 수집된 사실을 알게 된 경우,
                        해당 정보를 즉시 삭제하겠습니다.
                    </p>
                </section>

                <section>
                    <h2 className="text-lg font-bold text-gray-900 mb-2">11. 개인정보 처리방침의 변경</h2>
                    <p>
                        본 개인정보 처리방침은 법령 변경, 서비스 변경 등의 사유로 수정될 수 있으며,
                        변경 시 사이트를 통해 공지합니다. 변경된 방침은 공지된 시행일부터 적용됩니다.
                    </p>
                </section>

                <section>
                    <h2 className="text-lg font-bold text-gray-900 mb-2">12. 개인정보 보호책임자</h2>
                    <p>개인정보 처리에 관한 문의, 불만, 피해 구제 등은 아래로 연락해 주시기 바랍니다.</p>
                    <div className="mt-3 bg-gray-50 rounded-lg p-4">
                        <ul className="space-y-1">
                            <li><strong>사이트명:</strong> 오늘도 건강</li>
                            <li><strong>URL:</strong> www.wellnesstodays.com</li>
                            <li><strong>이메일:</strong> contact@wellnesstodays.com</li>
                        </ul>
                    </div>
                    <p className="mt-3">
                        기타 개인정보 침해에 대한 신고·상담이 필요한 경우 아래 기관에 문의하실 수 있습니다.
                    </p>
                    <ul className="list-disc pl-5 mt-2 space-y-1">
                        <li>개인정보침해신고센터: <a href="https://privacy.kisa.or.kr" target="_blank" rel="noopener noreferrer" className="text-green-600 underline">privacy.kisa.or.kr</a> (국번없이 118)</li>
                        <li>개인정보분쟁조정위원회: <a href="https://www.kopico.go.kr" target="_blank" rel="noopener noreferrer" className="text-green-600 underline">kopico.go.kr</a> (1833-6972)</li>
                    </ul>
                </section>
            </div>
        </div>
    );
}
