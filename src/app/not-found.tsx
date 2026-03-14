import Link from "next/link";
import { getAllPosts } from "@/lib/mdx";
import { CATEGORY_MAP } from "@/lib/categories";
import PostCard from "@/components/PostCard";

export const metadata = {
    title: "페이지를 찾을 수 없습니다",
    description: "요청하신 페이지가 존재하지 않습니다. 다른 건강 정보를 확인해보세요.",
};

export default function NotFound() {
    const recentPosts = getAllPosts().slice(0, 3);
    const categories = Object.values(CATEGORY_MAP);

    return (
        <div style={{ maxWidth: 720, margin: "0 auto", padding: "60px 20px", textAlign: "center" }}>
            <h1 style={{ fontSize: "4rem", fontWeight: 800, color: "#16a34a", margin: 0 }}>404</h1>
            <h2 style={{ fontSize: "1.5rem", fontWeight: 600, marginTop: 8, color: "#1f2937" }}>
                페이지를 찾을 수 없습니다
            </h2>
            <p style={{ color: "#6b7280", marginTop: 12, lineHeight: 1.6 }}>
                요청하신 페이지가 삭제되었거나 주소가 변경되었을 수 있습니다.
            </p>

            <Link
                href="/"
                style={{
                    display: "inline-block",
                    marginTop: 24,
                    padding: "12px 28px",
                    backgroundColor: "#16a34a",
                    color: "#fff",
                    borderRadius: 8,
                    fontWeight: 600,
                    textDecoration: "none",
                }}
            >
                홈으로 돌아가기
            </Link>

            {/* Category Links */}
            <div style={{ marginTop: 48, textAlign: "left" }}>
                <h3 style={{ fontSize: "1.1rem", fontWeight: 600, marginBottom: 16, color: "#1f2937" }}>
                    카테고리 둘러보기
                </h3>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                    {categories.map((cat) => (
                        <Link
                            key={cat.slug}
                            href={`/blog/category/${cat.slug}`}
                            style={{
                                padding: "8px 16px",
                                backgroundColor: "#f0fdf4",
                                color: "#15803d",
                                borderRadius: 20,
                                fontSize: "0.9rem",
                                fontWeight: 500,
                                textDecoration: "none",
                                border: "1px solid #bbf7d0",
                            }}
                        >
                            {cat.icon} {cat.name}
                        </Link>
                    ))}
                </div>
            </div>

            {/* Recent Posts */}
            {recentPosts.length > 0 && (
                <div style={{ marginTop: 40, textAlign: "left" }}>
                    <h3 style={{ fontSize: "1.1rem", fontWeight: 600, marginBottom: 16, color: "#1f2937" }}>
                        최신 글
                    </h3>
                    <div style={{ display: "grid", gap: 16 }}>
                        {recentPosts.map((post) => (
                            <PostCard key={post.slug} post={post} />
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
