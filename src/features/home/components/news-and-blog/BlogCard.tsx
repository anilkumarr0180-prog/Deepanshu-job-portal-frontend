import type { BlogPost } from "./blogData";

interface BlogCardProps {
  post: BlogPost;
  /** Second card gets blue title treatment to match reference */
  featured?: boolean;
}

export default function BlogCard({ post, featured = false }: BlogCardProps) {
  const { image, imageAlt, category, title, description, authorName, authorInitials, date, readTime } = post;

  return (
    <article className="group flex flex-col overflow-hidden rounded-xl border border-[#E0E6F7] bg-white transition-all duration-200 hover:border-[#B0C4F8] hover:shadow-[0_4px_20px_rgba(60,101,245,0.10)] dark:border-[#1E293B] dark:bg-[#131D2E] dark:hover:border-[#3C65F5]/40">
      {/* ── Blog Image ── */}
      <div className="relative w-full overflow-hidden" style={{ paddingBottom: "60%" }}>
        <img
          src={image}
          alt={imageAlt}
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
          loading="lazy"
        />
      </div>

      {/* ── Card Body ── */}
      <div className="flex flex-1 flex-col px-4 pb-4 pt-3.5">
        {/* Category Badge */}
        <span className="mb-3 inline-flex w-fit items-center rounded-md border border-[#E0E6F7] bg-white px-3 py-[5px] text-[12px] font-semibold leading-none text-[#66789C] dark:border-[#1E293B] dark:bg-[#0B1220] dark:text-slate-400">
          {category}
        </span>

        {/* Blog Title */}
        <h3
          className={`mb-2.5 text-[18px] font-bold leading-snug ${
            featured
              ? "text-[#3C65F5] dark:text-[#5E81FF]"
              : "text-[#05264E] dark:text-[#F1F5F9]"
          }`}
        >
          {title}
        </h3>

        {/* Blog Description — line-clamped to 3 lines */}
        <p
          className="mb-4 flex-1 text-[13px] leading-[1.6] text-[#4F5E64] dark:text-slate-400"
          style={{
            display: "-webkit-box",
            WebkitLineClamp: 3,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          {description}
        </p>

        {/* ── Author + Reading Time ── */}
        <div className="mt-auto flex items-center justify-between border-t border-[#E0E6F7] pt-3.5 dark:border-[#1E293B]">
          {/* Author Avatar + Name + Date */}
          <div className="flex items-center gap-2.5">
            {/* Avatar Circle with initials fallback */}
            <div className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#E8EFFE] text-[11px] font-bold text-[#3C65F5]">
              <span>{authorInitials}</span>
            </div>

            {/* Name + Date */}
            <div className="flex flex-col">
              <span className="text-[13px] font-semibold leading-tight text-[#05264E] dark:text-[#F1F5F9]">
                {authorName}
              </span>
              <span className="text-[12px] leading-tight text-[#66789C] dark:text-slate-400">
                {date}
              </span>
            </div>
          </div>

          {/* Reading Time */}
          <span className="text-[12px] leading-tight text-[#66789C] dark:text-slate-400">
            {readTime}
          </span>
        </div>
      </div>
    </article>
  );
}
