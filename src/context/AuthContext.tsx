import { createContext, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";
import type { Session, User } from "@supabase/supabase-js";
import { supabase } from "../lib/supabase";
import type { UserRole } from "../lib/database.types";

interface AuthUser extends User {
  role?: UserRole;
}

interface AuthContextValue {
  user: AuthUser | null;
  session: Session | null;
  role: UserRole | null;
  isOwner: boolean;
  isWriter: boolean;
  isAdmin: boolean; // owner OR writer
  loading: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue>({
  user: null,
  session: null,
  role: null,
  isOwner: false,
  isWriter: false,
  isAdmin: false,
  loading: true,
  signOut: async () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [role, setRole] = useState<UserRole | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch extended role from our `users` table
  const fetchRole = async (userId: string): Promise<UserRole | null> => {
    for (let attempt = 0; attempt < 2; attempt++) {
      const { data, error } = await supabase
        .from("users")
        .select("role")
        .eq("id", userId)
        .maybeSingle();

      if (!error) {
        return (data?.role as UserRole) ?? null;
      }

      if (attempt === 0) {
        await new Promise((resolve) => setTimeout(resolve, 400));
        continue;
      }

      console.warn("Unable to load user role from public.users", {
        message: error.message,
        code: error.code,
        details: error.details,
        hint: error.hint,
      });
    }

    return null;
  };

  useEffect(() => {
    const syncSession = async (nextSession: Session | null) => {
      setLoading(true);
      setSession(nextSession);

      if (nextSession?.user) {
        const nextRole = await fetchRole(nextSession.user.id);
        setRole(nextRole);
      } else {
        setRole(null);
      }

      setLoading(false);
    };

    // Initial session
    supabase.auth
      .getSession()
      .then(({ data: { session } }) => syncSession(session))
      .catch(() => setLoading(false));

    // Listen to auth state changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      void syncSession(nextSession);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
    setSession(null);
    setRole(null);
  };

  const user = session?.user ?? null;
  const isOwner = role === "owner";
  const isWriter = role === "writer";
  const isAdmin = isOwner || isWriter;

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        role,
        isOwner,
        isWriter,
        isAdmin,
        loading,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  return useContext(AuthContext);
}
