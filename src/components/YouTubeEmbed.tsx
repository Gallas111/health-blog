interface YouTubeEmbedProps {
    id: string;
    title?: string;
}

export default function YouTubeEmbed({ id, title = '동영상' }: YouTubeEmbedProps) {
    return (
        <div className="my-6 relative w-full" style={{ paddingBottom: '56.25%' }}>
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
