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
                    <span className={styles.badge}>건강 정보 에디터</span>
                </div>
                <p className={styles.bio}>
                    신뢰할 수 있는 건강 정보를 쉽고 정확하게 전달합니다.
                    증상, 영양제, 민간요법, 생활건강 분야를 전문으로 다룹니다.
                </p>
                <div className={styles.meta}>
                    {date && <span className={styles.metaItem}>📅 {date}</span>}
                    {readingTime && <span className={styles.metaItem}>⏱️ {readingTime}</span>}
                    <span className={styles.metaItem}>🌐 wellnesstodays.com</span>
                </div>
            </div>
        </div>
    );
}
