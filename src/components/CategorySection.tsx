import Link from "next/link";
import PostCard from "./PostCard";
import styles from "@/app/page.module.css"; // Reuse page styles for consistency or create specific module
import { MDXPost } from "@/lib/mdx";

interface CategorySectionProps {
    id: string; // slug
    title: string;
    description: string;
    icon: string;
    posts: MDXPost[];
}

export default function CategorySection({ id, title, description, icon, posts }: CategorySectionProps) {
    if (posts.length === 0) return null;

    return (
        <section className={`container ${styles.categorySection}`}>
            <div className={styles.categorySectionHeader}>
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <span className="text-3xl">{icon}</span>
                        <h2 className={styles.categorySectionTitle}>
                            {title}
                        </h2>
                    </div>
                    <p className={styles.categorySectionDesc}>{description}</p>
                </div>
                <Link
                    href={`/blog/category/${id}`}
                    className={styles.viewAllBtn}
                >
                    {title} 전체 보기 →
                </Link>
            </div>

            <div className={styles.grid}>
                {posts.slice(0, 4).map((post) => (
                    <PostCard key={post.slug} post={post} />
                ))}
            </div>
        </section>
    );
}
