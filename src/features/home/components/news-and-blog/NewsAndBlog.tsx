import { useState } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { usePublicBlogs } from "@/features/blog/hooks/usePublicBlogs";
import BlogCard from "./BlogCard";
import BlogCardSkeleton from "@/features/blog/components/BlogCardSkeleton";

export default function NewsAndBlog() {
  const [startIndex, setStartIndex] = useState(0);

  // Fetch published blogs from API
  const { data, isLoading } = usePublicBlogs({ limit: 6, sort: "newest" });
  const posts = data?.items ?? [];
  const total = posts.length;

  // Derive up to 3 visible cards circularly from startIndex
  const visibleCount = Math.min(3, total);
  const visiblePosts = total > 0
    ? Array.from(
        { length: visibleCount },
        (_, i) => posts[(startIndex + i) % total]
      )
    : [];

  const handlePrev = () => {
    if (total <= 1) return;
    setStartIndex((prev) => (prev - 1 + total) % total);
  };

  const handleNext = () => {
    if (total <= 1) return;
    setStartIndex((prev) => (prev + 1) % total);
  };

  return (
    <section className="section-box mt-[50px] mb-[50px] bg-white dark:bg-[#0B132B]">
      <div className="container mx-auto max-w-[1140px] px-[12px]">
        {/* ── Section Header ── */}
        <div className="relative text-center">
          <h2 className="section-title mb-[10px] font-['Plus_Jakarta_Sans',sans-serif] text-[36px] font-bold leading-[45px] text-[#05264E] dark:text-[#F1F5F9]">
            News and Blog
          </h2>
          <p className="font-lg color-text-paragraph-2 font-['Plus_Jakarta_Sans',sans-serif] text-[18px] font-normal leading-[26px] text-[#66789C] dark:text-slate-400">
            Get the latest news, updates and tips
          </p>

          {/* Arrow Controls */}
          {total > 3 && (
            <div className="absolute right-0 top-1/2 -translate-y-1/2 hidden sm:flex items-center gap-2">
              <button
                type="button"
                aria-label="Previous blog posts"
                onClick={handlePrev}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-[#E0E6F7] bg-white text-[#66789C] transition-all duration-200 hover:border-[#3C65F5] hover:bg-[#3C65F5] hover:text-white dark:border-[#1E293B] dark:bg-[#131D2E] dark:hover:border-[#3C65F5]"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                type="button"
                aria-label="Next blog posts"
                onClick={handleNext}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-[#E0E6F7] bg-white text-[#66789C] transition-all duration-200 hover:border-[#3C65F5] hover:bg-[#3C65F5] hover:text-white dark:border-[#1E293B] dark:bg-[#131D2E] dark:hover:border-[#3C65F5]"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>

        {/* ── Blog Cards Grid / Skeletons ── */}
        {isLoading ? (
          <div className="mt-[40px] lg:mt-[50px] grid grid-cols-1 gap-[24px] sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <BlogCardSkeleton key={i} />
            ))}
          </div>
        ) : visiblePosts.length > 0 ? (
          <div
            key={startIndex}
            className="mt-[40px] lg:mt-[50px] grid grid-cols-1 gap-[24px] sm:grid-cols-2 lg:grid-cols-3"
            style={{ animation: "blogFadeIn 0.3s ease" }}
          >
            {visiblePosts.map((post) => (
              <BlogCard
                key={`${startIndex}-${post._id}`}
                post={post}
              />
            ))}
          </div>
        ) : (
          <div className="mt-[40px] rounded-2xl border border-dashed border-slate-200 p-12 text-center text-slate-500 dark:border-slate-800 dark:text-slate-400">
            No published blog posts yet. Check back soon!
          </div>
        )}

        {/* ── Load More Posts Button ── */}
        <div className="text-center mt-[40px] lg:mt-[50px]">
          <Link
            to="/blog"
            className="btn btn-brand-1 btn-icon-load hover-up group relative inline-flex h-[52px] items-center justify-center rounded-[8px] bg-[#05264E] pl-[42px] pr-[25px] font-['Plus_Jakarta_Sans',sans-serif] text-[14px] font-bold text-white transition-all duration-300 hover:bg-[#3C65F5] hover:shadow-[0_8px_20px_rgba(60,101,245,0.25)] hover:-translate-y-0.5 select-none"
          >
            {/* 8-dot fading circular loading icon matching JobBox template loading.svg */}
            <svg
              className="absolute left-[18px] top-1/2 -translate-y-1/2 h-[16px] w-[16px] text-white"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle cx="12" cy="3.5" r="2.2" fill="white" fillOpacity="1" />
              <circle cx="18.01" cy="5.99" r="2.2" fill="white" fillOpacity="0.875" />
              <circle cx="20.5" cy="12" r="2.2" fill="white" fillOpacity="0.75" />
              <circle cx="18.01" cy="18.01" r="2.2" fill="white" fillOpacity="0.625" />
              <circle cx="12" cy="20.5" r="2.2" fill="white" fillOpacity="0.5" />
              <circle cx="5.99" cy="18.01" r="2.2" fill="white" fillOpacity="0.375" />
              <circle cx="3.5" cy="12" r="2.2" fill="white" fillOpacity="0.25" />
              <circle cx="5.99" cy="5.99" r="2.2" fill="white" fillOpacity="0.125" />
            </svg>
            <span>Load More Posts</span>
          </Link>
        </div>
      </div>

      {/* Carousel fade-in keyframe — scoped inline to avoid global CSS changes */}
      <style>{`
        @keyframes blogFadeIn {
          from { opacity: 0; transform: translateY(6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </section>
  );
}
