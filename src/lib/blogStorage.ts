import { supabase } from "./supabase";

export const BLOG_IMAGE_BUCKET = "blog-images";

function sanitizeFileName(name: string) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9.]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export async function uploadBlogImage(file: File, userId: string) {
  const extension = file.name.includes(".") ? file.name.split(".").pop()?.toLowerCase() ?? "jpg" : "jpg";
  const safeBaseName = sanitizeFileName(file.name.replace(/\.[^.]+$/, "")) || "image";
  const path = `${userId}/${Date.now()}-${safeBaseName}.${extension}`;

  const { error: uploadError } = await supabase.storage.from(BLOG_IMAGE_BUCKET).upload(path, file, {
    cacheControl: "3600",
    upsert: false,
    contentType: file.type || undefined,
  });

  if (uploadError) {
    throw uploadError;
  }

  const { data } = supabase.storage.from(BLOG_IMAGE_BUCKET).getPublicUrl(path);
  return data.publicUrl;
}
