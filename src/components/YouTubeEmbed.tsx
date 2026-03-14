interface YouTubeEmbedProps {
    id: string;
    title?: string;
}

export default function YouTubeEmbed({ id, title = '동영상' }: YouTubeEmbedProps) {
    const schema = {
        "@context": "https://schema.org",
        "@type": "VideoObject",
        name: title,
        thumbnailUrl: `https://img.youtube.com/vi/${id}/maxresdefault.jpg`,
        embedUrl: `https://www.youtube-nocookie.com/embed/${id}`,
        contentUrl: `https://www.youtube.com/watch?v=${id}`,
    };

    return (
        <div className="my-6 relative w-full" style={{ paddingBottom: '56.25%' }}>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
            />
            <iframe
                className="absolute top-0 left-0 w-full h-full rounded-xl"
                src={`https://www.youtube-nocookie.com/embed/${id}`}
                title={title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                loading="lazy"
            />
        </div>
    );
}
