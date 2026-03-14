'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';

export default function ScrollTracker() {
    const firedRef = useRef<Set<number>>(new Set());
    const pathname = usePathname();

    // Reset fired thresholds when the route changes
    useEffect(() => {
        firedRef.current.clear();
    }, [pathname]);

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
    }, [pathname]);

    return null;
}
