import Link from "next/link";
import { ArrowLeft, Clock } from "lucide-react";
import { notFound } from "next/navigation";
import { getPostBySlug, getHeadings, getPostsByCategory, getAllPosts, getAdjacentPosts } from "@/lib/mdx";
import { getCategoryByFolderName } from "@/lib/categories";
import ShareButtons from "@/components/ShareButtons";
import PostNavigation from "@/components/PostNavigation";
import ReadingProgress from "@/components/ReadingProgress";
import TableOfContents from "@/components/TableOfContents";
import Comments from "@/components/Comments";
import PostCard from "@/components/PostCard";
import AuthorCard from "@/components/AuthorCard";
import Breadcrumb from "@/components/Breadcrumb";
import PharmacyBanner from "@/components/PharmacyBanner";
import PharmacyBannerCompact from "@/components/PharmacyBannerCompact";
import Disclaimer from "@/components/Disclaimer";
import styles from "./page.module.css";
import { Metadata } from "next";
import { MDXRemote } from "next-mdx-remote/rsc";
import rehypeHighlight from "rehype-highlight";
import rehypeSlug from "rehype-slug";
import remarkGfm from "remark-gfm";
import "highlight.js/styles/atom-one-dark.css";
import Callout from "@/components/Callout";
import ProsCons from "@/components/ProsCons";
import KeyTakeaway from "@/components/KeyTakeaway";
import ScrollTracker from "@/components/ScrollTracker";
import YouTubeEmbed from "@/components/YouTubeEmbed";
import SwipeNavigation from "@/components/SwipeNavigation";


export async function generateStaticParams() {
    return getAllPosts().map((post) => ({
        slug: post.slug,
    }));
}

interface PageProps {
    params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { slug } = await params;
    const decodedSlug = decodeURIComponent(slug);
    const post = getPostBySlug(decodedSlug);

    if (!post) {
        return { title: "오늘도 건강 블로그" };
    }

    return {
        title: post.frontmatter.title,
        description: post.frontmatter.description,
        ...(post.frontmatter.noindex && {
            robots: { index: false, follow: false },
        }),
        openGraph: {
            title: post.frontmatter.title,
            description: post.frontmatter.description,
            type: "article",
            publishedTime: post.frontmatter.date,
            authors: ["오늘도 건강"],
            siteName: "오늘도 건강",
            locale: "ko_KR",
            images: [{ url: post.frontmatter.image || "/og-image.png", width: 1200, height: 630, alt: post.frontmatter.title }],
        },
        twitter: {
            card: "summary_large_image",
            title: post.frontmatter.title,
            description: post.frontmatter.description,
            images: [post.frontmatter.image || "/og-image.png"],
        },
        alternates: {
            canonical: `https://www.wellnesstodays.com/blog/${post.slug}`,
        },
    };
}

export default async function BlogPost({ params }: PageProps) {
    const { slug } = await params;
    const decodedSlug = decodeURIComponent(slug);
    const post = getPostBySlug(decodedSlug);

    if (!post) {
        notFound();
    }

    const headings = getHeadings(post.content);
    const { prev, next } = getAdjacentPosts(decodedSlug);
    const categoryInfo = getCategoryByFolderName(post.category);

    // [SEO Logic] Related Posts System
    // 1. Same Category (Max 3)
    const sameCategoryPosts = getPostsByCategory(post.category)
        .filter((p) => p.slug !== post.slug)
        .slice(0, 3);

    // 2. Other Categories (Max 2, Random/Latest) - To ensure site-wide crawling
    const allPosts = getAllPosts();
    const otherCategoryPosts = allPosts
        .filter(p => p.category !== post.category && p.slug !== post.slug)
        .slice(0, 2);

    const relatedPosts = [...sameCategoryPosts, ...otherCategoryPosts];

    // [SEO Logic] Article Schema
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": ["Article", "MedicalWebPage"],
        headline: post.frontmatter.title,
        description: post.frontmatter.description,
        image: post.frontmatter.image ? [post.frontmatter.image] : [],
        datePublished: new Date(post.frontmatter.date).toISOString(),
        dateModified: new Date(post.frontmatter.date).toISOString(),
        author: {
            "@type": "Organization",
            name: "오늘도 건강 편집팀",
            url: "https://www.wellnesstodays.com/about#team",
            description: "간호학·약학·영양학 전공 편집진",
        },
        publisher: {
            "@type": "Organization",
            name: "오늘도 건강",
            url: "https://www.wellnesstodays.com",
            logo: { "@type": "ImageObject", url: "https://www.wellnesstodays.com/icon.svg" },
        },
        mainEntityOfPage: {
            "@type": "WebPage",
            "@id": `https://www.wellnesstodays.com/blog/${post.slug}`,
        },
        about: {
            "@type": "MedicalCondition",
            name: "건강 정보",
        },
        lastReviewed: new Date(post.frontmatter.date).toISOString(),
        reviewedBy: {
            "@type": "Organization",
            name: "오늘도 건강 편집팀",
        },
    };

    // [SEO Logic] FAQ Schema
    const faqJsonLd = post.frontmatter.faq && post.frontmatter.faq.length > 0 ? {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: post.frontmatter.faq.map((item: { q: string; a: string }) => ({
            "@type": "Question",
            name: item.q,
            acceptedAnswer: {
                "@type": "Answer",
                text: item.a
            }
        }))
    } : null;

    // Custom MDX Components for better Performance/SEO
    const mdxComponents = {
        img: (props: any) => (
            <span className={styles.imageWrapper}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                    src={props.src}
                    alt={props.alt || ""}
                    className={styles.optimizedImage}
                    loading="lazy"
                />
            </span>
        ),
        Callout,
        ProsCons,
        KeyTakeaway,
        YouTubeEmbed,
    };

    const breadcrumbItems = categoryInfo ? [
        { label: categoryInfo.name, href: `/blog/category/${categoryInfo.slug}` },
        { label: post.frontmatter.title, href: `/blog/${post.slug}` }
    ] : [];

    return (
        <>
            <SwipeNavigation prevSlug={prev?.slug} nextSlug={next?.slug} />
            <ScrollTracker />
            <ReadingProgress />
            <div className={styles.container}>
                <div className={styles.layout}>
                    <main className={styles.article}>
                        <script
                            type="application/ld+json"
                            dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
                        />
                        {faqJsonLd && (
                            <script
                                type="application/ld+json"
                                dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
                            />
                        )}

                        {/* Breadcrumb Navigation - Critical for SEO */}
                        <div className="px-4 md:px-0 pt-4">
                            <Breadcrumb items={breadcrumbItems} />
                        </div>

                        <div className={styles.header}>
                            <div className={styles.meta}>
                                <span className={styles.category}>{post.category}</span>
                                <span className={styles.date}>{post.frontmatter.date}</span>
                                <span className={styles.readTime}>
                                    <Clock size={14} /> {post.readingTime || "5분"}
                                </span>
                            </div>
                            <h1 className={styles.title}>{post.frontmatter.title}</h1>
                        </div>

                        {/* Author 카드 - E-E-A-T 강화 */}
                        <AuthorCard
                            date={post.frontmatter.date}
                            readingTime={post.readingTime || "5분"}
                        />

                        <TableOfContents headings={headings} mobile />

                        <PharmacyBannerCompact />

                        <div className={styles.content}>
                            <MDXRemote
                                source={post.content}
                                components={mdxComponents}
                                options={{
                                    mdxOptions: {
                                        remarkPlugins: [remarkGfm],
                                        rehypePlugins: [rehypeSlug, rehypeHighlight],
                                    },
                                }}
                            />
                        </div>

                        {/* 약국찾자 CTA 배너 */}
                        <PharmacyBanner />

                        {/* 의료 면책조항 */}
                        <Disclaimer />

                        {/* FAQ Section (Visible) */}
                        {post.frontmatter.faq && post.frontmatter.faq.length > 0 && (
                            <section className={styles.faqSection}>
                                <h2 className={styles.faqTitle}>❓ 자주 묻는 질문 (FAQ)</h2>
                                <div className={styles.faqList}>
                                    {post.frontmatter.faq.map((item: { q: string; a: string }, idx: number) => (
                                        <div key={idx} className={styles.faqItem}>
                                            <h3 className={styles.faqQuestion}>{item.q}</h3>
                                            <p className={styles.faqAnswer}>{item.a}</p>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                        <ShareButtons title={post.frontmatter.title} slug={post.slug} />
                        <PostNavigation currentSlug={post.slug} currentCategory={post.category} />

                        {/* Enhanced Related Posts Section */}
                        {relatedPosts.length > 0 && (
                            <section className={styles.relatedSection}>
                                <div className={styles.relatedHeader}>
                                    <h2 className={styles.relatedTitle}>
                                        📚 함께 읽으면 좋은 글 (Related Posts)
                                    </h2>
                                    {categoryInfo && (
                                        <Link
                                            href={`/blog/category/${categoryInfo.slug}`}
                                            className={styles.relatedViewAll}
                                        >
                                            {categoryInfo.name} 더 보기 →
                                        </Link>
                                    )}
                                </div>
                                <div className={styles.relatedGrid}>
                                    {relatedPosts.map((relPost) => (
                                        <PostCard
                                            key={relPost.slug}
                                            post={relPost}
                                            className="h-full"
                                        />
                                    ))}
                                </div>
                            </section>
                        )}

                        <Comments />
                    </main>

                    <aside className={styles.sidebar}>
                        <TableOfContents headings={headings} />
                    </aside>
                </div>
            </div>
        </>
    );
}
