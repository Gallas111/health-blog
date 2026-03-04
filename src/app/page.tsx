import Hero from "@/components/Hero";
import PostCard from "@/components/PostCard";
import CategorySection from "@/components/CategorySection";
import FeaturedPosts from "@/components/FeaturedPosts";
import styles from "./page.module.css";
import { getPostsByCategory, getAllPosts } from "@/lib/mdx";
import { CATEGORY_LIST } from "@/lib/categories";
import { categoryDescriptions } from "@/lib/categoryDescriptions";
import Link from "next/link";

export default function Home() {
  // Define the order of Topic Clusters to display
  const topicOrder = [
    "symptoms",
    "home-remedies",
    "supplements",
    "daily-health",
    "pharmacy-guide"
  ];

  const allPosts = getAllPosts();
  console.log(`[Home] Total posts loaded: ${allPosts.length}`);

  return (
    <div className={`${styles.page} fade-in`}>
      <Hero />

      {/* Featured Posts Section */}
      <FeaturedPosts />

      {/* Topic Clusters Section */}
      <div className="space-y-20 py-10">
        {topicOrder.map((slug) => {
          // Find category info
          const category = CATEGORY_LIST.find(c => c.slug === slug);
          const richInfo = categoryDescriptions[slug];

          if (!category || !richInfo) {
            console.warn(`[Home] Missing data for slug: ${slug}`);
            return null;
          }

          // Get latest posts for this cluster
          const categoryPosts = getPostsByCategory(category.folderName);
          console.log(`[Home] Category: ${category.name}, Posts: ${categoryPosts.length}`);

          if (categoryPosts.length === 0) {
            return null;
          }

          return (
            <CategorySection
              key={slug}
              id={slug}
              title={category.name}
              description={richInfo.description}
              icon={category.icon}
              posts={categoryPosts}
            />
          );
        })}
      </div>
    </div>
  );
}
