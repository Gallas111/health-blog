'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Menu, X, Search } from 'lucide-react';
import { CATEGORY_LIST } from '@/lib/categories';
import SearchOverlay, { SearchPost } from './SearchOverlay';
import styles from './Header.module.css';

interface HeaderProps {
    posts?: SearchPost[];
}

export default function Header({ posts = [] }: HeaderProps) {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);

    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

    return (
        <>
            <header className={styles.header}>
                <div className={`container ${styles.container}`}>
                    <Link href="/" className={styles.logo}>
                        <span className={styles.logoText}>오늘도</span>건강
                    </Link>

                    <nav className={styles.nav}>
                        <Link href="/blog" className={styles.navLink}>전체 글</Link>
                        {CATEGORY_LIST.map((category) => (
                            <Link
                                key={category.slug}
                                href={`/blog/category/${category.slug}`}
                                className={styles.navLink}
                            >
                                {category.name}
                            </Link>
                        ))}

                        <button
                            className={styles.searchBtn}
                            onClick={() => setIsSearchOpen(true)}
                            aria-label="Search"
                        >
                            <Search size={20} />
                        </button>

                        <button
                            className={styles.menuBtn}
                            onClick={toggleMenu}
                            aria-label="Toggle menu"
                        >
                            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </nav>
                </div>

                {/* Mobile Menu */}
                {isMenuOpen && (
                    <div className={`${styles.mobileMenu} ${isMenuOpen ? styles.open : ''}`}>
                        <Link href="/blog" className={styles.navLink} onClick={() => setIsMenuOpen(false)}>전체 글</Link>
                        {CATEGORY_LIST.map((category) => (
                            <Link
                                key={category.slug}
                                href={`/blog/category/${category.slug}`}
                                className={styles.navLink}
                                onClick={() => setIsMenuOpen(false)}
                            >
                                {category.icon} {category.name}
                            </Link>
                        ))}
                    </div>
                )}
            </header>

            <SearchOverlay isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} posts={posts} />
        </>
    );
}
