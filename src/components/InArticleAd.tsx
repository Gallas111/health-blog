"use client";

import { useEffect } from "react";

interface InArticleAdProps {
    slot: string;
    format?: "auto" | "fluid";
    layout?: string;
}

declare global {
    interface Window {
        adsbygoogle: unknown[];
    }
}

export default function InArticleAd({ slot, format = "fluid", layout = "in-article" }: InArticleAdProps) {
    useEffect(() => {
        try {
            ((window.adsbygoogle = window.adsbygoogle || []) as unknown[]).push({});
        } catch (err) {
            console.error("AdSense error:", err);
        }
    }, []);

    if (!slot) return null;

    return (
        <div style={{ margin: "2rem 0", textAlign: "center", minHeight: "100px" }} aria-label="광고">
            <ins
                className="adsbygoogle"
                style={{ display: "block", textAlign: "center" }}
                data-ad-layout={layout}
                data-ad-format={format}
                data-ad-client="ca-pub-1022869499967960"
                data-ad-slot={slot}
                data-full-width-responsive="true"
            />
        </div>
    );
}
