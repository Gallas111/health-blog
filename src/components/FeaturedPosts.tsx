import Link from 'next/link';
import { ArrowRight, Star } from 'lucide-react';
import PostCard from './PostCard';
import { getPostBySlug } from '@/lib/mdx';

export default function FeaturedPosts() {
    // Manually select high-impact posts
    const featuredSlugs = [
        'chatgpt-블로그-글쓰기-자동화-월-100만원-수익-로드맵',
        'zapier-guide-google-sheets-automation',
        '구글-상위-노출-ai-블로그-seo-완벽-가이드'
    ];

    const posts = featuredSlugs
        .map(slug => getPostBySlug(slug))
        .filter(post => post !== null);

    if (posts.length === 0) return null;

    return (
        <section className="py-20 bg-gray-50 dark:bg-gray-900/50">
            <div className="container mx-auto px-4 max-w-6xl">
                <div className="flex items-end justify-between mb-10">
                    <div>
                        <div className="flex items-center gap-2 text-blue-600 font-bold mb-2">
                            <Star size={20} className="fill-blue-600" />
                            <span className="uppercase tracking-wider text-sm">Must Read</span>
                        </div>
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
                            인기 게시글
                        </h2>
                    </div>
                    <Link
                        href="/blog"
                        className="hidden md:flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                    >
                        전체 보기 <ArrowRight size={18} />
                    </Link>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    {posts.map((post) => (
                        <PostCard key={post!.slug} post={post!} />
                    ))}
                </div>

                <div className="mt-10 text-center md:hidden">
                    <Link
                        href="/blog"
                        className="inline-flex items-center gap-2 px-6 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-full font-medium shadow-sm hover:shadow-md transition-all"
                    >
                        전체 보기 <ArrowRight size={18} />
                    </Link>
                </div>
            </div>
        </section>
    );
}
