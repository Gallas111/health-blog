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
                    <span className={styles.badge}>1차 출처 기반 편집팀</span>
                </div>
                <p className={styles.bio}>
                    공공 의료 자료(질병관리청, 식약처, NIH, WHO)와 PubMed 학술 문헌 등 1차 출처를
                    바탕으로 작성·검수합니다. 전문 의료인이 아니며, 진단·치료는 의료기관을 이용하세요.
                </p>
                <div className={styles.sources}>
                    <span className={styles.sourceLabel}>참고 기관:</span>
                    <span className={styles.sourceItem}>질병관리청</span>
                    <span className={styles.sourceItem}>식약처</span>
                    <span className={styles.sourceItem}>NIH</span>
                    <span className={styles.sourceItem}>WHO</span>
                    <span className={styles.sourceItem}>Mayo Clinic</span>
                </div>
                <div className={styles.meta}>
                    {date && <span className={styles.metaItem}>📅 {date}</span>}
                    {readingTime && <span className={styles.metaItem}>⏱️ {readingTime}</span>}
                    <Link href="/editorial-policy" className={styles.policyLink}>편집·출처 정책</Link>
                    <Link href="/about#team" className={styles.policyLink}>편집팀 소개</Link>
                </div>
            </div>
        </div>
    );
}
