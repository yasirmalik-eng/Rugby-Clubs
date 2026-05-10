import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import type { Database } from "../lib/database.types";

type SponsorshipPackage = Database["public"]["Tables"]["sponsorship_packages"]["Row"];

export function useSponsorshipPackages() {
  const [packages, setPackages] = useState<SponsorshipPackage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPackages = async () => {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from("sponsorship_packages")
        .select("*")
        .eq("is_active", true)
        .order("sort_order");

      if (error) {
        setError(error.message);
      } else {
        setPackages(data ?? []);
      }

      setLoading(false);
    };

    void fetchPackages();
  }, []);

  return { packages, loading, error };
}
