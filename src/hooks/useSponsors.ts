import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import type { Database } from "../lib/database.types";

type Sponsor = Database["public"]["Tables"]["sponsors"]["Row"];

export function useSponsors() {
  const [sponsors, setSponsors] = useState<Sponsor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSponsors = async () => {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from("sponsors")
        .select("*")
        .eq("is_active", true)
        .order("tier")
        .order("sort_order");

      if (error) {
        setError(error.message);
      } else {
        setSponsors(data ?? []);
      }

      setLoading(false);
    };

    void fetchSponsors();
  }, []);

  return { sponsors, loading, error };
}
