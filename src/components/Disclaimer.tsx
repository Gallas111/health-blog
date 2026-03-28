export default function Disclaimer() {
    return (
        <div className="my-8 p-5 bg-amber-50 dark:bg-amber-900/10 rounded-xl border border-amber-200 dark:border-amber-800/30">
            <div className="flex flex-col gap-3">
                <div className="flex items-start gap-3">
                    <span className="text-xl flex-shrink-0">ℹ️</span>
                    <div className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                        <strong>이 글은 생활건강 참고 정보입니다</strong>
                        <p className="mt-1">
                            공공 의료 자료와 학술 문헌을 참고하여 작성했으며, 의학적 진단이나 처방을 대체하지 않습니다.
                        </p>
                    </div>
                </div>
                <div className="flex items-start gap-3">
                    <span className="text-xl flex-shrink-0">🏥</span>
                    <div className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                        <strong>이런 경우 의료 전문가와 상담하세요</strong>
                        <ul className="mt-1 list-disc list-inside space-y-0.5">
                            <li>증상이 2주 이상 지속되거나 악화될 때</li>
                            <li>일상생활에 지장이 있을 정도로 불편할 때</li>
                            <li>처방약을 복용 중이거나 기저질환이 있을 때</li>
                        </ul>
                    </div>
                </div>
                <div className="flex items-start gap-3">
                    <span className="text-xl flex-shrink-0">📢</span>
                    <div className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                        <strong>광고 공시</strong>
                        <p className="mt-1">
                            이 사이트는 Google AdSense를 통해 광고를 게재하며, 광고 수익으로 운영됩니다.
                            광고는 콘텐츠 내용과 무관하게 자동 배치되며, 편집팀의 콘텐츠 작성에 영향을 주지 않습니다.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
