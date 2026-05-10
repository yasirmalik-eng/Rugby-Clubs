import { useEffect, useMemo, useState } from "react";
import { motion } from "motion/react";
import {
  ArrowUpRight,
  Calendar,
  FilePenLine,
  Loader2,
  MailOpen,
  Newspaper,
  PenSquare,
  ShoppingBag,
  TrendingUp,
} from "lucide-react";
import { Link } from "react-router";
import { format } from "date-fns";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";
import { supabase } from "../../../lib/supabase";
import { useAuth } from "../../../context/AuthContext";
import { seedDynamicUiContent } from "../../../lib/contentSeeder";
import { toast } from "sonner";

type DashboardStats = {
  orders: number;
  revenue: number;
  fixtures: number;
  publishedPosts: number;
  draftPosts: number;
  totalPosts: number;
  recentPosts: number;
  unreadContacts: number;
};

type RevenuePoint = {
  label: string;
  revenue: number;
};

type ContentPoint = {
  label: string;
  published: number;
  drafts: number;
};

function formatMoney(value: number) {
  return `GBP ${(value / 100).toFixed(2)}`;
}

export function AdminDashboard() {
  const { isOwner, user } = useAuth();
  const [stats, setStats] = useState<DashboardStats>({
    orders: 0,
    revenue: 0,
    fixtures: 0,
    publishedPosts: 0,
    draftPosts: 0,
    totalPosts: 0,
    recentPosts: 0,
    unreadContacts: 0,
  });
  const [revenueData, setRevenueData] = useState<RevenuePoint[]>([]);
  const [contentData, setContentData] = useState<ContentPoint[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [importingContent, setImportingContent] = useState(false);

  const greeting = useMemo(() => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  }, []);

  const adminName = useMemo(() => {
    const metadata = user?.user_metadata as Record<string, unknown> | undefined;
    const nameCandidate =
      (typeof metadata?.full_name === "string" ? metadata.full_name : undefined) ??
      (typeof metadata?.name === "string" ? metadata.name : undefined) ??
      (typeof user?.email === "string" ? user.email.split("@")[0] : undefined) ??
      (isOwner ? "Owner" : "Writer");

    return nameCandidate.replace(/[._-]+/g, " ").replace(/\s+/g, " ").trim();
  }, [user, isOwner]);

  const todayLabel = useMemo(() => format(new Date(), "EEEE, d MMMM"), []);

  useEffect(() => {
    const loadDashboard = async () => {
      setLoading(true);
      setError(null);

      const now = new Date();
      const monthLabels = Array.from({ length: 6 }, (_, index) => {
        const date = new Date(now.getFullYear(), now.getMonth() - (5 - index), 1);
        return {
          key: `${date.getFullYear()}-${date.getMonth()}`,
          label: format(date, "MMM"),
        };
      });

      const queries = await Promise.all([
        supabase
          .from("orders")
          .select("id, total_amount_gbp, status, created_at, buyer_email, buyer_name")
          .order("created_at", { ascending: false }),
        supabase
          .from("fixtures")
          .select("id, match_date")
          .gte("match_date", now.toISOString().slice(0, 10)),
        supabase
          .from("blog_posts")
          .select("id, title, is_published, created_at, published_at")
          .order("created_at", { ascending: false }),
        isOwner
          ? supabase
              .from("contact_submissions")
              .select("id, is_read, created_at")
              .order("created_at", { ascending: false })
          : Promise.resolve({ data: [], error: null }),
      ]);

      const [ordersRes, fixturesRes, postsRes, contactsRes] = queries;
      const firstError = [
        ordersRes.error,
        fixturesRes.error,
        postsRes.error,
        contactsRes.error,
      ].find(Boolean);

      if (firstError) {
        setError(firstError.message);
      }

      const orders = ordersRes.data ?? [];
      const posts = postsRes.data ?? [];
      const contacts = contactsRes.data ?? [];
      const completedOrders = orders.filter((order) => order.status === "completed");
      const recentPostCutoff = new Date(now);
      recentPostCutoff.setDate(recentPostCutoff.getDate() - 30);

      setStats({
        orders: completedOrders.length,
        revenue: completedOrders.reduce((sum, order) => sum + order.total_amount_gbp, 0),
        fixtures: (fixturesRes.data ?? []).length,
        publishedPosts: posts.filter((post) => post.is_published).length,
        draftPosts: posts.filter((post) => !post.is_published).length,
        totalPosts: posts.length,
        recentPosts: posts.filter((post) => new Date(post.created_at) >= recentPostCutoff).length,
        unreadContacts: contacts.filter((contact) => !contact.is_read).length,
      });

      const revenueMap = new Map(monthLabels.map((month) => [month.key, { label: month.label, revenue: 0 }]));
      completedOrders.forEach((order) => {
        const created = new Date(order.created_at);
        const key = `${created.getFullYear()}-${created.getMonth()}`;
        const point = revenueMap.get(key);
        if (point) point.revenue += order.total_amount_gbp / 100;
      });
      setRevenueData(Array.from(revenueMap.values()));

      const contentMap = new Map(
        monthLabels.map((month) => [month.key, { label: month.label, published: 0, drafts: 0 }]),
      );
      posts.forEach((post) => {
        const source = new Date(post.published_at ?? post.created_at);
        const key = `${source.getFullYear()}-${source.getMonth()}`;
        const point = contentMap.get(key);
        if (!point) return;
        if (post.is_published) point.published += 1;
        else point.drafts += 1;
      });
      setContentData(Array.from(contentMap.values()));

      setLoading(false);
    };

    void loadDashboard();
  }, [isOwner]);

  const cards = useMemo(() => {
    if (isOwner) {
      return [
        {
          label: "Revenue",
          value: formatMoney(stats.revenue),
          note: "Total completed sales",
          icon: TrendingUp,
          link: "/admin/orders",
          tone: "text-emerald-300",
        },
        {
          label: "Orders",
          value: stats.orders.toString(),
          note: "Ticket orders completed",
          icon: ShoppingBag,
          link: "/admin/orders",
          tone: "text-rose-300",
        },
        {
          label: "Upcoming Fixtures",
          value: stats.fixtures.toString(),
          note: "Matches still ahead",
          icon: Calendar,
          link: "/admin/fixtures",
          tone: "text-sky-300",
        },
        {
          label: "Unread Messages",
          value: stats.unreadContacts.toString(),
          note: "Contact inbox still needs review",
          icon: MailOpen,
          link: "/admin/orders",
          tone: "text-amber-300",
        },
      ];
    }

    return [
      {
        label: "Total Articles",
        value: stats.totalPosts.toString(),
        note: "All stories in your workspace",
        icon: Newspaper,
        link: "/admin/blog",
        tone: "text-violet-300",
      },
      {
        label: "Published",
        value: stats.publishedPosts.toString(),
        note: "Articles currently live",
        icon: PenSquare,
        link: "/admin/blog",
        tone: "text-emerald-300",
      },
      {
        label: "Drafts",
        value: stats.draftPosts.toString(),
        note: "Stories still being written",
        icon: FilePenLine,
        link: "/admin/blog",
        tone: "text-amber-300",
      },
      {
        label: "Updated 30d",
        value: stats.recentPosts.toString(),
        note: "Stories touched in the last month",
        icon: Calendar,
        link: "/admin/blog",
        tone: "text-sky-300",
      },
    ];
  }, [stats, isOwner]);

  const handleImportContent = async () => {
    if (!user?.id) {
      toast.error("You need to be signed in to import starter content.");
      return;
    }

    setImportingContent(true);

    try {
      const result = await seedDynamicUiContent(user.id);
      toast.success(
        `Imported ${result.fixtures} fixtures, ${result.tickets} tickets, ${result.sponsors} sponsors, ${result.packages} packages, and ${result.posts} posts.`,
      );
    } catch (importError) {
      const message =
        importError instanceof Error ? importError.message : "Starter content import failed.";
      toast.error(message);
    } finally {
      setImportingContent(false);
    }
  };

  return (
    <div className="min-w-0 overflow-x-hidden px-4 py-5 sm:px-6 lg:px-8">
      <div className="mx-auto min-w-0 max-w-7xl space-y-6">
        <section className="relative min-w-0 overflow-hidden rounded-[28px] border border-white/10 bg-[radial-gradient(120%_140%_at_0%_0%,rgba(234,88,12,0.22),rgba(120,53,15,0.12)_35%,rgba(9,9,11,0.98)_75%)] px-6 py-7 shadow-[0_24px_80px_rgba(0,0,0,0.35)] sm:px-8">
          <div className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full bg-red-500/20 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-24 left-10 h-72 w-72 rounded-full bg-amber-400/10 blur-3xl" />
          <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-2xl">
              <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-amber-200">
                <span className="h-2 w-2 rounded-full bg-amber-400/80" />
                {isOwner ? "Owner access" : "Writer access"}
              </div>
              <h1 className="text-3xl font-black tracking-tight text-white sm:text-4xl">
                {greeting}, {adminName}
              </h1>
              <p className="mt-3 text-sm leading-6 text-gray-300">
                {isOwner
                  ? `It is ${todayLabel}. Here is your club operations snapshot across sales, fixtures, and publishing.`
                  : `It is ${todayLabel}. This workspace is focused only on your writing pipeline and article output.`}
              </p>
            </div>

            <div className="w-full max-w-sm rounded-[22px] border border-white/10 bg-black/30 p-4">
              <div className="mb-4 flex items-center justify-between">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-400">Quick actions</p>
                
              </div>
              <div className="flex flex-wrap gap-3">
                <Link to="/admin/blog" className="rounded-2xl border border-white/10 bg-white/8 px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-white/10">
                  {isOwner ? "New post" : "Write article"}
                </Link>
                {isOwner ? (
                  <>
                    <Link to="/admin/fixtures" className="rounded-2xl border border-white/10 bg-white/8 px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-white/10">
                      Fixtures
                    </Link>
                    
                    <Link to="/admin/orders" className="rounded-2xl bg-red-700 px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-red-600">
                      View orders
                    </Link>
                  </>
                ) : (
                  <Link to="/admin/blog" className="rounded-2xl bg-red-700 px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-red-600">
                    View drafts
                  </Link>
                )}
              </div>
              
            </div>
          </div>
        </section>

        {loading ? (
          <div className="flex items-center justify-center py-24">
            <Loader2 className="h-8 w-8 animate-spin text-red-500" />
          </div>
        ) : (
          <>
            {error && <p className="text-sm text-amber-400">{error}</p>}

            <section className="grid min-w-0 gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {cards.map((card) => (
                <Link key={card.label} to={card.link} className="min-w-0">
                  <motion.div
                    whileHover={{ y: -2 }}
                    className="h-full rounded-[24px] border border-white/10 bg-white/[0.035] p-5 transition-colors hover:bg-white/[0.06]"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="min-w-0">
                        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gray-500">{card.label}</p>
                        <p className="mt-3 truncate text-2xl font-black text-white">{card.value}</p>
                        <p className="mt-2 text-sm text-gray-400">{card.note}</p>
                      </div>
                      <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-2xl bg-black/30">
                        <card.icon className={`h-5 w-5 ${card.tone}`} />
                      </div>
                    </div>
                  </motion.div>
                </Link>
              ))}
            </section>

            {isOwner ? (
              <section className="grid min-w-0 gap-6 xl:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)]">
                <div className="min-w-0 rounded-[24px] border border-white/10 bg-white/[0.035] p-5 sm:p-6">
                  <div className="mb-5 flex items-center justify-between gap-4">
                    <div className="min-w-0">
                      <h2 className="text-lg font-black text-white">Revenue trend</h2>
                      <p className="mt-1 text-sm text-gray-400">Last six months of completed ticket revenue.</p>
                    </div>
                    <Link to="/admin/orders" className="flex flex-shrink-0 items-center gap-1 text-sm font-semibold text-emerald-300 hover:text-emerald-200">
                      Details <ArrowUpRight className="h-4 w-4" />
                    </Link>
                  </div>
                  <div className="h-[260px] w-full min-w-0">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={revenueData} margin={{ left: 0, right: 8, top: 8, bottom: 0 }}>
                        <defs>
                          <linearGradient id="dashboardRevenue" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#34d399" stopOpacity={0.35} />
                            <stop offset="95%" stopColor="#34d399" stopOpacity={0.03} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" />
                        <XAxis dataKey="label" tickLine={false} axisLine={false} stroke="#9ca3af" />
                        <YAxis tickLine={false} axisLine={false} width={44} stroke="#9ca3af" />
                        <Area type="monotone" dataKey="revenue" stroke="#34d399" strokeWidth={2.5} fill="url(#dashboardRevenue)" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="min-w-0 rounded-[24px] border border-white/10 bg-white/[0.035] p-5 sm:p-6">
                  <div className="mb-5">
                    <h2 className="text-lg font-black text-white">Publishing overview</h2>
                    <p className="mt-1 text-sm text-gray-400">Published posts vs drafts by month.</p>
                  </div>
                  <div className="h-[260px] w-full min-w-0">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={contentData} margin={{ left: 0, right: 8, top: 8, bottom: 0 }}>
                        <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" />
                        <XAxis dataKey="label" tickLine={false} axisLine={false} stroke="#9ca3af" />
                        <YAxis tickLine={false} axisLine={false} width={36} stroke="#9ca3af" />
                        <Bar dataKey="published" fill="#a78bfa" radius={[8, 8, 0, 0]} />
                        <Bar dataKey="drafts" fill="#f59e0b" radius={[8, 8, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </section>
            ) : (
              <section className="grid min-w-0 gap-6 xl:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)]">
                <div className="min-w-0 rounded-[24px] border border-white/10 bg-white/[0.035] p-5 sm:p-6">
                  <div className="mb-5">
                    <h2 className="text-lg font-black text-white">Writing activity</h2>
                    <p className="mt-1 text-sm text-gray-400">Published posts vs drafts by month.</p>
                  </div>
                  <div className="h-[260px] w-full min-w-0">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={contentData} margin={{ left: 0, right: 8, top: 8, bottom: 0 }}>
                        <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" />
                        <XAxis dataKey="label" tickLine={false} axisLine={false} stroke="#9ca3af" />
                        <YAxis tickLine={false} axisLine={false} width={36} stroke="#9ca3af" />
                        <Bar dataKey="published" fill="#a78bfa" radius={[8, 8, 0, 0]} />
                        <Bar dataKey="drafts" fill="#f59e0b" radius={[8, 8, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="min-w-0 rounded-[24px] border border-white/10 bg-white/[0.035] p-5 sm:p-6">
                  <h2 className="text-lg font-black text-white">Writer focus</h2>
                  <p className="mt-1 text-sm text-gray-400">Your dashboard is intentionally limited to publishing work only.</p>

                  <div className="mt-5 space-y-3">
                    <div className="rounded-2xl border border-white/10 bg-black/20 px-4 py-4">
                      <div className="text-xs font-semibold uppercase tracking-[0.18em] text-gray-500">Primary task</div>
                      <div className="mt-2 text-base font-semibold text-white">Keep drafts moving toward publication</div>
                    </div>
                    <div className="rounded-2xl border border-white/10 bg-black/20 px-4 py-4">
                      <div className="text-xs font-semibold uppercase tracking-[0.18em] text-gray-500">What you can see here</div>
                      <div className="mt-2 text-sm text-gray-300">Only article counts, writing activity, and blog shortcuts.</div>
                    </div>
                    <div className="rounded-2xl border border-white/10 bg-black/20 px-4 py-4">
                      <div className="text-xs font-semibold uppercase tracking-[0.18em] text-gray-500">Best next step</div>
                      <div className="mt-2 text-sm text-gray-300">Open the blog area to write, edit, or publish stories.</div>
                    </div>
                  </div>
                </div>
              </section>
            )}

          </>
        )}
      </div>
    </div>
  );
}
