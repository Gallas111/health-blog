'use client';

import { usePathname, useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useRef } from 'react';

function RouteChangeTrackerInner() {
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const isFirstRender = useRef(true);

    useEffect(() => {
        // Skip the first render — initial page load is already tracked by GoogleAnalytics
        if (isFirstRender.current) {
            isFirstRender.current = false;
            return;
        }

        const url = pathname + (searchParams?.toString() ? `?${searchParams.toString()}` : '');

        if (typeof window.gtag === 'function') {
            window.gtag('event', 'page_view', {
                page_path: url,
                page_location: `${window.location.origin}${url}`,
                page_title: document.title,
            });
        }
    }, [pathname, searchParams]);

    return null;
}

export default function RouteChangeTracker() {
    return (
        <Suspense fallback={null}>
            <RouteChangeTrackerInner />
        </Suspense>
    );
}
