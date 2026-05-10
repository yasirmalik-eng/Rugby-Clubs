import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";
import type { Database } from "../lib/database.types";

type Fixture = Database["public"]["Tables"]["fixtures"]["Row"];

export function useFixtures(filter: "upcoming" | "past" | "all" = "upcoming") {
  const [fixtures, setFixtures] = useState<Fixture[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFixtures = async () => {
      setLoading(true);
      setError(null);

      let query = supabase
        .from("fixtures")
        .select("*")
        .order("match_date", { ascending: filter !== "past" });

      const today = new Date().toISOString().split("T")[0];

      if (filter === "upcoming") {
        query = query.gte("match_date", today);
      } else if (filter === "past") {
        query = query.lt("match_date", today);
      }

      const { data, error } = await query;

      if (error) {
        setError(error.message);
      } else {
        setFixtures(data ?? []);
      }
      setLoading(false);
    };

    fetchFixtures();
  }, [filter]);

  return { fixtures, loading, error };
}
