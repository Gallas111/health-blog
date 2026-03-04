import React from 'react';
import styles from './ProsCons.module.css';
import { Check, X } from 'lucide-react';

interface ProsConsProps {
    pros: string[];
    cons: string[];
}

export default function ProsCons(props: any) {
    let pros = props.pros;
    let cons = props.cons;

    // Handle cases where props might be passed as strings (MDX parser/serialization quirks)
    if (typeof pros === 'string') {
        if (pros.startsWith('[') && pros.endsWith(']')) {
            try { pros = JSON.parse(pros.replace(/'/g, '"')); } catch (e) { pros = pros.split(',').map((s: string) => s.trim()); }
        } else {
            pros = pros.split(',').map((s: string) => s.trim());
        }
    }
    if (typeof cons === 'string') {
        if (cons.startsWith('[') && cons.endsWith(']')) {
            try { cons = JSON.parse(cons.replace(/'/g, '"')); } catch (e) { cons = cons.split(',').map((s: string) => s.trim()); }
        } else {
            cons = cons.split(',').map((s: string) => s.trim());
        }
    }

    pros = Array.isArray(pros) ? pros : [];
    cons = Array.isArray(cons) ? cons : [];

    return (
        <div className={styles.container}>
            <div className={styles.column}>
                <div className={`${styles.header} ${styles.prosHeader}`}>
                    <Check size={20} className={styles.icon} />
                    <span>장점 (Pros)</span>
                </div>
                <ul className={styles.list}>
                    {pros.map((pro: string, i: number) => (
                        <li key={i} className={styles.item}>{pro}</li>
                    ))}
                </ul>
            </div>
            <div className={styles.column}>
                <div className={`${styles.header} ${styles.consHeader}`}>
                    <X size={20} className={styles.icon} />
                    <span>단점 (Cons)</span>
                </div>
                <ul className={styles.list}>
                    {cons.map((con: string, i: number) => (
                        <li key={i} className={styles.item}>{con}</li>
                    ))}
                </ul>
            </div>
        </div>
    );
}
