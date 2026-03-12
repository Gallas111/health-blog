'use client';

import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';

interface SwipeNavigationProps {
    prevSlug?: string;
    nextSlug?: string;
}

export default function SwipeNavigation({ prevSlug, nextSlug }: SwipeNavigationProps) {
    const router = useRouter();
    const touchStart = useRef<{ x: number; y: number } | null>(null);

    useEffect(() => {
        const handleTouchStart = (e: TouchEvent) => {
            touchStart.current = {
                x: e.touches[0].clientX,
                y: e.touches[0].clientY,
            };
        };

        const handleTouchEnd = (e: TouchEvent) => {
            if (!touchStart.current) return;

            const deltaX = e.changedTouches[0].clientX - touchStart.current.x;
            const deltaY = e.changedTouches[0].clientY - touchStart.current.y;

            // Only trigger if horizontal swipe is dominant and exceeds threshold
            if (Math.abs(deltaX) < 80 || Math.abs(deltaY) > Math.abs(deltaX) * 0.5) {
                touchStart.current = null;
                return;
            }

            if (deltaX > 0 && prevSlug) {
                // Swipe right → previous post
                router.push(`/blog/${prevSlug}`);
            } else if (deltaX < 0 && nextSlug) {
                // Swipe left → next post
                router.push(`/blog/${nextSlug}`);
            }

            touchStart.current = null;
        };

        document.addEventListener('touchstart', handleTouchStart, { passive: true });
        document.addEventListener('touchend', handleTouchEnd, { passive: true });

        return () => {
            document.removeEventListener('touchstart', handleTouchStart);
            document.removeEventListener('touchend', handleTouchEnd);
        };
    }, [prevSlug, nextSlug, router]);

    return null;
}
