import Link from 'next/link';
import { getAdjacentPosts, getRelatedPosts, getPostBySlug } from '@/lib/mdx';
import styles from './PostNavigation.module.css';

interface PostNavigationProps {
    currentSlug: string;
    currentCategory: string;
}

export default async function PostNavigation({ currentSlug, currentCategory }: PostNavigationProps) {
    const { prev, next } = getAdjacentPosts(currentSlug);
    const currentPost = getPostBySlug(currentSlug);
    // Get related posts based on tags/category
    const relatedPosts = currentPost ? getRelatedPosts(currentPost, 3) : [];

    return (
        <div className={styles.container}>
            {/* Prev / Next */}
            <nav className={styles.prevNext}>
                {prev ? (
                    <Link href={`/blog/${prev.slug}`} className={styles.navCard}>
                        <span className={styles.navLabel}>← 이전 글</span>
                        <span className={styles.navTitle}>{prev.frontmatter.title}</span>
                    </Link>
                ) : <div />}
                {next ? (
                    <Link href={`/blog/${next.slug}`} className={`${styles.navCard} ${styles.navRight}`}>
                        <span className={styles.navLabel}>다음 글 →</span>
                        <span className={styles.navTitle}>{next.frontmatter.title}</span>
                    </Link>
                ) : <div />}
            </nav>

            {/* Related Posts */}
            {relatedPosts.length > 0 && (
                <section className={styles.related}>
                    <h2 className={styles.relatedTitle}>추천 아티클</h2>
                    <div className={styles.relatedGrid}>
                        {relatedPosts.map(post => (
                            <Link key={post.slug} href={`/blog/${post.slug}`} className={styles.relatedCard}>
                                <div className={styles.relatedImage}>
                                    {post.frontmatter.image ? (
                                        /* eslint-disable-next-line @next/next/no-img-element */
                                        <img src={post.frontmatter.image} alt={post.frontmatter.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                    ) : (
                                        <div style={{ width: '100%', height: '100%', background: '#eee' }} />
                                    )}
                                </div>
                                <div className={styles.relatedContent}>
                                    <span className={styles.relatedCategory}>{post.category}</span>
                                    <h3 className={styles.relatedCardTitle}>{post.frontmatter.title}</h3>
                                </div>
                            </Link>
                        ))}
                    </div>
                </section>
            )}
        </div>
    );
}
