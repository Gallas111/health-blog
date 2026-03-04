import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Heart, BookOpen, Shield } from 'lucide-react';

export const metadata: Metadata = {
    title: '소개 | 오늘도 건강',
    description: '오늘도 건강은 증상별 건강정보, 영양제 효능, 민간요법, 생활건강 상식을 쉽고 정확하게 전달하는 건강 정보 블로그입니다.',
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
