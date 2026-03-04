import Link from 'next/link';
import { ChevronRight, Home } from 'lucide-react';

interface BreadcrumbProps {
    items: {
        label: string;
        href: string;
    }[];
}

export default function Breadcrumb({ items }: BreadcrumbProps) {
    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
            {
                '@type': 'ListItem',
                position: 1,
                name: 'Home',
                item: 'https://www.wellnesstodays.com',
            },
            ...items.map((item, index) => ({
                '@type': 'ListItem',
                position: index + 2,
                name: item.label,
                item: `https://www.wellnesstodays.com${item.href}`,
            })),
        ],
    };

    return (
        <nav aria-label="Breadcrumb" className="mb-6 flex items-center text-sm text-gray-500 dark:text-gray-400">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />

            <ol className="flex items-center space-x-2">
                <li>
                    <Link
                        href="/"
                        className="hover:text-blue-600 dark:hover:text-blue-400 flex items-center transition-colors"
                        title="Home"
                    >
                        <Home size={16} />
                    </Link>
                </li>

                {items.map((item, index) => (
                    <li key={item.href} className="flex items-center space-x-2">
                        <ChevronRight size={14} className="text-gray-300 dark:text-gray-600" />

                        {index === items.length - 1 ? (
                            <span
                                className="font-medium text-gray-900 dark:text-gray-100 truncate max-w-[200px] md:max-w-xs"
                                title={item.label}
                            >
                                {item.label}
                            </span>
                        ) : (
                            <Link
                                href={item.href}
                                className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors whitespace-nowrap"
                            >
                                {item.label}
                            </Link>
                        )}
                    </li>
                ))}
            </ol>
        </nav>
    );
}
