import Link from 'next/link';
import Image from 'next/image';
import styles from './PostCard.module.css';

import { MDXPost } from '@/lib/mdx';

interface PostCardProps {
    post: MDXPost;
    className?: string;
}

export default function PostCard({ post, className = '' }: PostCardProps) {
    const { title, description, date, category, image } = post.frontmatter;

    return (
        <article className={`${styles.card} ${className}`}>
            <Link href={`/blog/${post.slug}`} className={styles.link}>
                <div className={styles.imageWrapper}>
                    {/* Placeholder for now if no image provided, using a gradient div */}
                    {image ? (
                        <div className={styles.imageContainer}>
                            {/* Note: Next.js Image requires width/height or fill. Using fill for responsive card. */}
                            <Image src={image} alt={title} fill className={styles.image} />
                        </div>
                    ) : (
                        <div className={styles.placeholderImage}></div>
                    )}
                </div>
                <div className={styles.content}>
                    <div className={styles.meta}>
                        <span className={styles.category}>{category}</span>
                        <span className={styles.date}>{date.toString()}</span>
                    </div>
                    <h3 className={styles.title}>{title}</h3>
                    <p className={styles.excerpt}>{description || ""}</p>
                </div>
            </Link>
        </article>
    );
}
