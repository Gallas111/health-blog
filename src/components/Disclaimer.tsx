export default function Disclaimer() {
    return (
        <div className="my-8 p-5 bg-amber-50 dark:bg-amber-900/10 rounded-xl border border-amber-200 dark:border-amber-800/30">
            <div className="flex items-start gap-3">
                <span className="text-xl flex-shrink-0">⚠️</span>
                <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                    <strong>면책조항:</strong> 이 글은 일반적인 건강 정보 제공 목적이며, 의학적 조언을 대체하지 않습니다.
                    증상이 지속되거나 심각한 경우 반드시 의료 전문가와 상담하세요.
                </p>
            </div>
        </div>
    );
}
