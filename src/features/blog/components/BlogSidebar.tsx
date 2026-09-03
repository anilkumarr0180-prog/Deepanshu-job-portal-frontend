import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Search, Image as ImageIcon } from "lucide-react";
import { useTrendingBlogs } from "../hooks/usePublicBlogs";
import type { PublicBlogItem } from "../types/blog.types";

import bgRightHiring from "@/assets/images/jobs/bg-right-hiring.svg";
import news1 from "@/assets/images/blog/news1.png";
import news2 from "@/assets/images/blog/news2.png";
import news3 from "@/assets/images/blog/news3.png";

interface BlogSidebarProps {
  searchQuery: string;
  onSearch: (query: string) => void;
  galleryPosts?: PublicBlogItem[];
}

function formatShortDate(dateStr?: string): string {
  if (!dateStr) return "";
  try {
    const d = new Date(dateStr);
    return isNaN(d.getTime())
      ? ""
      : d.toLocaleDateString("en-US", {
          day: "numeric",
          month: "short",
        });
  } catch {
    return "";
  }
}

function getInitials(name?: string): string {
  if (!name) return "JB";
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
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

  // Collect image URLs for 3x3 Gallery (9 items)
  const galleryImages: { url: string; alt: string; slug: string }[] = [];
  galleryPosts.forEach((post) => {
    if (post.coverImageUrl && galleryImages.length < 9) {
      galleryImages.push({
        url: post.coverImageUrl,
        alt: post.coverImageAlt || post.title,
        slug: post.slug || post._id,
      });
    }
  });

  // Fallbacks if fewer than 9
  const fallbackImages = [news1, news2, news3, news1, news2, news3, news1, news2, news3];
  while (galleryImages.length < 9) {
    const idx = galleryImages.length;
    galleryImages.push({
      url: fallbackImages[idx % fallbackImages.length],
      alt: "JobBox Gallery",
      slug: "",
    });
  }

  return (
    <aside className="space-y-[30px]">
      {/* ── 1. Search Box Widget (JobBox widget_search: 64px height standalone search bar) ── */}
      <div className="widget_search mb-[30px]">
        <form onSubmit={handleSearchSubmit} className="relative block w-full">
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search"
            className="h-[64px] w-full rounded-[16px] border border-[#E0E6F7] bg-white pl-[24px] pr-[64px] font-['Plus_Jakarta_Sans',sans-serif] text-[14px] text-[#05264E] shadow-[0_4px_16px_rgba(6,18,36,0.03)] outline-none transition-all placeholder:text-[#8592A6] focus:border-[#3C65F5] focus:shadow-[0_4px_20px_rgba(60,101,245,0.08)] dark:border-[#1E293B] dark:bg-[#131D2E] dark:text-[#F1F5F9]"
          />
          <button
            type="submit"
            aria-label="Search"
            className="absolute right-0 top-0 flex h-[64px] w-[64px] items-center justify-center text-[#8592A6] transition hover:text-[#3C65F5]"
          >
            <Search className="h-5 w-5" />
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
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex items-center gap-[15px] animate-pulse">
                <div className="h-[70px] w-[70px] shrink-0 rounded-[8px] bg-slate-200 dark:bg-slate-800" />
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
                formatShortDate(post.publishedAt) || formatShortDate(post.createdAt);

              const authorName =
                typeof post.authorId === "object" && post.authorId !== null
                  ? post.authorId.name
                  : "JobBox Team";

              const authorAvatar =
                typeof post.authorId === "object" && post.authorId !== null
                  ? post.authorId.profilePicture
                  : undefined;

              return (
                <div
                  key={post._id}
                  className="post-list-small-item group flex items-center gap-[15px] border-b border-[#F2F4F7] pb-[16px] last:border-0 last:pb-0 dark:border-[#1E293B]"
                >
                  {/* Thumbnail (70px x 70px) */}
                  <Link
                    to={postLink}
                    className="relative h-[70px] w-[70px] shrink-0 overflow-hidden rounded-[8px] bg-slate-100 dark:bg-slate-800"
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

                  {/* Content */}
                  <div className="content flex-1 min-w-0">
                    <h5 className="font-['Plus_Jakarta_Sans',sans-serif] text-[14px] font-bold leading-[19px] text-[#05264E] transition-colors group-hover:text-[#3C65F5] dark:text-[#F1F5F9] dark:group-hover:text-[#5E81FF] line-clamp-2">
                      <Link to={postLink}>{post.title}</Link>
                    </h5>

                    {/* Author & Date Row (DevTools: 30x30 avatar, author name, date) */}
                    <div className="mt-[6px] flex items-center gap-2">
                      <div className="flex items-center gap-1.5 min-w-0">
                        {authorAvatar ? (
                          <img
                            src={authorAvatar}
                            alt={authorName}
                            className="h-[24px] w-[24px] shrink-0 rounded-full object-cover border border-slate-200 dark:border-slate-700"
                          />
                        ) : (
                          <div className="flex h-[24px] w-[24px] shrink-0 items-center justify-center rounded-full bg-blue-100 font-['Plus_Jakarta_Sans',sans-serif] text-[10px] font-bold text-[#3C65F5] dark:bg-[#1E293B] dark:text-[#5E81FF]">
                            {getInitials(authorName)}
                          </div>
                        )}
                        <span className="font-['Plus_Jakarta_Sans',sans-serif] text-[12px] font-medium text-[#66789C] dark:text-slate-300 truncate max-w-[80px]">
                          {authorName}
                        </span>
                      </div>

                      {postDate && (
                        <span className="font-['Plus_Jakarta_Sans',sans-serif] text-[12px] text-[#A0ABB8] dark:text-slate-400 shrink-0">
                          {postDate}
                        </span>
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

      {/* ── 3. We Are Hiring Promotional Widget (sidebar-border-bg bg-right) ── */}
      <div className="sidebar-border-bg bg-right relative mb-[40px] min-h-[455px] overflow-hidden rounded-[16px] border border-[#E0E6F7] bg-[#F2F6FD] px-[40px] pt-[30px] pb-[260px] shadow-[0_4px_16px_rgba(6,18,36,0.03)] select-none dark:border-[#1E293B] dark:bg-[#131D2E]">
        <div className="relative z-10">
          <span className="text-grey block font-['Plus_Jakarta_Sans',sans-serif] text-[24px] font-bold leading-tight text-[#B4C0E0]">
            WE ARE
          </span>
          <span className="text-hiring block font-['Plus_Jakarta_Sans',sans-serif] text-[36px] font-bold leading-tight text-[#66789C] -mt-[5px]">
            HIRING
          </span>

          <p className="font-xxs color-text-paragraph mt-[5px] font-['Plus_Jakarta_Sans',sans-serif] text-[10px] leading-[16px] text-[#4F5E64] dark:text-slate-400">
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Recusandae architecto
          </p>

          <div className="mt-[15px]">
            <Link
              to="/jobs"
              className="inline-block"
            >
              <span className="btn btn-paragraph-2 inline-block rounded-[4px] bg-[#66789C] px-[16px] py-[8px] font-['Plus_Jakarta_Sans',sans-serif] text-[11px] font-semibold text-white transition-colors duration-200 hover:bg-[#3C65F5]">
                Know More
              </span>
            </Link>
          </div>
        </div>

        {/* Bottom Illustration in 260px padded area */}
        <div className="pointer-events-none absolute right-0 bottom-0 left-0 flex justify-center">
          <img
            src={bgRightHiring}
            alt="We Are Hiring"
            className="h-auto w-full max-w-[240px] object-contain"
          />
        </div>
      </div>

      {/* ── 4. Gallery Widget (JobBox sidebar-shadow sidebar-news-small) ── */}
      <div className="sidebar-shadow sidebar-news-small mb-[40px] rounded-[16px] border border-[rgba(6,18,36,0.1)] bg-white p-[25px] shadow-[0_4px_16px_rgba(6,18,36,0.03)] dark:border-[#1E293B] dark:bg-[#131D2E]">
        <h5 className="sidebar-title relative mb-[30px] pb-[10px] font-['Plus_Jakarta_Sans',sans-serif] text-[20px] font-bold text-[#05264E] dark:text-[#F1F5F9] after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-[35px] after:bg-[#3C65F5]">
          Gallery
        </h5>

        <div className="post-list-small">
          <ul className="gallery-3 grid grid-cols-3 gap-[10px]">
            {galleryImages.map((img, i) => (
              <li
                key={i}
                className="group relative aspect-square h-[82px] w-[82px] max-w-full overflow-hidden rounded-[8px] bg-slate-100 dark:bg-slate-800"
              >
                {img.slug ? (
                  <Link to={`/blog/${img.slug}`} className="block h-full w-full">
                    <img
                      src={img.url}
                      alt={img.alt}
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110 rounded-[8px]"
                      loading="lazy"
                    />
                  </Link>
                ) : (
                  <img
                    src={img.url}
                    alt={img.alt}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110 rounded-[8px]"
                    loading="lazy"
                  />
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </aside>
  );
}
