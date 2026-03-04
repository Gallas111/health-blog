import type { Metadata } from 'next';
import { Mail, MapPin } from 'lucide-react';

export const metadata: Metadata = {
    title: '문의하기 | 오늘도 건강',
    description: '오늘도 건강 팀에 문의하세요.',
};

export default function ContactPage() {
    return (
        <div className="container mx-auto px-4 py-12 max-w-4xl">
            <div className="text-center mb-16">
                <h1 className="text-4xl md:text-5xl font-bold mb-6">문의하기</h1>
                <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                    질문, 제안, 제휴 문의가 있으시면 언제든지 연락해 주세요.
                </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 max-w-2xl mx-auto">
                <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col items-center text-center hover:translate-y-[-4px] transition-transform">
                    <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center text-emerald-600 dark:text-emerald-400 mb-4">
                        <Mail size={24} />
                    </div>
                    <h2 className="text-xl font-bold mb-2">이메일</h2>
                    <p className="text-gray-500 dark:text-gray-400 mb-4">
                        일반 문의 및 제휴
                    </p>
                    <a href="mailto:contact@wellnesstodays.com" className="text-emerald-600 dark:text-emerald-400 font-medium hover:underline">
                        contact@wellnesstodays.com
                    </a>
                </div>

                <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col items-center text-center hover:translate-y-[-4px] transition-transform">
                    <div className="w-12 h-12 bg-teal-100 dark:bg-teal-900/30 rounded-full flex items-center justify-center text-teal-600 dark:text-teal-400 mb-4">
                        <MapPin size={24} />
                    </div>
                    <h2 className="text-xl font-bold mb-2">위치</h2>
                    <p className="text-gray-500 dark:text-gray-400 mb-4">
                        소재지
                    </p>
                    <span className="font-medium text-gray-900 dark:text-gray-100">
                        대한민국 서울
                    </span>
                </div>
            </div>
        </div>
    );
}
