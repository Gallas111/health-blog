import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { GoogleAnalytics } from "@next/third-parties/google";
import Script from "next/script";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.wellnesstodays.com"),
  title: {
    template: "%s | 오늘도 건강",
    default: "오늘도 건강 — 증상·영양제·민간요법·생활건강 정보",
  },
  description: "두통, 위염, 감기 등 증상별 원인과 대처법, 영양제 효능·복용법, 검증된 민간요법, 생활건강 상식까지. 믿을 수 있는 건강 정보를 쉽게 알려드립니다.",
  openGraph: {
    title: "오늘도 건강 — 증상·영양제·민간요법·생활건강 정보",
    description: "증상별 원인과 대처법, 영양제 효능, 민간요법, 생활건강 상식까지 한 곳에서.",
    url: "https://www.wellnesstodays.com",
    siteName: "오늘도 건강",
    locale: "ko_KR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "오늘도 건강 — 증상·영양제·민간요법·생활건강 정보",
    description: "증상별 원인과 대처법, 영양제 효능, 민간요법, 생활건강 상식까지 한 곳에서.",
  },
  keywords: ["건강 정보", "증상 원인", "영양제 효능", "민간요법", "좋은 음식", "생활건강", "약국 정보", "비타민D", "감기 빨리 낫는 법", "오늘도 건강"],
  alternates: {
    canonical: "./",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "Lw3vEwx7HEpspbR9ngCB1weCGxbV-HivcnUNDnM7n00",
    other: {
      "google-adsense-account": "ca-pub-1022869499967960",
    },
  },
  icons: {
    icon: [
      { url: "/icon.svg", type: "image/svg+xml" },
      { url: "/logo.png", type: "image/png", sizes: "512x512" },
    ],
    shortcut: "/logo.png",
    apple: "/logo.png",
  },
};

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ScrollToTop from "@/components/ScrollToTop";
import GoogleAdSense from "@/components/GoogleAdSense";


import { getAllPosts } from "@/lib/mdx";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const gaId = process.env.NEXT_PUBLIC_GA_ID || "";

  // Transform posts for search (lightweight)
  const allPosts = getAllPosts();
  const searchPosts = allPosts.map(post => ({
    slug: post.slug,
    title: post.frontmatter.title,
    excerpt: post.frontmatter.description || "",
    category: post.frontmatter.category || "General",
    date: post.frontmatter.date
  }));

  return (
    <html lang="ko" suppressHydrationWarning>
      <body className={`${geistSans.variable} antialiased`}>
        <GoogleAdSense pId="ca-pub-1022869499967960" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              name: "오늘도 건강",
              url: "https://www.wellnesstodays.com",
              description: "증상별 건강정보, 영양제 효능, 민간요법, 생활건강 상식 — 믿을 수 있는 건강 정보",
              potentialAction: {
                "@type": "SearchAction",
                target: "https://www.wellnesstodays.com/search?q={search_term_string}",
                "query-input": "required name=search_term_string",
              },
            }),
          }}
        />
        <Header posts={searchPosts} />
        <main style={{ minHeight: 'calc(100vh - 200px)' }}>
          {children}
        </main>
        <Footer />
        <ScrollToTop />
        {process.env.NODE_ENV === "production" && gaId && <GoogleAnalytics gaId={gaId} />}
      </body>
    </html>
  );
}
