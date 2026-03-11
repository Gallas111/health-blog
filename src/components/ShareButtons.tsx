'use client';

import styles from './ShareButtons.module.css';

interface ShareButtonsProps {
    title: string;
    slug: string;
}

export default function ShareButtons({ title, slug }: ShareButtonsProps) {
    const url = `https://www.wellnesstodays.com/blog/${slug}`;

    const trackShare = (method: string) => {
        if (typeof window !== 'undefined' && window.gtag) {
            window.gtag('event', 'share', {
                method,
                content_type: 'article',
                item_id: slug,
            });
        }
    };

    const shareTwitter = () => {
        trackShare('twitter');
        window.open(
            `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`,
            '_blank', 'width=600,height=400'
        );
    };

    const copyLink = async () => {
        trackShare('copy_link');
        try {
            await navigator.clipboard.writeText(url);
            const btn = document.getElementById('copy-btn');
            if (btn) {
                btn.textContent = '✓ 복사됨!';
                setTimeout(() => { btn.textContent = '🔗 링크 복사'; }, 2000);
            }
        } catch {
            // fallback
            const input = document.createElement('input');
            input.value = url;
            document.body.appendChild(input);
            input.select();
            document.execCommand('copy');
            document.body.removeChild(input);
        }
    };

    const shareKakao = () => {
        trackShare('native_share');
        // Fallback: share via native share API or copy
        if (navigator.share) {
            navigator.share({ title, url });
        } else {
            copyLink();
        }
    };

    return (
        <div className={styles.container}>
            <span className={styles.label}>공유하기</span>
            <div className={styles.buttons}>
                <button onClick={shareTwitter} className={styles.btn} aria-label="Twitter로 공유">
                    <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg>
                </button>
                <button onClick={shareKakao} className={styles.btn} aria-label="공유">
                    <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" /><polyline points="16 6 12 2 8 6" /><line x1="12" y1="2" x2="12" y2="15" /></svg>
                </button>
                <button onClick={copyLink} className={styles.btn} id="copy-btn" aria-label="링크 복사">
                    🔗 링크 복사
                </button>
            </div>
        </div>
    );
}
