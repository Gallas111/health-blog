import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, Shield, FileCheck, RefreshCw, AlertTriangle, Search, PenLine, CheckCircle, Eye, Megaphone, Mail } from 'lucide-react';

export const metadata: Metadata = {
    title: '편집·출처 정책',
    description: '오늘도 건강의 사실검증 절차, 1차 출처 인용 원칙, 수정·정정 정책, 의학적 조언 아님 면책 기준을 투명하게 공개합니다.',
    alternates: {
        canonical: 'https://www.wellnesstodays.com/editorial-policy',
    },
};

const policyJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: '편집·출처 정책 — 오늘도 건강',
    url: 'https://www.wellnesstodays.com/editorial-policy',
    description:
        '오늘도 건강의 사실검증 절차, 1차 출처 인용 원칙, 수정·정정 정책, 의학적 조언 아님 면책 기준.',
    inLanguage: 'ko',
    isPartOf: {
        '@type': 'WebSite',
        name: '오늘도 건강',
        url: 'https://www.wellnesstodays.com',
    },
    about: { '@id': 'https://www.wellnesstodays.com/#organization' },
    dateModified: '2026-07-02',
};

export default function EditorialPolicyPage() {
    return (
        <div className="container mx-auto px-4 py-12 max-w-4xl">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(policyJsonLd) }}
            />

            {/* Hero */}
            <div className="text-center mb-14">
                <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-emerald-700 to-teal-600 dark:from-emerald-400 dark:to-teal-300 leading-tight py-2">
                    편집·출처 정책
                </h1>
                <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto break-keep">
                    오늘도 건강이 콘텐츠를 만들고 검증하는 기준을 투명하게 공개합니다.<br />
                    모든 글은 이 정책에 따라 작성·검수·수정됩니다.
                </p>
            </div>

            {/* Transparency Notice */}
            <div className="mb-14 p-6 bg-amber-50 dark:bg-amber-900/10 rounded-2xl border border-amber-200 dark:border-amber-800/30">
                <div className="flex items-start gap-3">
                    <AlertTriangle className="text-amber-600 dark:text-amber-400 flex-shrink-0 mt-1" size={22} />
                    <div className="text-sm md:text-base text-gray-700 dark:text-gray-300 leading-relaxed break-keep">
                        <strong className="block mb-1 text-gray-900 dark:text-white">투명성 고지</strong>
                        오늘도 건강 편집팀은 의사·약사·한의사 등 <strong>면허를 보유한 의료 전문가가 아닙니다.</strong>{' '}
                        저희는 질병관리청, 식품의약품안전처, NIH, WHO 등 공신력 있는 기관의 <strong>1차 출처 공개 자료를 근거로 정리</strong>하는
                        건강정보 편집팀이며, 없는 자격이나 임상 경험을 주장하지 않습니다.
                        이 사이트의 모든 내용은 생활건강 참고 정보이며 의학적 진단·처방을 대체하지 않습니다.
                    </div>
                </div>
            </div>

            {/* Source Principles */}
            <section className="mb-14">
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-3">
                    <span className="w-10 h-10 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg flex items-center justify-center text-emerald-600 flex-shrink-0">
                        <FileCheck size={20} />
                    </span>
                    출처 원칙 — 1차 출처만 인용합니다
                </h2>
                <div className="bg-white dark:bg-gray-900 p-6 md:p-8 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm">
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-6 break-keep">
                        핵심 건강 정보(효능, 용법·용량, 부작용, 대처 기준 등)는 아래 우선순위에 따라
                        공신력 있는 1차 출처를 확인한 뒤에만 기재합니다.
                    </p>
                    <ol className="space-y-4">
                        <li className="flex items-start gap-3">
                            <span className="w-7 h-7 bg-emerald-600 text-white rounded-full flex items-center justify-center flex-shrink-0 font-bold text-sm mt-0.5">1</span>
                            <div className="text-gray-700 dark:text-gray-300 leading-relaxed break-keep">
                                <strong>국내 공공 의료 기관</strong> — 질병관리청, 식품의약품안전처(의약품 허가사항), 국립보건연구원, 보건복지부
                            </div>
                        </li>
                        <li className="flex items-start gap-3">
                            <span className="w-7 h-7 bg-emerald-600 text-white rounded-full flex items-center justify-center flex-shrink-0 font-bold text-sm mt-0.5">2</span>
                            <div className="text-gray-700 dark:text-gray-300 leading-relaxed break-keep">
                                <strong>국제 보건 기구·기관</strong> — WHO, NIH(ODS 포함), CDC, Mayo Clinic 등 공개 의료 자료
                            </div>
                        </li>
                        <li className="flex items-start gap-3">
                            <span className="w-7 h-7 bg-emerald-600 text-white rounded-full flex items-center justify-center flex-shrink-0 font-bold text-sm mt-0.5">3</span>
                            <div className="text-gray-700 dark:text-gray-300 leading-relaxed break-keep">
                                <strong>학술 문헌</strong> — PubMed 등재 문헌, 대한의학회지 등 국내외 학회지의 체계적 리뷰·메타분석을 우선
                            </div>
                        </li>
                    </ol>
                    <div className="mt-6 pt-6 border-t border-gray-100 dark:border-gray-800">
                        <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed break-keep">
                            다음은 출처로 사용하지 않습니다: 개인 블로그·커뮤니티 글, 검증되지 않은 단일 연구,
                            제조사·판매자의 광고성 자료, 출처가 불분명한 2차 인용.
                        </p>
                    </div>
                </div>
            </section>

            {/* Fact-check Process */}
            <section className="mb-14">
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-3">
                    <span className="w-10 h-10 bg-teal-100 dark:bg-teal-900/30 rounded-lg flex items-center justify-center text-teal-600 flex-shrink-0">
                        <Shield size={20} />
                    </span>
                    사실검증 절차
                </h2>
                <div className="grid md:grid-cols-2 gap-6">
                    <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm">
                        <div className="flex items-center gap-3 mb-3">
                            <Search className="text-emerald-600" size={20} />
                            <h3 className="text-lg font-bold">1. 자료 조사</h3>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed break-keep">
                            주제별로 위 출처 원칙에 맞는 1차 자료를 수집합니다. 상충하는 정보가 있으면
                            더 상위 출처(공공기관·체계적 리뷰)를 따릅니다.
                        </p>
                    </div>
                    <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm">
                        <div className="flex items-center gap-3 mb-3">
                            <PenLine className="text-teal-600" size={20} />
                            <h3 className="text-lg font-bold">2. 초안 작성</h3>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed break-keep">
                            전문 용어를 일반인이 이해할 수 있는 언어로 풀어 작성합니다. 과장·공포 조장 표현,
                            효과 보장 표현은 사용하지 않습니다.
                        </p>
                    </div>
                    <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm">
                        <div className="flex items-center gap-3 mb-3">
                            <CheckCircle className="text-cyan-600" size={20} />
                            <h3 className="text-lg font-bold">3. 교차 확인</h3>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed break-keep">
                            게시 전 숫자·용량·용법은 식약처 허가사항 등 원문과 대조하고, 핵심 주장은
                            서로 다른 출처 2곳 이상에서 교차 확인합니다.
                        </p>
                    </div>
                    <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm">
                        <div className="flex items-center gap-3 mb-3">
                            <Eye className="text-emerald-600" size={20} />
                            <h3 className="text-lg font-bold">4. 게시 후 모니터링</h3>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed break-keep">
                            게시 후에도 가이드라인 변경, 독자 제보를 반영해 내용을 다시 확인하고 필요하면 수정합니다.
                        </p>
                    </div>
                </div>
            </section>

            {/* Correction Policy */}
            <section className="mb-14">
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-3">
                    <span className="w-10 h-10 bg-cyan-100 dark:bg-cyan-900/30 rounded-lg flex items-center justify-center text-cyan-600 flex-shrink-0">
                        <RefreshCw size={20} />
                    </span>
                    수정·정정 정책
                </h2>
                <div className="bg-white dark:bg-gray-900 p-6 md:p-8 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm">
                    <ul className="space-y-3 text-gray-700 dark:text-gray-300 leading-relaxed">
                        <li className="flex items-start gap-2 break-keep">
                            <span className="text-emerald-500 mt-1 flex-shrink-0">&#8226;</span>
                            <span><strong>사실 오류</strong>가 확인되면 즉시 본문을 정정합니다. 독자 제보로 발견된 오류도 동일하게 처리합니다.</span>
                        </li>
                        <li className="flex items-start gap-2 break-keep">
                            <span className="text-emerald-500 mt-1 flex-shrink-0">&#8226;</span>
                            <span><strong>의료 가이드라인이 변경</strong>되면(권장 용량, 대처 기준 등) 관련 글을 찾아 갱신합니다.</span>
                        </li>
                        <li className="flex items-start gap-2 break-keep">
                            <span className="text-emerald-500 mt-1 flex-shrink-0">&#8226;</span>
                            <span>모든 글에 <strong>작성일을 표기</strong>해 정보의 시점을 알 수 있도록 하며, 내용이 크게 바뀐 글은 수정 시점을 반영합니다.</span>
                        </li>
                        <li className="flex items-start gap-2 break-keep">
                            <span className="text-emerald-500 mt-1 flex-shrink-0">&#8226;</span>
                            <span>단순 오탈자 수정은 별도 고지 없이 진행하지만, <strong>결론이 달라지는 수정</strong>은 본문에서 알 수 있게 반영합니다.</span>
                        </li>
                    </ul>
                </div>
            </section>

            {/* Medical Disclaimer */}
            <section className="mb-14">
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-3">
                    <span className="w-10 h-10 bg-amber-100 dark:bg-amber-900/30 rounded-lg flex items-center justify-center text-amber-600 flex-shrink-0">
                        <AlertTriangle size={20} />
                    </span>
                    의학적 조언이 아닙니다
                </h2>
                <div className="bg-amber-50 dark:bg-amber-900/10 p-6 md:p-8 rounded-2xl border border-amber-200 dark:border-amber-800/30">
                    <ul className="space-y-3 text-gray-700 dark:text-gray-300 leading-relaxed">
                        <li className="flex items-start gap-2 break-keep">
                            <span className="text-amber-500 mt-1 flex-shrink-0">&#8226;</span>
                            <span>이 사이트의 콘텐츠는 <strong>생활건강 참고 정보</strong>이며, 의학적 진단·치료·처방을 대체하지 않습니다.</span>
                        </li>
                        <li className="flex items-start gap-2 break-keep">
                            <span className="text-amber-500 mt-1 flex-shrink-0">&#8226;</span>
                            <span><strong>진단과 치료는 반드시 의료기관에서</strong> 받으세요. 여기서 읽은 내용만으로 약 복용을 시작·중단하거나 치료를 미루지 마세요.</span>
                        </li>
                        <li className="flex items-start gap-2 break-keep">
                            <span className="text-amber-500 mt-1 flex-shrink-0">&#8226;</span>
                            <span>증상이 심하거나 갑자기 악화될 때, 호흡곤란·의식저하 등 <strong>응급 징후가 있을 때는 119</strong> 또는 응급실을 이용하세요.</span>
                        </li>
                        <li className="flex items-start gap-2 break-keep">
                            <span className="text-amber-500 mt-1 flex-shrink-0">&#8226;</span>
                            <span>임신·수유 중이거나 기저질환이 있는 경우, 처방약을 복용 중인 경우에는 어떤 정보든 <strong>의사·약사와 먼저 상담</strong>하세요.</span>
                        </li>
                    </ul>
                </div>
            </section>

            {/* Ads Transparency */}
            <section className="mb-14">
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-3">
                    <span className="w-10 h-10 bg-teal-100 dark:bg-teal-900/30 rounded-lg flex items-center justify-center text-teal-600 flex-shrink-0">
                        <Megaphone size={20} />
                    </span>
                    광고·수익 투명성
                </h2>
                <div className="bg-white dark:bg-gray-900 p-6 md:p-8 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm">
                    <ul className="space-y-3 text-gray-700 dark:text-gray-300 leading-relaxed">
                        <li className="flex items-start gap-2 break-keep">
                            <span className="text-emerald-500 mt-1 flex-shrink-0">&#8226;</span>
                            <span>이 사이트는 운영비 마련을 위해 <strong>Google 애드센스 광고</strong>를 게재합니다.</span>
                        </li>
                        <li className="flex items-start gap-2 break-keep">
                            <span className="text-emerald-500 mt-1 flex-shrink-0">&#8226;</span>
                            <span>광고주는 콘텐츠의 주제 선정, 내용, 결론에 <strong>어떠한 영향도 주지 않습니다.</strong></span>
                        </li>
                        <li className="flex items-start gap-2 break-keep">
                            <span className="text-emerald-500 mt-1 flex-shrink-0">&#8226;</span>
                            <span>특정 제품·브랜드를 추천하지 않으며, 본문에 <strong>제휴(어필리에이트) 링크를 넣지 않습니다.</strong></span>
                        </li>
                    </ul>
                </div>
            </section>

            {/* Contact */}
            <section className="mb-14">
                <div className="bg-gray-50 dark:bg-gray-800/50 rounded-2xl p-6 md:p-8 text-center">
                    <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900/30 rounded-xl flex items-center justify-center mx-auto mb-4 text-emerald-600 dark:text-emerald-400">
                        <Mail size={24} />
                    </div>
                    <h2 className="text-xl font-bold mb-3 text-gray-900 dark:text-white">오류 제보·정정 요청</h2>
                    <p className="text-gray-600 dark:text-gray-400 leading-relaxed break-keep mb-4">
                        내용 오류를 발견하셨거나 정정을 요청하고 싶다면 언제든 알려주세요.<br />
                        확인 후 이 정책에 따라 처리합니다.
                    </p>
                    <a
                        href="mailto:contact@wellnesstodays.com"
                        className="text-emerald-600 hover:underline font-medium"
                    >
                        contact@wellnesstodays.com
                    </a>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-3">
                        또는 <Link href="/contact" className="text-emerald-600 hover:underline">문의 페이지</Link>를 이용하세요.
                    </p>
                </div>
            </section>

            {/* CTA */}
            <div className="bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 rounded-3xl p-8 md:p-10 text-center border border-emerald-100 dark:border-emerald-800/30">
                <h2 className="text-xl md:text-2xl font-bold mb-4 text-gray-900 dark:text-white">함께 보면 좋은 페이지</h2>
                <div className="flex flex-wrap justify-center gap-3">
                    <Link
                        href="/about"
                        className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-full font-bold transition-all shadow-lg hover:shadow-xl"
                    >
                        운영·편집팀 소개 <ArrowRight size={16} />
                    </Link>
                    <Link
                        href="/about#team"
                        className="inline-flex items-center gap-2 px-6 py-3 bg-white dark:bg-gray-900 border border-emerald-200 dark:border-emerald-800/40 text-emerald-700 dark:text-emerald-300 rounded-full font-bold transition-all hover:bg-emerald-50 dark:hover:bg-emerald-900/20"
                    >
                        편집팀은 누구인가요?
                    </Link>
                </div>
            </div>
        </div>
    );
}
