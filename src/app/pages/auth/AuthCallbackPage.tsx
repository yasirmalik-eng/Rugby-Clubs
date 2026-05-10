import { useEffect } from "react";
import { useNavigate } from "react-router";
import { supabase } from "../../../lib/supabase";
import { Loader2 } from "lucide-react";

export function AuthCallbackPage() {
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) navigate("/admin");
      else navigate("/auth/login");
    });
  }, [navigate]);

  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <Loader2 className="w-10 h-10 text-red-500 animate-spin" />
    </div>
  );
}
