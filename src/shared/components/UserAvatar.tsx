import { getOptimizedImageUrl } from "@/shared/utils/cloudinary";
import { UserRound } from "lucide-react";

export type AvatarSize = "xs" | "sm" | "md" | "lg" | "xl";

interface UserAvatarProps {
  src?: string | null;
  name?: string | null;
  size?: AvatarSize;
  className?: string;
}

const sizeClasses: Record<AvatarSize, { container: string; text: string; icon: string; px: number }> = {
  xs: { container: "h-6 w-6 rounded-md", text: "text-[9px]", icon: "h-3.5 w-3.5", px: 48 },
  sm: { container: "h-8 w-8 rounded-lg", text: "text-[11px]", icon: "h-4 w-4", px: 64 },
  md: { container: "h-10 w-10 rounded-xl", text: "text-xs", icon: "h-5 w-5", px: 80 },
  lg: { container: "h-16 w-16 rounded-2xl", text: "text-base", icon: "h-8 w-8", px: 128 },
  xl: { container: "h-20 w-20 rounded-full", text: "text-lg", icon: "h-10 w-10", px: 160 },
};

export function UserAvatar({
  src,
  name,
  size = "md",
  className = "",
}: UserAvatarProps) {
  const config = sizeClasses[size] || sizeClasses.md;

  const initials = (name || "U")
    .trim()
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const optimizedSrc = src ? getOptimizedImageUrl(src, { width: config.px, height: config.px }) : null;

  return (
    <div
      className={`flex shrink-0 items-center justify-center overflow-hidden font-black text-white shadow-xs ${config.container} ${className}`}
      style={{
        background: "linear-gradient(135deg, #3C65F5 0%, #6366f1 100%)",
      }}
    >
      {optimizedSrc ? (
        <img
          src={optimizedSrc}
          alt={name || "User avatar"}
          className="h-full w-full object-cover"
          onError={(e) => {
            // Fallback if image fails to load
            (e.target as HTMLElement).style.display = "none";
          }}
        />
      ) : name ? (
        <span className={config.text}>{initials}</span>
      ) : (
        <UserRound className={`${config.icon} text-white/80`} />
      )}
    </div>
  );
}
