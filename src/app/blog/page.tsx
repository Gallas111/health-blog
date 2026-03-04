import BlogFilteredList from "@/components/BlogFilteredList";
import styles from "./page.module.css";
import { getAllPosts } from "@/lib/mdx";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "블로그 | 오늘도 건강",
    description: "증상별 건강정보, 영양제 효능, 민간요법, 생활건강 상식까지. 믿을 수 있는 건강 정보를 한 곳에서 확인하세요.",
    alternates: {
        canonical: "https://www.wellnesstodays.com/blog",
    },
};

export default function BlogListing() {
    const allPosts = getAllPosts();
    const posts = allPosts;

    return (
        <div className="container">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "Blog",
                        name: "오늘도 건강 블로그",
                        description: "증상별 건강정보, 영양제 효능, 민간요법, 생활건강 상식",
                        url: "https://www.wellnesstodays.com/blog",
                        publisher: {
                            "@type": "Organization",
                            name: "오늘도 건강",
                            logo: {
                                "@type": "ImageObject",
                                url: "https://www.wellnesstodays.com/icon.svg"
                            }
                        }
                    })
                }}
            />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "BreadcrumbList",
                        itemListElement: [{
                            "@type": "ListItem",
                            "position": 1,
                            "name": "Home",
                            "item": "https://www.wellnesstodays.com"
                        }, {
                            "@type": "ListItem",
                            "position": 2,
                            "name": "Blog",
                            "item": "https://www.wellnesstodays.com/blog"
                        }]
                    })
                }}
            />
            <div className={styles.header}>
                <h1 className={styles.title}>건강 블로그</h1>
                <p className={styles.subtitle}>증상, 영양제, 민간요법, 생활건강 — 믿을 수 있는 건강 정보</p>
            </div>

            <BlogFilteredList posts={posts} />
        </div>
    );
}
