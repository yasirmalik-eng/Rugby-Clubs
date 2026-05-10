import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";
import type { Database } from "../lib/database.types";
import { normalizeBlogPostMedia } from "../lib/blogMedia";

type BlogPost = Database["public"]["Tables"]["blog_posts"]["Row"];

export function useBlogPost(slug: string | undefined) {
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) {
      setPost(null);
      setLoading(false);
      return;
    }

    const fetchPost = async () => {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from("blog_posts")
        .select("*")
        .eq("slug", slug)
        .eq("is_published", true)
        .single();

      if (error) {
        setError(error.message);
      } else {
        setPost(normalizeBlogPostMedia(data));
      }
      setLoading(false);
    };

    fetchPost();
  }, [slug]);

  return { post, loading, error };
}
