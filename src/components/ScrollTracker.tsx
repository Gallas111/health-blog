'use client';

import { useEffect, useRef } from 'react';

export default function ScrollTracker() {
    const firedRef = useRef<Set<number>>(new Set());

    useEffect(() => {
        const thresholds = [25, 50, 75, 90];

        const handleScroll = () => {
            const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
            if (scrollHeight <= 0) return;

            const scrollPercent = Math.round((window.scrollY / scrollHeight) * 100);

            for (const threshold of thresholds) {
                if (scrollPercent >= threshold && !firedRef.current.has(threshold)) {
                    firedRef.current.add(threshold);
                    if (typeof window.gtag === 'function') {
                        window.gtag('event', 'scroll_depth', {
                            percent_scrolled: threshold,
                            page_path: window.location.pathname,
                        });
                    }
                }
            }
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return null;
}
