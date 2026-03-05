export default function PharmacyBannerCompact() {
    return (
        <div className="my-4 px-4 py-3 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl border border-emerald-200 dark:border-emerald-800/30 flex items-center gap-3 flex-wrap">
            <span className="text-lg">📍</span>
            <span className="text-sm text-gray-700 dark:text-gray-300">
                증상이 지속되면?
            </span>
            <a
                href="https://www.yakchatja.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-1 w-full sm:w-auto px-4 py-2.5 sm:py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-full text-sm font-bold transition-all hover:shadow-md"
            >
                약국찾자에서 가까운 약국 찾기 →
            </a>
        </div>
    );
}
