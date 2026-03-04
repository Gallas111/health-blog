
import { Metadata } from 'next';
import { notFound, redirect } from 'next/navigation';
import Link from 'next/link';
import { getPostsByCategory } from '@/lib/mdx';
import { getCategoryBySlug, CATEGORY_LIST } from '@/lib/categories';
import { categoryDescriptions } from '@/lib/categoryDescriptions';
import PostCard from '@/components/PostCard';
import styles from './page.module.css';

interface PageProps {
    params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
    return CATEGORY_LIST.map((category) => ({
        slug: category.slug,
    }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { slug } = await params;
    const categoryInfo = categoryDescriptions[slug];

    if (!categoryInfo) {
        return { title: '오늘도 건강 블로그' };
    }

    return {
        title: `${categoryInfo.title} | 오늘도 건강`,
        description: categoryInfo.description,
        alternates: {
            canonical: `https://www.wellnesstodays.com/blog/category/${slug}`,
        },
        openGraph: {
            title: categoryInfo.title,
            description: categoryInfo.description,
            type: 'website',
            url: `https://www.wellnesstodays.com/blog/category/${slug}`,
        },
    };
}

export default async function CategoryPage({ params }: PageProps) {
    const { slug } = await params;

    const baseCategory = getCategoryBySlug(slug);
    const richInfo = categoryDescriptions[slug];

    if (!baseCategory || !richInfo) {
        redirect("/blog");
    }

    const posts = getPostsByCategory(baseCategory.folderName);

    // Schema.org CollectionPage
    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'CollectionPage',
        name: richInfo.title,
        description: richInfo.description,
        url: `https://www.wellnesstodays.com/blog/category/${slug}`,
        mainEntity: {
            '@type': 'ItemList',
            itemListElement: posts.map((post, index) => ({
                '@type': 'ListItem',
                position: index + 1,
                url: `https://www.wellnesstodays.com/blog/${post.slug}`,
                name: post.frontmatter.title,
            })),
        },
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />

            {/* SEO Hub Header */}
            <header className="mb-12 text-center max-w-3xl mx-auto">
                <div className="text-4xl mb-4">{baseCategory.icon}</div>
                <h1 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-gray-100">
                    {richInfo.title}
                </h1>
                <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
                    {richInfo.description}
                </p>

                {/* Feature List (SEO Keywords) */}
                <div className="flex flex-wrap justify-center gap-3">
                    {richInfo.features.map((feature, i) => (
                        <span key={i} className="px-3 py-1 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 rounded-full text-sm font-medium">
                            ✓ {feature}
                        </span>
                    ))}
                </div>
            </header>

            {/* Post Grid */}
            <section>
                <h2 className="text-2xl font-bold mb-6 border-l-4 border-emerald-600 pl-3">
                    {baseCategory.name} 최신 글 ({posts.length})
                </h2>

                {posts.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {posts.map((post) => (
                            <PostCard
                                key={post.slug}
                                post={post}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <p className="text-gray-500">아직 이 카테고리에 글이 없습니다. 곧 업데이트됩니다!</p>
                    </div>
                )}
            </section>
        </div>
    );
}
