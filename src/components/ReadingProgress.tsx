'use client';

import { useEffect, useState } from 'react';
import styles from './ReadingProgress.module.css';

export default function ReadingProgress() {
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        const handleScroll = () => {
            const totalScroll = document.documentElement.scrollTop;
            const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            const scroll = `${totalScroll / windowHeight}`;

            setProgress(Number(scroll));
        }

        window.addEventListener('scroll', handleScroll);

        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <div className={styles.container}>
            <div
                className={styles.bar}
                style={{ transform: `scaleX(${progress})` }}
            />
        </div>
    );
}
