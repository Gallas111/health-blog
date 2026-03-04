import * as cheerio from 'cheerio';

export interface Heading {
    id: string;
    text: string;
    level: number;
}

export function processContent(html: string): { contentWithIds: string; headings: Heading[] } {
    const $ = cheerio.load(html);
    const headings: Heading[] = [];

    $('h2, h3').each((index, element) => {
        const el = $(element);
        const text = el.text();
        // Generate ID from text or fallback to index
        const id = `heading-${index}`;

        el.attr('id', id);

        headings.push({
            id,
            text,
            level: parseInt(element.tagName.substring(1))
        });
    });

    return {
        contentWithIds: $('body').html() || html,
        headings
    };
}
