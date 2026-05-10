import { Navigate, Outlet, Link, useLocation } from "react-router";
import { useAuth } from "../../../context/AuthContext";
import { Loader2, LayoutDashboard, Calendar, Newspaper, Ticket, ShoppingBag, LogOut, Shield, Trophy } from "lucide-react";

const ownerLinks = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { to: "/admin/fixtures", label: "Fixtures", icon: Calendar },
  { to: "/admin/blog", label: "Blog", icon: Newspaper },
  { to: "/admin/tickets", label: "Tickets", icon: Ticket },
  { to: "/admin/sponsors", label: "Sponsors", icon: Trophy },
  { to: "/admin/orders", label: "Orders", icon: ShoppingBag },
];

const writerLinks = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { to: "/admin/blog", label: "Blog", icon: Newspaper },
];

export function AdminLayout() {
  const { user, isAdmin, isOwner, loading, signOut } = useAuth();
  const location = useLocation();

  if (loading) return <div className="min-h-screen bg-zinc-950 flex items-center justify-center"><Loader2 className="w-8 h-8 text-red-500 animate-spin" /></div>;
  if (!user) return <Navigate to="/auth/login" replace />;
  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-black border border-white/10 rounded-2xl p-8 text-center">
          <div className="w-12 h-12 mx-auto mb-4 bg-red-900/30 border border-red-700 rounded-xl flex items-center justify-center">
            <Shield className="w-6 h-6 text-red-400" />
          </div>
          <h1 className="text-2xl font-black text-white mb-2">Admin Access Required</h1>
          <p className="text-sm text-gray-400 mb-6">
            This account is signed in, but it does not currently have an admin role in Supabase.
          </p>
          <div className="text-xs text-gray-500 mb-6 break-all">{user.email}</div>
          <button onClick={signOut} className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-semibold text-red-400 bg-red-900/20 hover:bg-red-900/30 transition-colors">
            <LogOut className="w-4 h-4" /> Sign Out
          </button>
        </div>
      </div>
    );
  }

  const links = isOwner ? ownerLinks : writerLinks;

  const isActive = (to: string, exact?: boolean) =>
    exact ? location.pathname === to : location.pathname.startsWith(to) && to !== "/admin" || (to === "/admin" && location.pathname === "/admin");

  return (
    <div className="min-h-screen bg-zinc-950">
      {/* Sidebar */}
      <aside className="border-b border-white/10 bg-black/95 lg:fixed lg:inset-y-0 lg:left-0 lg:z-30 lg:h-screen lg:w-72 lg:border-b-0 lg:border-r">
        <div className="flex h-full flex-col">
        <div className="border-b border-white/10 px-5 py-5 lg:px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-red-700/60 bg-red-900/30">
              <Shield className="w-5 h-5 text-red-400" />
            </div>
            <div>
              <div className="text-sm font-black text-white">NWC Admin</div>
              <div className="text-xs capitalize text-gray-500">{isOwner ? "Owner workspace" : "Writer workspace"}</div>
            </div>
          </div>
        </div>

        <nav className="flex-1 overflow-x-hidden overflow-y-auto px-3 py-4 lg:px-4">
          <div className="space-y-1">
          {links.map((link) => {
            const active = isActive(link.to, link.exact);
            return (
              <Link key={link.to} to={link.to} className={`flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold transition-all ${active ? "border border-red-700/50 bg-red-800/30 text-white shadow-[0_10px_30px_rgba(127,29,29,0.25)]" : "text-gray-400 hover:bg-white/5 hover:text-white"}`}>
                <link.icon className="h-4 w-4 flex-shrink-0" />
                {link.label}
              </Link>
            );
          })}
          </div>
        </nav>

        <div className="border-t border-white/10 p-4">
          <div className="mb-4 rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3">
            <div className="text-[11px] uppercase tracking-[0.22em] text-gray-500">Signed In</div>
            <div className="mt-1 truncate text-sm text-white">{user?.email}</div>
          </div>
          <button onClick={signOut} className="flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold text-red-400 transition-colors hover:bg-red-900/20">
            <LogOut className="w-4 h-4" /> Sign Out
          </button>
        </div>
        </div>
      </aside>

      {/* Main */}
      <main className="min-w-0 overflow-x-hidden lg:ml-72">
        <Outlet />
      </main>
    </div>
  );
}
