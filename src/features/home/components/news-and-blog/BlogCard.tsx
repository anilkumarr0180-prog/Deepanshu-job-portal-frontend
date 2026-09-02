import { Link } from "react-router-dom";
import type { BlogPost } from "./blogData";

interface BlogCardProps {
  post: BlogPost;
}

export default function BlogCard({ post }: BlogCardProps) {
  const { id, image, imageAlt, category, title, description, authorName, authorInitials, date, readTime } = post;

  return (
    <Link
      to={`/blog/${id}`}
      className="card-grid-3 hover-up group flex h-full flex-col overflow-hidden rounded-[16px] border border-[rgba(6,18,36,0.1)] bg-white transition-all duration-300 hover:border-[#3C65F5] hover:shadow-[0_10px_25px_rgba(6,18,36,0.06)] hover:-translate-y-1 dark:border-[#1E293B] dark:bg-[#131D2E] select-none"
    >
      {/* Image Container with 10px outer padding matching JobBox card-grid-3-image */}
      <div className="card-grid-3-image w-full p-[10px]">
        <figure className="relative h-[210px] w-full overflow-hidden rounded-[12px]">
          <img
            src={image}
            alt={imageAlt}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105 rounded-[12px]"
            loading="lazy"
          />
        </figure>
      </div>

      {/* Card Body Info */}
      <div className="card-block-info flex flex-1 flex-col px-[20px] pb-[20px] pt-[10px]">
        {/* Category Badge */}
        <div className="tags-mb mb-[12px]">
          <span className="inline-block rounded-[6px] bg-[#EFF3FC] px-[12px] py-[4px] font-['Plus_Jakarta_Sans',sans-serif] text-[12px] font-bold text-[#3C65F5] dark:bg-[#1E293B] dark:text-[#5E81FF]">
            {category}
          </span>
        </div>

        {/* Blog Title: 20px font-bold */}
        <h5 className="font-['Plus_Jakarta_Sans',sans-serif] text-[20px] font-bold leading-[28px] text-[#05264E] transition-colors group-hover:text-[#3C65F5] dark:text-[#F1F5F9] dark:group-hover:text-[#5E81FF] line-clamp-2 min-h-[56px]">
          {title}
        </h5>

        {/* Blog Description */}
        <p className="mt-[10px] mb-[15px] font-['Plus_Jakarta_Sans',sans-serif] text-[14px] leading-[22px] text-[#4F5E64] dark:text-slate-400 line-clamp-3 flex-1">
          {description}
        </p>

        {/* Author + Reading Time row */}
        <div className="card-2-bottom mt-auto flex items-center justify-between border-t border-[#E0E6F7] pt-[15px] dark:border-[#1E293B]">
          {/* Author info */}
          <div className="flex items-center gap-[10px]">
            <div className="flex h-[36px] w-[36px] shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#EBF1FD] font-['Plus_Jakarta_Sans',sans-serif] text-[12px] font-bold text-[#3C65F5] dark:bg-[#1E293B] dark:text-[#5E81FF]">
              <span>{authorInitials}</span>
            </div>
            <div className="flex flex-col">
              <span className="font-['Plus_Jakarta_Sans',sans-serif] text-[13px] font-bold leading-[18px] text-[#05264E] dark:text-[#F1F5F9]">
                {authorName}
              </span>
              <span className="font-['Plus_Jakarta_Sans',sans-serif] text-[11px] leading-[16px] text-[#A0ABB8] dark:text-slate-400">
                {date}
              </span>
            </div>
          </div>

          {/* Reading time */}
          <span className="font-['Plus_Jakarta_Sans',sans-serif] text-[12px] font-medium text-[#A0ABB8] dark:text-slate-400">
            {readTime}
          </span>
        </div>
      </div>
    </Link>
  );
}
