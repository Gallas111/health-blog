import Link from 'next/link';
import styles from './Footer.module.css';

export default function Footer() {
    return (
        <footer className={styles.footer}>
            <div className={`container`}>
                <div className={styles.grid}>
                    {/* Brand Column */}
                    <div className={styles.brand}>
                        <Link href="/" className={styles.logo}>
                            <span className={styles.logoAccent}>오늘도</span>건강
                        </Link>
                        <p className={styles.brandDesc}>
                            증상별 건강정보, 영양제 효능, 민간요법, 생활건강 상식까지.
                            믿을 수 있는 건강 정보를 쉽고 정확하게 전달합니다.
                        </p>
                        <div className={styles.social}>
                            <a href="https://www.yakchatja.com" target="_blank" rel="noopener noreferrer" className={styles.socialLink} aria-label="약국찾자">
                                <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" /></svg>
                            </a>
                            <a href="mailto:contact@wellnesstodays.com" className={styles.socialLink} aria-label="Email">
                                <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="2" y="4" width="20" height="16" rx="2" /><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" /></svg>
                            </a>
                        </div>
                    </div>

                    {/* Category Column */}
                    <div>
                        <h4 className={styles.columnTitle}>카테고리</h4>
                        <ul className={styles.linkList}>
                            <li className={styles.linkItem}><Link href="/blog/category/symptoms">증상별 건강정보</Link></li>
                            <li className={styles.linkItem}><Link href="/blog/category/home-remedies">민간요법·좋은음식</Link></li>
                            <li className={styles.linkItem}><Link href="/blog/category/supplements">영양제 정보</Link></li>
                            <li className={styles.linkItem}><Link href="/blog/category/daily-health">생활건강 상식</Link></li>
                            <li className={styles.linkItem}><Link href="/blog/category/pharmacy-guide">약국·의약품 상식</Link></li>
                        </ul>
                    </div>

                    {/* Resources Column */}
                    <div>
                        <h4 className={styles.columnTitle}>바로가기</h4>
                        <ul className={styles.linkList}>
                            <li className={styles.linkItem}><Link href="/">홈</Link></li>
                            <li className={styles.linkItem}><Link href="/blog">블로그</Link></li>
                            <li className={styles.linkItem}><Link href="/about">소개</Link></li>
                            <li className={styles.linkItem}><a href="https://www.yakchatja.com" target="_blank" rel="noopener noreferrer">약국찾자</a></li>
                        </ul>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className={styles.bottom}>
                    <p className={styles.copy}>
                        &copy; {new Date().getFullYear()} 오늘도 건강. All rights reserved.
                    </p>
                    <div className={styles.bottomLinks}>
                        <Link href="/privacy">Privacy Policy</Link>
                        <span className={styles.divider}>|</span>
                        <Link href="/terms">Terms of Service</Link>
                        <span className={styles.divider}>|</span>
                        <Link href="/contact">Contact</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
