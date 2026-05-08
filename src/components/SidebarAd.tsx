"use client";

import { useEffect } from "react";

interface SidebarAdProps {
    slot: string;
}

export default function SidebarAd({ slot }: SidebarAdProps) {
    useEffect(() => {
        try {
            ((window.adsbygoogle = window.adsbygoogle || []) as unknown[]).push({});
        } catch (err) {
            console.error("AdSense error:", err);
        }
    }, []);

    if (!slot) return null;

    return (
        <div
            style={{
                position: "sticky",
                top: "5rem",
                marginTop: "2rem",
                minHeight: "600px",
            }}
            aria-label="광고"
        >
            <ins
                className="adsbygoogle"
                style={{ display: "block", width: "100%" }}
                data-ad-client="ca-pub-1022869499967960"
                data-ad-slot={slot}
                data-ad-format="auto"
                data-full-width-responsive="true"
            />
        </div>
    );
}
