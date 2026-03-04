'use client';

import { useState } from 'react';
import PostCard from './PostCard';
import styles from './BlogFilteredList.module.css';
import { MDXPost } from '@/lib/mdx';

const CATEGORY_DISPLAY_NAMES: Record<string, string> = {
    "ai-revenue": "AI로 수익창출",
    "chatgpt-guide": "ChatGPT 완전정복",
    "ai-tools": "AI 도구 추천",
    "ai-automation": "AI 업무 자동화",
    "ai-guide": "AI 사용법 가이드",
};

interface BlogFilteredListProps {
    posts: MDXPost[];
}

export default function BlogFilteredList({ posts }: BlogFilteredListProps) {
    const categories = ['전체', ...Array.from(new Set(posts.map(p => p.frontmatter.category)))];
    const [active, setActive] = useState('전체');

    const filtered = active === '전체' ? posts : posts.filter(p => p.frontmatter.category === active);

    return (
        <>
            <div className={styles.tabs}>
                {categories.map(cat => (
                    <button
                        key={cat}
                        className={`${styles.tab} ${active === cat ? styles.active : ''}`}
                        onClick={() => setActive(cat)}
                    >
                        {cat === '전체' ? cat : (CATEGORY_DISPLAY_NAMES[cat] || cat)}
                        {cat !== '전체' && (
                            <span className={styles.count}>
                                {posts.filter(p => p.frontmatter.category === cat).length}
                            </span>
                        )}
                    </button>
                ))}
            </div>
            <div className={styles.grid}>
                {filtered.map(post => (
                    <PostCard key={post.slug} post={post} />
                ))}
            </div>
            {filtered.length === 0 && (
                <p className={styles.empty}>해당 카테고리에 글이 없습니다.</p>
            )}
        </>
    );
}
