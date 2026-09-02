import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Search, Briefcase, ArrowRight, Image as ImageIcon } from "lucide-react";
import { useTrendingBlogs } from "../hooks/usePublicBlogs";
import type { PublicBlogItem } from "../types/blog.types";

import news1 from "@/assets/images/blog/news1.png";
import news2 from "@/assets/images/blog/news2.png";
import news3 from "@/assets/images/blog/news3.png";

interface BlogSidebarProps {
  searchQuery: string;
  onSearch: (query: string) => void;
  galleryPosts?: PublicBlogItem[];
}

function formatDate(dateStr?: string): string {
  if (!dateStr) return "";
  try {
    const d = new Date(dateStr);
    return isNaN(d.getTime())
      ? ""
      : d.toLocaleDateString("en-US", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        });
  } catch {
    return "";
  }
}

export default function BlogSidebar({
  searchQuery,
  onSearch,
  galleryPosts = [],
}: BlogSidebarProps) {
  const [searchInput, setSearchInput] = useState(searchQuery);
  const { data: trendingPosts = [], isLoading: isLoadingTrending } =
    useTrendingBlogs(4);

  useEffect(() => {
    setSearchInput(searchQuery);
  }, [searchQuery]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchInput.trim());
  };

  // Collect image URLs for gallery
  const galleryImages: { url: string; alt: string; slug: string }[] = [];
  galleryPosts.forEach((post) => {
    if (post.coverImageUrl && galleryImages.length < 6) {
      galleryImages.push({
        url: post.coverImageUrl,
        alt: post.coverImageAlt || post.title,
        slug: post.slug || post._id,
      });
    }
  });

  // Fallbacks if fewer than 6
  const fallbackImages = [news1, news2, news3, news1, news2, news3];
  while (galleryImages.length < 6) {
    const idx = galleryImages.length;
    galleryImages.push({
      url: fallbackImages[idx % fallbackImages.length],
      alt: "JobBox Gallery",
      slug: "",
    });
  }

  return (
    <aside className="space-y-[30px]">
      {/* ── 1. Search Box Widget ── */}
      <div className="rounded-[16px] border border-[rgba(6,18,36,0.1)] bg-white p-[24px] shadow-[0_4px_16px_rgba(6,18,36,0.03)] dark:border-[#1E293B] dark:bg-[#131D2E]">
        <h4 className="relative mb-[20px] pb-[12px] font-['Plus_Jakarta_Sans',sans-serif] text-[18px] font-bold text-[#05264E] dark:text-[#F1F5F9] after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-[35px] after:bg-[#3C65F5]">
          Search
        </h4>
        <form onSubmit={handleSearchSubmit} className="relative">
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search articles..."
            className="h-[46px] w-full rounded-[8px] border border-[#E0E6F7] bg-[#F8FAFD] pl-[16px] pr-[44px] font-['Plus_Jakarta_Sans',sans-serif] text-[14px] text-[#05264E] outline-none transition placeholder:text-[#A0ABB8] focus:border-[#3C65F5] focus:bg-white dark:border-[#1E293B] dark:bg-[#080E1A] dark:text-[#F1F5F9]"
          />
          <button
            type="submit"
            aria-label="Search"
            className="absolute right-0 top-0 flex h-[46px] w-[44px] items-center justify-center text-[#A0ABB8] transition hover:text-[#3C65F5]"
          >
            <Search className="h-4 w-4" />
          </button>
        </form>
      </div>

      {/* ── 2. Trending Now Widget ── */}
      <div className="rounded-[16px] border border-[rgba(6,18,36,0.1)] bg-white p-[24px] shadow-[0_4px_16px_rgba(6,18,36,0.03)] dark:border-[#1E293B] dark:bg-[#131D2E]">
        <h4 className="relative mb-[20px] pb-[12px] font-['Plus_Jakarta_Sans',sans-serif] text-[18px] font-bold text-[#05264E] dark:text-[#F1F5F9] after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-[35px] after:bg-[#3C65F5]">
          Trending Now
        </h4>

        {isLoadingTrending ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex gap-3 animate-pulse">
                <div className="h-[64px] w-[64px] shrink-0 rounded-[8px] bg-slate-200 dark:bg-slate-800" />
                <div className="flex-1 space-y-2 py-1">
                  <div className="h-3.5 w-full rounded bg-slate-200 dark:bg-slate-800" />
                  <div className="h-3 w-1/2 rounded bg-slate-100 dark:bg-slate-800/60" />
                </div>
              </div>
            ))}
          </div>
        ) : trendingPosts.length > 0 ? (
          <div className="space-y-[18px]">
            {trendingPosts.map((post) => {
              const postLink = `/blog/${post.slug || post._id}`;
              const postDate =
                formatDate(post.publishedAt) || formatDate(post.createdAt);

              return (
                <div
                  key={post._id}
                  className="group flex items-center gap-[14px] border-b border-[#F2F4F7] pb-[14px] last:border-0 last:pb-0 dark:border-[#1E293B]"
                >
                  <Link
                    to={postLink}
                    className="relative h-[64px] w-[64px] shrink-0 overflow-hidden rounded-[8px] bg-slate-100 dark:bg-slate-800"
                  >
                    {post.coverImageUrl ? (
                      <img
                        src={post.coverImageUrl}
                        alt={post.coverImageAlt || post.title}
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-slate-400">
                        <ImageIcon className="h-5 w-5 opacity-40" />
                      </div>
                    )}
                  </Link>

                  <div className="flex-1 min-w-0">
                    <h5 className="font-['Plus_Jakarta_Sans',sans-serif] text-[14px] font-bold leading-[20px] text-[#05264E] transition-colors group-hover:text-[#3C65F5] dark:text-[#F1F5F9] dark:group-hover:text-[#5E81FF] line-clamp-2">
                      <Link to={postLink}>{post.title}</Link>
                    </h5>
                    <div className="mt-1 flex items-center gap-2 text-[11px] text-[#A0ABB8] dark:text-slate-400">
                      <span>{postDate}</span>
                      {post.readingTime && (
                        <>
                          <span>•</span>
                          <span>{post.readingTime}m read</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-xs text-slate-500 dark:text-slate-400">
            No trending articles right now.
          </p>
        )}
      </div>

      {/* ── 3. Hiring Promotional Block ── */}
      <div className="relative overflow-hidden rounded-[16px] bg-linear-to-br from-[#05264E] to-[#133D7A] p-[28px] text-white shadow-[0_10px_25px_rgba(5,38,78,0.15)] select-none">
        {/* Subtle decorative circles */}
        <div className="absolute -right-6 -bottom-6 h-32 w-32 rounded-full bg-white/5 pointer-events-none" />
        <div className="absolute -left-4 -top-4 h-24 w-24 rounded-full bg-[#3C65F5]/20 pointer-events-none" />

        <div className="relative z-10">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-[#3C65F5] px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-white">
            <Briefcase className="h-3 w-3" />
            We Are Hiring
          </span>

          <h4 className="mt-3 font-['Plus_Jakarta_Sans',sans-serif] text-[20px] font-extrabold leading-[28px]">
            Looking for a Quality Job?
          </h4>

          <p className="mt-2 text-[13px] leading-[20px] text-slate-200">
            Explore thousands of verified job vacancies from leading tech, finance, and growth companies.
          </p>

          <Link
            to="/jobs"
            className="mt-5 inline-flex items-center gap-2 rounded-[8px] bg-white px-5 py-2.5 font-['Plus_Jakarta_Sans',sans-serif] text-[13px] font-bold text-[#05264E] shadow-sm transition hover:bg-[#3C65F5] hover:text-white"
          >
            <span>Explore Jobs</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>

      {/* ── 4. Gallery Widget ── */}
      <div className="rounded-[16px] border border-[rgba(6,18,36,0.1)] bg-white p-[24px] shadow-[0_4px_16px_rgba(6,18,36,0.03)] dark:border-[#1E293B] dark:bg-[#131D2E]">
        <h4 className="relative mb-[20px] pb-[12px] font-['Plus_Jakarta_Sans',sans-serif] text-[18px] font-bold text-[#05264E] dark:text-[#F1F5F9] after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-[35px] after:bg-[#3C65F5]">
          Gallery
        </h4>

        <div className="grid grid-cols-3 gap-[10px]">
          {galleryImages.map((img, i) => (
            <div
              key={i}
              className="group relative aspect-square overflow-hidden rounded-[8px] bg-slate-100 dark:bg-slate-800"
            >
              {img.slug ? (
                <Link to={`/blog/${img.slug}`} className="block h-full w-full">
                  <img
                    src={img.url}
                    alt={img.alt}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
                    loading="lazy"
                  />
                </Link>
              ) : (
                <img
                  src={img.url}
                  alt={img.alt}
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
                  loading="lazy"
                />
              )}
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
}
