import Script from "next/script";

interface GoogleAdSenseProps {
    pId: string;
}

export default function GoogleAdSense({ pId }: GoogleAdSenseProps) {
    if (!pId) return null;

    return (
        <Script
            async
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${pId}`}
            crossOrigin="anonymous"
            // lazyOnload (2026-07-14 CWV fix): afterInteractive가 <head>에
            // adsbygoogle preload를 심어 slow-4G에서 LCP 리소스와 경쟁했음.
            // lazyOnload로 preload 제거+window load 후 로드 → 모바일 FCP/LCP 개선.
            strategy="lazyOnload"
        />
    );
}
