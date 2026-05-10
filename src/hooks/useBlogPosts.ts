import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";
import { normalizeBlogPostMedia } from "../lib/blogMedia";

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  featured_image_url: string | null;
  published_at: string | null;
  is_published: boolean;
}

export function useBlogPosts(limit = 10, page = 0) {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      setError(null);

      const from = page * limit;
      const to = from + limit - 1;

      const { data, error, count } = await supabase
        .from("blog_posts")
        .select("id, title, slug, excerpt, featured_image_url, published_at, is_published", {
          count: "exact",
        })
        .eq("is_published", true)
        .order("published_at", { ascending: false })
        .range(from, to);

      if (error) {
        setError(error.message);
      } else {
        setPosts((data ?? []).map(normalizeBlogPostMedia));
        setTotal(count ?? 0);
      }
      setLoading(false);
    };

    fetchPosts();
  }, [limit, page]);

  return { posts, loading, error, total };
}
