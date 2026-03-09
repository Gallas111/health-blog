import React from 'react';
import styles from './KeyTakeaway.module.css';
import { Sparkles } from 'lucide-react';

interface KeyTakeawayProps {
    title?: string;
    children: React.ReactNode;
}

export default function KeyTakeaway({ title = '핵심 요약', children }: KeyTakeawayProps) {
    return (
        <div className={styles.takeaway}>
            <div className={styles.header}>
                <Sparkles size={20} className={styles.icon} />
                <span className={styles.title}>{title}</span>
            </div>
            <div className={styles.content}>{children}</div>
        </div>
    );
}
