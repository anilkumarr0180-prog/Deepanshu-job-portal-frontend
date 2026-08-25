import { useState, useEffect } from "react";
import { getOptimizedImageUrl } from "@/shared/utils/cloudinary";
import { UserRound } from "lucide-react";

export type AvatarSize = "xs" | "sm" | "md" | "lg" | "xl";

interface UserAvatarProps {
  src?: string | null;
  name?: string | null;
  size?: AvatarSize;
  className?: string;
}

const sizeClasses: Record<
  AvatarSize,
  { container: string; text: string; icon: string; px: number }
> = {
  xs: { container: "h-6 w-6 rounded-md", text: "text-[9px]", icon: "h-3.5 w-3.5", px: 96 },
  sm: { container: "h-8 w-8 rounded-lg", text: "text-[11px]", icon: "h-4 w-4", px: 128 },
  md: { container: "h-10 w-10 rounded-xl", text: "text-xs", icon: "h-5 w-5", px: 160 },
  lg: { container: "h-16 w-16 rounded-2xl", text: "text-base", icon: "h-8 w-8", px: 256 },
  xl: { container: "h-20 w-20 rounded-full", text: "text-lg", icon: "h-10 w-10", px: 320 },
};

export function UserAvatar({
  src,
  name,
  size = "md",
  className = "",
}: UserAvatarProps) {
  const [hasError, setHasError] = useState(false);
  const config = sizeClasses[size] || sizeClasses.md;

  // Reset error state if src changes
  useEffect(() => {
    setHasError(false);
  }, [src]);

  const initials = (name || "U")
    .trim()
    .split(" ")
    .filter(Boolean)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const optimizedSrc =
    src && !hasError
      ? getOptimizedImageUrl(src, { width: config.px, height: config.px, quality: "auto" })
      : null;

  const showImage = Boolean(optimizedSrc && !hasError);

  return (
    <div
      className={`relative flex shrink-0 items-center justify-center overflow-hidden font-black text-white border border-slate-200/80 dark:border-[#2A3850] shadow-xs select-none ${
        showImage ? "bg-slate-100 dark:bg-slate-800" : "bg-gradient-to-br from-[#3C65F5] to-[#6366f1]"
      } ${config.container} ${className}`}
    >
      {showImage ? (
        <img
          src={optimizedSrc!}
          alt={name ? `${name}'s avatar` : "User avatar"}
          loading="lazy"
          decoding="async"
          className="h-full w-full object-cover object-center"
          onError={() => setHasError(true)}
        />
      ) : name ? (
        <span className={`${config.text} tracking-tight font-extrabold`}>{initials}</span>
      ) : (
        <UserRound className={`${config.icon} text-white/80`} />
      )}
    </div>
  );
}
