import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, Heart, BookOpen, Shield, FileCheck, RefreshCw, AlertTriangle } from 'lucide-react';

export const metadata: Metadata = {
    title: '소개 및 편집 정책 | 오늘도 건강',
    description: '오늘도 건강의 편집 원칙, 출처 정책, 업데이트 기준을 안내합니다. 공공 의료 자료 기반의 생활건강 정보 사이트입니다.',
};

export default function AboutPage() {
    return (
        <div className="container mx-auto px-4 py-12 max-w-4xl">
            {/* Hero Section */}
            <div className="text-center mb-16">
                <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-emerald-700 to-teal-600 dark:from-emerald-400 dark:to-teal-300 leading-tight py-2">
                    건강한 하루의<br className="md:hidden" /> 시작, 오늘도 건강
                </h1>
                <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto break-keep">
                    복잡한 건강 정보를 누구나 쉽게 이해하고,<br />
                    일상에서 바로 실천할 수 있도록 돕는 건강 가이드입니다.
                </p>
            </div>

            {/* Mission Section */}
            <div className="grid md:grid-cols-2 gap-12 items-start mb-20">
                <div className="space-y-6">
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white">우리의 미션</h2>
                    <div className="space-y-4 text-lg text-gray-700 dark:text-gray-300 leading-relaxed break-keep">
                        <p>
                            인터넷에 건강 정보는 넘쳐나지만, 정작 <strong>"내 증상에 어떻게 대처해야 하지?"</strong> 라는 질문에 대한 명확한 답은 찾기 어렵습니다.
                        </p>
                        <p>
                            오늘도 건강은 근거 없는 건강 속설을 걸러내고, 과학적으로 검증된 <strong>실용적인 건강 정보</strong>만을 제공합니다. 증상 대처법부터 영양제 선택까지, 오늘 당장 도움이 되는 가이드를 만듭니다.
                        </p>
                    </div>
                </div>

                <div className="bg-white dark:bg-gray-900 p-8 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm">
                    <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                        <Heart className="text-emerald-600" />
                        주요 다루는 주제
                    </h3>
                    <ul className="space-y-4">
                        <li className="flex items-start gap-3">
                            <span className="text-emerald-500 mt-1">✓</span>
                            <span className="text-gray-700 dark:text-gray-300"><strong>증상별 건강정보</strong> — 두통, 위염, 감기 등 원인과 대처법</span>
                        </li>
                        <li className="flex items-start gap-3">
                            <span className="text-emerald-500 mt-1">✓</span>
                            <span className="text-gray-700 dark:text-gray-300"><strong>민간요법·좋은음식</strong> — 검증된 자연 요법과 식이 정보</span>
                        </li>
                        <li className="flex items-start gap-3">
                            <span className="text-emerald-500 mt-1">✓</span>
                            <span className="text-gray-700 dark:text-gray-300"><strong>영양제 정보</strong> — 효능, 복용법, 부작용 비교</span>
                        </li>
                        <li className="flex items-start gap-3">
                            <span className="text-emerald-500 mt-1">✓</span>
                            <span className="text-gray-700 dark:text-gray-300"><strong>약국·의약품 상식</strong> — OTC 약 정보와 올바른 복용법</span>
                        </li>
                    </ul>
                </div>
            </div>

            {/* Values Grid */}
            <div className="grid md:grid-cols-3 gap-8 mb-20">
                <div className="bg-gray-50 dark:bg-gray-800/50 p-6 rounded-2xl border border-gray-100 dark:border-gray-700">
                    <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900/30 rounded-xl flex items-center justify-center mb-4 text-emerald-600 dark:text-emerald-400">
                        <Shield size={24} />
                    </div>
                    <h3 className="text-lg font-bold mb-2">신뢰할 수 있는 정보</h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">근거 없는 건강 속설을 걸러내고, 과학적으로 검증된 정보만을 제공합니다.</p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-800/50 p-6 rounded-2xl border border-gray-100 dark:border-gray-700">
                    <div className="w-12 h-12 bg-teal-100 dark:bg-teal-900/30 rounded-xl flex items-center justify-center mb-4 text-teal-600 dark:text-teal-400">
                        <ArrowRight size={24} />
                    </div>
                    <h3 className="text-lg font-bold mb-2">실용적인 가이드</h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">이론보다는 오늘 당장 실천할 수 있는 구체적인 건강 관리법을 제공합니다.</p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-800/50 p-6 rounded-2xl border border-gray-100 dark:border-gray-700">
                    <div className="w-12 h-12 bg-cyan-100 dark:bg-cyan-900/30 rounded-xl flex items-center justify-center mb-4 text-cyan-600 dark:text-cyan-400">
                        <BookOpen size={24} />
                    </div>
                    <h3 className="text-lg font-bold mb-2">쉬운 설명</h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">전문 용어 없이 누구나 이해할 수 있는 쉬운 언어로 건강 정보를 전달합니다.</p>
                </div>
            </div>

            {/* Editorial Policy Section */}
            <div id="editorial-policy" className="mb-20 scroll-mt-24">
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">편집 원칙 및 콘텐츠 정책</h2>

                <div className="grid md:grid-cols-2 gap-6 mb-8">
                    <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg flex items-center justify-center text-emerald-600">
                                <FileCheck size={20} />
                            </div>
                            <h3 className="text-lg font-bold">출처 및 참고 기준</h3>
                        </div>
                        <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                            <li className="flex items-start gap-2"><span className="text-emerald-500 mt-0.5 flex-shrink-0">&#8226;</span>질병관리청, 식품의약품안전처 등 국내 공공 의료 기관 자료</li>
                            <li className="flex items-start gap-2"><span className="text-emerald-500 mt-0.5 flex-shrink-0">&#8226;</span>WHO, NIH, Mayo Clinic 등 국제 의료 기관 공개 자료</li>
                            <li className="flex items-start gap-2"><span className="text-emerald-500 mt-0.5 flex-shrink-0">&#8226;</span>PubMed 등재 학술 문헌 및 체계적 리뷰</li>
                            <li className="flex items-start gap-2"><span className="text-emerald-500 mt-0.5 flex-shrink-0">&#8226;</span>단일 연구나 검증되지 않은 주장은 기재하지 않습니다</li>
                        </ul>
                    </div>

                    <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 bg-teal-100 dark:bg-teal-900/30 rounded-lg flex items-center justify-center text-teal-600">
                                <Shield size={20} />
                            </div>
                            <h3 className="text-lg font-bold">편집 원칙</h3>
                        </div>
                        <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                            <li className="flex items-start gap-2"><span className="text-emerald-500 mt-0.5 flex-shrink-0">&#8226;</span>생활 관리 가능한 내용과 의료 상담이 필요한 상황을 구분합니다</li>
                            <li className="flex items-start gap-2"><span className="text-emerald-500 mt-0.5 flex-shrink-0">&#8226;</span>자가 진단을 부추기거나 불안을 유발하는 표현을 사용하지 않습니다</li>
                            <li className="flex items-start gap-2"><span className="text-emerald-500 mt-0.5 flex-shrink-0">&#8226;</span>없는 의료 자격이나 임상 경험을 주장하지 않습니다</li>
                            <li className="flex items-start gap-2"><span className="text-emerald-500 mt-0.5 flex-shrink-0">&#8226;</span>특정 제품이나 브랜드를 추천하지 않습니다</li>
                        </ul>
                    </div>

                    <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 bg-cyan-100 dark:bg-cyan-900/30 rounded-lg flex items-center justify-center text-cyan-600">
                                <RefreshCw size={20} />
                            </div>
                            <h3 className="text-lg font-bold">업데이트 정책</h3>
                        </div>
                        <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                            <li className="flex items-start gap-2"><span className="text-emerald-500 mt-0.5 flex-shrink-0">&#8226;</span>주요 의료 가이드라인이 변경되면 관련 글을 수정합니다</li>
                            <li className="flex items-start gap-2"><span className="text-emerald-500 mt-0.5 flex-shrink-0">&#8226;</span>오류가 발견되면 확인 후 즉시 정정합니다</li>
                            <li className="flex items-start gap-2"><span className="text-emerald-500 mt-0.5 flex-shrink-0">&#8226;</span>각 글의 작성일을 표기하여 정보의 시점을 알 수 있도록 합니다</li>
                        </ul>
                    </div>

                    <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 bg-amber-100 dark:bg-amber-900/30 rounded-lg flex items-center justify-center text-amber-600">
                                <AlertTriangle size={20} />
                            </div>
                            <h3 className="text-lg font-bold">이 사이트가 아닌 것</h3>
                        </div>
                        <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                            <li className="flex items-start gap-2"><span className="text-amber-500 mt-0.5 flex-shrink-0">&#8226;</span>의료 기관이 아닙니다 — 진단이나 처방을 하지 않습니다</li>
                            <li className="flex items-start gap-2"><span className="text-amber-500 mt-0.5 flex-shrink-0">&#8226;</span>의사 감수를 거친 의학 사이트가 아닙니다</li>
                            <li className="flex items-start gap-2"><span className="text-amber-500 mt-0.5 flex-shrink-0">&#8226;</span>여기서 읽은 내용으로 스스로 진단하거나 치료를 결정하지 마세요</li>
                            <li className="flex items-start gap-2"><span className="text-amber-500 mt-0.5 flex-shrink-0">&#8226;</span>증상이 걱정된다면 가까운 의료기관이나 약국을 방문하세요</li>
                        </ul>
                    </div>
                </div>

                <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-5 text-center">
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        오류 제보, 내용 정정 요청, 기타 문의는 <a href="mailto:contact@wellnesstodays.com" className="text-emerald-600 hover:underline font-medium">contact@wellnesstodays.com</a>으로 보내주세요.
                    </p>
                </div>
            </div>

            {/* CTA */}
            <div className="bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 rounded-3xl p-10 text-center border border-emerald-100 dark:border-emerald-800/30">
                <h2 className="text-2xl md:text-3xl font-bold mb-4 text-gray-900 dark:text-white">오늘부터 건강하게</h2>
                <p className="text-gray-600 dark:text-gray-300 mb-8 max-w-lg mx-auto">
                    지금 바로 건강 정보를 확인하고, 당신의 건강한 하루를 시작하세요.
                </p>
                <Link
                    href="/blog"
                    className="inline-flex items-center gap-2 px-8 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-full font-bold transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                >
                    건강 정보 보기 <ArrowRight size={18} />
                </Link>
            </div>
        </div>
    );
}
