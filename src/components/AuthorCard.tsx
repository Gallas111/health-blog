import Link from 'next/link';
import styles from './AuthorCard.module.css';

interface AuthorCardProps {
    name?: string;
    date?: string;
    readingTime?: string;
}

export default function AuthorCard({
    name = "오늘도 건강 편집팀",
    date,
    readingTime,
}: AuthorCardProps) {
    return (
        <div className={styles.card}>
            <div className={styles.avatar}>
                <span className={styles.avatarIcon}>💚</span>
            </div>
            <div className={styles.info}>
                <div className={styles.nameRow}>
                    <span className={styles.name}>{name}</span>
                    <span className={styles.badge}>건강 정보 편집팀</span>
                </div>
                <p className={styles.bio}>
                    공공 의료 자료와 학술 문헌을 바탕으로 생활건강 정보를 정리합니다.
                    이 글은 의학적 진단이 아닌 일반 정보 제공 목적입니다.
                </p>
                <div className={styles.meta}>
                    {date && <span className={styles.metaItem}>📅 {date}</span>}
                    {readingTime && <span className={styles.metaItem}>⏱️ {readingTime}</span>}
                    <Link href="/about#editorial-policy" className={styles.policyLink}>편집 원칙 보기</Link>
                </div>
            </div>
        </div>
    );
}
