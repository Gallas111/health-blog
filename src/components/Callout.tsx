import React from 'react';
import styles from './Callout.module.css';
import { Info, Lightbulb, AlertTriangle, CheckCircle } from 'lucide-react';

interface CalloutProps {
    type: 'info' | 'tip' | 'warning' | 'success';
    title?: string;
    children: React.ReactNode;
}

export default function Callout({ type, title, children }: CalloutProps) {
    const icons = {
        info: <Info size={20} className={styles.icon} />,
        tip: <Lightbulb size={20} className={styles.icon} />,
        warning: <AlertTriangle size={20} className={styles.icon} />,
        success: <CheckCircle size={20} className={styles.icon} />,
    };

    return (
        <div className={`${styles.callout} ${styles[type]}`}>
            <div className={styles.header}>
                {icons[type]}
                {title && <span className={styles.title}>{title}</span>}
            </div>
            <div className={styles.content}>{children}</div>
        </div>
    );
}
