const ABSOLUTE_URL_PATTERN = /^(?:https?:)?\/\//i;
const DATA_OR_BLOB_PATTERN = /^(?:data|blob):/i;
const IMAGE_FILE_PATTERN = /\.(?:avif|gif|jpe?g|png|svg|webp)(?:[?#].*)?$/i;

function getSupabaseOrigin() {
  const url = import.meta.env.VITE_SUPABASE_URL as string | undefined;
  return url?.replace(/\/+$/, "") ?? "";
}

export function resolveBlogImageUrl(value: string | null | undefined) {
  const trimmed = value?.trim();

  if (!trimmed) return null;
  if (ABSOLUTE_URL_PATTERN.test(trimmed) || DATA_OR_BLOB_PATTERN.test(trimmed)) return trimmed;
  if (trimmed.startsWith("/")) return trimmed;

  const supabaseOrigin = getSupabaseOrigin();
  if (!supabaseOrigin) return trimmed;

  if (trimmed.startsWith("storage/v1/")) {
    return `${supabaseOrigin}/${trimmed}`;
  }

  if (trimmed.startsWith("public/")) {
    return `${supabaseOrigin}/storage/v1/object/${trimmed}`;
  }

  const looksLikeStoragePath =
    trimmed.includes("/") &&
    !trimmed.startsWith("./") &&
    !trimmed.startsWith("../") &&
    (IMAGE_FILE_PATTERN.test(trimmed) || trimmed.split("/").length >= 2);

  if (looksLikeStoragePath) {
    return `${supabaseOrigin}/storage/v1/object/public/${trimmed.replace(/^\/+/, "")}`;
  }

  return trimmed;
}

export function normalizeBlogHtmlContent(html: string | null | undefined) {
  if (!html) return html ?? "";

  return html.replace(/(<img\b[^>]*\bsrc=["'])([^"']+)(["'][^>]*>)/gi, (_match, prefix: string, src: string, suffix: string) => {
    const resolvedSrc = resolveBlogImageUrl(src);
    return resolvedSrc ? `${prefix}${resolvedSrc}${suffix}` : `${prefix}${src}${suffix}`;
  });
}

type BlogMediaFields = {
  featured_image_url: string | null;
  content?: string;
};

export function normalizeBlogPostMedia<T extends BlogMediaFields>(post: T): T {
  return {
    ...post,
    featured_image_url: resolveBlogImageUrl(post.featured_image_url),
    ...(typeof post.content === "string" ? { content: normalizeBlogHtmlContent(post.content) } : {}),
  };
}
