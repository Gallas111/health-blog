'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Search, X, ArrowRight } from 'lucide-react';
import styles from './SearchOverlay.module.css';

export interface SearchPost {
    slug: string;
    title: string;
    excerpt: string;
    category: string;
    date: string;
}

interface SearchOverlayProps {
    isOpen: boolean;
    onClose: () => void;
    posts: SearchPost[];
}

export default function SearchOverlay({ isOpen, onClose, posts }: SearchOverlayProps) {
    const [query, setQuery] = useState('');
    const inputRef = useRef<HTMLInputElement>(null);

    // Focus input when opened
    useEffect(() => {
        if (isOpen) {
            setTimeout(() => inputRef.current?.focus(), 100);
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }

        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };
        window.addEventListener('keydown', handleEsc);
        return () => window.removeEventListener('keydown', handleEsc);
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    const filtered = query.trim() === ''
        ? []
        : posts.filter(post =>
            post.title.toLowerCase().includes(query.toLowerCase()) ||
            post.excerpt.toLowerCase().includes(query.toLowerCase()) ||
            post.category.toLowerCase().includes(query.toLowerCase())
        ).slice(0, 5); // Limit to 5 results

    return (
        <div className={styles.overlay} onClick={onClose}>
            <div className={styles.container} onClick={e => e.stopPropagation()}>
                <div className={styles.header}>
                    <div className={styles.inputWrapper}>
                        <Search className={styles.searchIcon} size={20} />
                        <input
                            ref={inputRef}
                            type="text"
                            className={styles.input}
                            placeholder="검색어를 입력하세요 (예: AI, ChatGPT, 코딩...)"
                            value={query}
                            onChange={e => setQuery(e.target.value)}
                        />
                        {query && (
                            <button onClick={() => setQuery('')} className={styles.clearBtn}>
                                <X size={16} />
                            </button>
                        )}
                    </div>
                    <button onClick={onClose} className={styles.closeBtn}>
                        <span className={styles.esc}>ESC</span>
                        <X size={24} />
                    </button>
                </div>

                <div className={styles.results}>
                    {query && filtered.length > 0 && (
                        <div className={styles.list}>
                            {filtered.map(post => (
                                <Link
                                    key={post.slug}
                                    href={`/blog/${post.slug}`}
                                    className={styles.item}
                                    onClick={onClose}
                                >
                                    <div className={styles.itemMeta}>
                                        <span className={styles.category}>{post.category}</span>
                                        <span className={styles.date}>{post.date}</span>
                                    </div>
                                    <h3 className={styles.itemTitle}>{post.title}</h3>
                                    <p className={styles.itemExcerpt}>{post.excerpt}</p>
                                    <span className={styles.arrow}><ArrowRight size={16} /></span>
                                </Link>
                            ))}
                        </div>
                    )}

                    {query && filtered.length === 0 && (
                        <div className={styles.empty}>
                            <p>검색 결과가 없습니다.</p>
                        </div>
                    )}

                    {!query && (
                        <div className={styles.recent}>
                            <h4 className={styles.recentTitle}>최신 글</h4>
                            <div className={styles.list}>
                                {posts.slice(0, 3).map(post => (
                                    <Link
                                        key={post.slug}
                                        href={`/blog/${post.slug}`}
                                        className={styles.item}
                                        onClick={onClose}
                                    >
                                        <h3 className={styles.itemTitle}>{post.title}</h3>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
