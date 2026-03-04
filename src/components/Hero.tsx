import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import styles from './Hero.module.css';

export default function Hero() {
    return (
        <section className={styles.hero}>
            <div className={`container ${styles.container}`}>
                <div className={styles.content}>
                    <div className={styles.badge}>건강, 쉽고 정확하게</div>
                    <h1 className={styles.title}>
                        오늘도 건강하게, <br />
                        <span className={styles.gradientText}>믿을 수 있는 건강 정보 가이드</span>
                    </h1>
                    <p className={styles.subtitle}>
                        증상별 원인과 대처법, 영양제 효능, 민간요법까지. <br className={styles.break} />
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
                </div>
                <div className={styles.imageWrapper}>
                    <div className={styles.imageContainer}>
                        <Image
                            src="/images/home-hero.png"
                            alt="건강한 라이프스타일"
                            fill
                            className={styles.heroImage}
                            priority
                            sizes="(max-width: 768px) 100vw, 50vw"
                        />
                    </div>
                    <div className={styles.glow} />
                </div>
            </div>
            <div className={styles.backgroundGlow} />
        </section>
    );
}
