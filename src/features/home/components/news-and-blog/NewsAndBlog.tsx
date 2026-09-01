import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronRight, RotateCcw } from "lucide-react";

import { BLOG_POSTS } from "./blogData";
import BlogCard from "./BlogCard";

export default function NewsAndBlog() {
  const navigate = useNavigate();
  const [startIndex, setStartIndex] = useState(0);

  const total = BLOG_POSTS.length;

  // Derive the 3 visible cards circularly from startIndex
  const visiblePosts = Array.from(
    { length: 3 },
    (_, i) => BLOG_POSTS[(startIndex + i) % total]
  );

  const handlePrev = () =>
    setStartIndex((prev) => (prev - 1 + total) % total);

  const handleNext = () =>
    setStartIndex((prev) => (prev + 1) % total);

  return (
    <section className="bg-white dark:bg-[#0B1220] py-10 sm:py-12">
      <div className="mx-auto max-w-[1160px] px-4 sm:px-6 lg:px-8">

        {/* ── Section Header — heading truly centered, arrows absolutely right ── */}
        <div className="relative mb-8 text-center">
          <h2 className="text-[32px] font-extrabold tracking-tight text-[#05264E] dark:text-[#F1F5F9]">
            News and Blog
          </h2>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            Get the latest news, updates and tips
          </p>

          {/* Arrow Controls — circular carousel navigation */}
          <div className="absolute right-0 top-1/2 -translate-y-1/2 flex items-center gap-2">
            <button
              type="button"
              aria-label="Previous blog posts"
              onClick={handlePrev}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-[#E0E6F7] bg-white text-[#66789C] transition-colors duration-150 hover:border-[#3C65F5] hover:text-[#3C65F5] dark:border-[#1E293B] dark:bg-[#131D2E] dark:hover:border-[#3C65F5]"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              type="button"
              aria-label="Next blog posts"
              onClick={handleNext}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-[#E0E6F7] bg-white text-[#66789C] transition-colors duration-150 hover:border-[#3C65F5] hover:text-[#3C65F5] dark:border-[#1E293B] dark:bg-[#131D2E] dark:hover:border-[#3C65F5]"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* ── Blog Cards Grid — circular 3-up carousel ── */}
        <div
          key={startIndex}
          className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
          style={{ animation: "blogFadeIn 0.3s ease" }}
        >
          {visiblePosts.map((post, index) => (
            <BlogCard
              key={`${startIndex}-${post.id}`}
              post={post}
              featured={index === 1}
            />
          ))}
        </div>

        {/* ── Load More Posts Button ── */}
        <div className="mt-10 flex justify-center">
          <button
            type="button"
            onClick={() => navigate("/blog")}
            className="inline-flex items-center gap-2 rounded-md bg-[#05264E] px-7 py-3 text-[14px] font-semibold text-white transition-colors duration-200 hover:bg-[#3C65F5] dark:bg-[#1E293B] dark:hover:bg-[#3C65F5]"
          >
            <RotateCcw className="h-[15px] w-[15px]" />
            Load More Posts
          </button>
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


