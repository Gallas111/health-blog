import Link from 'next/link';

export default function PharmacyBanner() {
    return (
        <div className="my-8 p-6 bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 rounded-2xl border border-emerald-200 dark:border-emerald-800/30">
            <div className="flex items-start gap-4">
                <span className="text-3xl flex-shrink-0">📍</span>
                <div className="flex-1">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">
                        가까운 약국 찾기
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 text-sm mb-3">
                        증상이 지속되면 가까운 약국을 방문하세요. 현재 위치 기반으로 영업 중인 약국을 바로 찾을 수 있습니다.
                    </p>
                    <a
                        href="https://www.yakchatja.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-full text-sm font-bold transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                    >
                        약국찾자에서 찾기 →
                    </a>
                </div>
            </div>
        </div>
    );
}
