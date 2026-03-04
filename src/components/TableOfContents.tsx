'use client';

import { useEffect, useState } from 'react';
import { ChevronDown } from 'lucide-react';
import styles from './TableOfContents.module.css';
import { Heading } from '@/lib/toc';

interface TableOfContentsProps {
    headings: Heading[];
    mobile?: boolean;
}

export default function TableOfContents({ headings, mobile = false }: TableOfContentsProps) {
    const [activeId, setActiveId] = useState<string>('');

    useEffect(() => {
        if (mobile) return; // Disable scroll spy on mobile to save performance

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setActiveId(entry.target.id);
                    }
                });
            },
            { rootMargin: '-10% 0px -80% 0px' }
        );

        headings.forEach(({ id }) => {
            const element = document.getElementById(id);
            if (element) observer.observe(element);
        });

        return () => observer.disconnect();
    }, [headings, mobile]);

    if (headings.length === 0) return null;

    if (mobile) {
        return (
            <details className={styles.mobileToc}>
                <summary className={styles.mobileSummary}>
                    목차 보기 <ChevronDown size={16} className={styles.mobileIcon} />
                </summary>
                <ul className={styles.mobileList}>
                    {headings.map((heading) => (
                        <li
                            key={heading.id}
                            className={`${styles.mobileItem} ${heading.level === 3 ? styles.mobileSubItem : ''}`}
                        >
                            <a
                                href={`#${heading.id}`}
                                className={styles.mobileLink}
                                onClick={(e) => {
                                    e.preventDefault();
                                    document.getElementById(heading.id)?.scrollIntoView({
                                        behavior: 'smooth'
                                    });
                                    // Close details
                                    const details = e.currentTarget.closest('details');
                                    if (details) details.removeAttribute('open');
                                }}
                            >
                                {heading.text}
                            </a>
                        </li>
                    ))}
                </ul>
            </details>
        );
    }

    return (
        <nav className={styles.toc}>
            <h4 className={styles.title}>목 차</h4>
            <ul className={styles.list}>
                {headings.map((heading) => (
                    <li
                        key={heading.id}
                        className={`${styles.item} ${heading.level === 3 ? styles.subItem : ''}`}
                    >
                        <a
                            href={`#${heading.id}`}
                            className={`${styles.link} ${activeId === heading.id ? styles.active : ''}`}
                            onClick={(e) => {
                                e.preventDefault();
                                document.getElementById(heading.id)?.scrollIntoView({
                                    behavior: 'smooth'
                                });
                                setActiveId(heading.id);
                            }}
                        >
                            {heading.text}
                        </a>
                    </li>
                ))}
            </ul>
        </nav>
    );
}
