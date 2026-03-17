import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import styles from './Hero.module.css';

const quickLinks = [
    { href: '/blog/category/symptoms', icon: '🩺', label: '증상별 건강정보' },
    { href: '/blog/category/supplements', icon: '💊', label: '영양제 정보' },
    { href: '/blog/category/home-remedies', icon: '🍵', label: '민간요법·좋은음식' },
    { href: '/blog/category/daily-health', icon: '🏃', label: '생활건강 상식' },
    { href: '/blog/category/pharmacy-guide', icon: '🏥', label: '약국·의약품 상식' },
];

export default function Hero() {
    return (
        <section className={styles.hero}>
            <div className={styles.inner}>
                <div className={styles.badge}>💊 건강, 쉽고 정확하게</div>
                <h1 className={styles.title}>
                    오늘도 건강하게,<br />
                    <span className={styles.gradientText}>믿을 수 있는 건강 정보 가이드</span>
                </h1>
                <p className={styles.subtitle}>
                    증상별 원인과 대처법, 영양제 효능, 민간요법까지.<br className={styles.break} />
                    오늘도 건강이 당신의 건강한 하루를 돕습니다.
                </p>
                <div className={styles.actions}>
                    <Link href="/blog" className={`button button-primary ${styles.cta}`}>
                        건강 정보 보기 <ArrowRight size={18} />
                    </Link>
                    <a href="https://www.yakchatja.com" target="_blank" rel="noopener noreferrer" className="button button-outline">
                        가까운 약국 찾기
                    </a>
                </div>
                <nav className={styles.quickLinks} aria-label="카테고리 바로가기">
                    {quickLinks.map(({ href, icon, label }) => (
                        <Link key={href} href={href} className={styles.quickLink}>
                            <span className={styles.quickLinkIcon}>{icon}</span>
                            {label}
                        </Link>
                    ))}
                </nav>
            </div>
        </section>
    );
}
