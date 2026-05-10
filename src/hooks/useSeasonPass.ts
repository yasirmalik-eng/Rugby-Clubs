import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";
import { useAuth } from "../context/AuthContext";

interface SeasonPassStatus {
  hasPass: boolean;
  passId: string | null;
  loading: boolean;
}

export function useSeasonPass(): SeasonPassStatus {
  const { user } = useAuth();
  const [hasPass, setHasPass] = useState(false);
  const [passId, setPassId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setHasPass(false);
      setPassId(null);
      setLoading(false);
      return;
    }

    const check = async () => {
      setLoading(true);

      const { data } = await supabase
        .from("season_passes")
        .select("id, is_active")
        .eq("user_id", user.id)
        .eq("is_active", true)
        .limit(1)
        .maybeSingle();

      setHasPass(!!data);
      setPassId(data?.id ?? null);
      setLoading(false);
    };

    check();
  }, [user]);

  return { hasPass, passId, loading };
}
