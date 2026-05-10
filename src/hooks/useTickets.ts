import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";
import type { Database } from "../lib/database.types";

type Ticket = Database["public"]["Tables"]["tickets"]["Row"];

export function useTickets(fixtureId?: string | null) {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTickets = async () => {
      setLoading(true);
      setError(null);

      let query = supabase.from("tickets").select("*");

      if (fixtureId) {
        // Fixture-specific tickets
        query = query.eq("fixture_id", fixtureId);
      } else {
        // Season passes (no fixture)
        query = query.is("fixture_id", null).eq("type", "season_pass");
      }

      const { data, error } = await query;

      if (error) {
        setError(error.message);
      } else {
        setTickets(data ?? []);
      }
      setLoading(false);
    };

    fetchTickets();
  }, [fixtureId]);

  return { tickets, loading, error };
}
