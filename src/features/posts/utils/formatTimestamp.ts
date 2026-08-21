/**
 * Production timestamp formatting rules:
 * Just now → Xm ago → Xh ago → Yesterday → Xd ago → date.
 */

export function formatPostTimestamp(dateString?: string | Date): string {
  if (!dateString) return "";
  try {
    const date = typeof dateString === "string" ? new Date(dateString) : dateString;
    if (isNaN(date.getTime())) return "";

    const now = new Date();
    const diffMs = now.getTime() - date.getTime();

    // Future dates or negative diff
    if (diffMs < 0) return "Just now";

    const diffSecs = Math.floor(diffMs / 1000);
    const diffMins = Math.floor(diffSecs / 60);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    // Rule 1: Less than 1 minute
    if (diffSecs < 60) {
      return "Just now";
    }

    // Rule 2: Less than 60 minutes
    if (diffMins < 60) {
      return `${diffMins}m ago`;
    }

    // Check calendar days
    const isToday =
      date.getDate() === now.getDate() &&
      date.getMonth() === now.getMonth() &&
      date.getFullYear() === now.getFullYear();

    // Rule 3: Within today (< 24 hours)
    if (isToday || diffHours < 24) {
      return `${diffHours}h ago`;
    }

    // Rule 4: Yesterday
    const yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);
    const isYesterday =
      date.getDate() === yesterday.getDate() &&
      date.getMonth() === yesterday.getMonth() &&
      date.getFullYear() === yesterday.getFullYear();

    if (isYesterday || diffDays === 1) {
      return "Yesterday";
    }

    // Rule 5: 2 to 6 days ago
    if (diffDays < 7) {
      return `${diffDays}d ago`;
    }

    // Rule 6: Date (same year vs different year)
    const isSameYear = date.getFullYear() === now.getFullYear();
    if (isSameYear) {
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
    }

    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  } catch {
    return "";
  }
}

/**
 * Returns full localized timestamp for accessible tooltips and title attributes.
 * Example: "Friday, August 21, 2026 at 3:05 PM"
 */
export function formatExactTimestamp(dateString?: string | Date): string {
  if (!dateString) return "";
  try {
    const date = typeof dateString === "string" ? new Date(dateString) : dateString;
    if (isNaN(date.getTime())) return "";

    return date.toLocaleString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  } catch {
    return "";
  }
}
