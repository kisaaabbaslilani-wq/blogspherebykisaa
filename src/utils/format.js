// Format a Firestore Timestamp (or Date / millis) into a readable date.
export function formatDate(value) {
  if (!value) return "";
  const date =
    typeof value?.toDate === "function"
      ? value.toDate()
      : value instanceof Date
      ? value
      : new Date(value);

  if (Number.isNaN(date.getTime())) return "";

  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

// First letter for avatar initials.
export function initial(text) {
  return (text || "?").trim().charAt(0).toUpperCase();
}

// Strip HTML tags down to plain text (for previews / word counts).
export function stripHtml(html = "") {
  return html
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

// Rough reading time from word count.
export function readTime(content = "") {
  const words = stripHtml(content).split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}
