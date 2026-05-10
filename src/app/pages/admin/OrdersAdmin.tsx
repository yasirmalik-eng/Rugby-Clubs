import { useEffect, useState } from "react";
import { Loader2, ShoppingBag } from "lucide-react";
import { supabase } from "../../../lib/supabase";
import { format } from "date-fns";

interface Order {
  id: string;
  buyer_email: string;
  buyer_name: string | null;
  total_amount_gbp: number;
  status: string;
  created_at: string;
  stripe_session_id: string;
}

const statusColor: Record<string, string> = {
  completed: "bg-green-800 text-green-200",
  pending: "bg-yellow-800 text-yellow-200",
  refunded: "bg-blue-800 text-blue-200",
  cancelled: "bg-red-900 text-red-300",
};

export function OrdersAdmin() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>("all");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);

      let query = supabase
        .from("orders")
        .select("id, buyer_email, buyer_name, total_amount_gbp, status, created_at, stripe_session_id")
        .order("created_at", { ascending: false });

      if (filter !== "all") {
        query = query.eq("status", filter);
      }

      const { data, error } = await query;
      setError(error?.message ?? null);
      setOrders(data ?? []);
      setLoading(false);
    };

    void fetchOrders();
  }, [filter]);

  const totalRevenue = orders
    .filter((order) => order.status === "completed")
    .reduce((sum, order) => sum + order.total_amount_gbp, 0);

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-black text-white">Orders</h1>
        <p className="text-gray-500 mt-1">All ticket purchases</p>
      </div>

      <div className="grid sm:grid-cols-3 gap-4 mb-8">
        {[
          { label: "Total Orders", value: orders.length, color: "text-white" },
          { label: "Completed", value: orders.filter((order) => order.status === "completed").length, color: "text-green-400" },
          { label: "Revenue", value: `GBP${(totalRevenue / 100).toFixed(2)}`, color: "text-green-400" },
        ].map((summary) => (
          <div key={summary.label} className="bg-white/5 border border-white/10 rounded-xl p-5">
            <div className="text-gray-500 text-sm mb-1">{summary.label}</div>
            <div className={`font-black text-2xl ${summary.color}`}>{summary.value}</div>
          </div>
        ))}
      </div>

      <div className="flex gap-3 mb-6 flex-wrap">
        {["all", "completed", "pending", "refunded", "cancelled"].map((value) => (
          <button
            key={value}
            onClick={() => setFilter(value)}
            className={`px-4 py-2 rounded-xl text-sm font-semibold capitalize transition-all ${
              filter === value ? "bg-red-700 text-white" : "bg-white/5 border border-white/10 text-gray-400 hover:text-white"
            }`}
          >
            {value}
          </button>
        ))}
      </div>

      {error && <p className="mb-4 text-sm text-amber-400">{error}</p>}

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 text-red-500 animate-spin" />
        </div>
      ) : (
        <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
          <table className="w-full text-sm">
            <thead className="border-b border-white/10">
              <tr className="text-gray-500 text-left">
                {["Date", "Buyer", "Email", "Total", "Status"].map((heading) => (
                  <th key={heading} className="px-5 py-3 font-semibold">
                    {heading}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {orders.map((order) => (
                <tr key={order.id} className="hover:bg-white/5 transition-colors">
                  <td className="px-5 py-3 text-gray-400 text-xs">{format(new Date(order.created_at), "d MMM yyyy, HH:mm")}</td>
                  <td className="px-5 py-3 text-white">{order.buyer_name ?? "-"}</td>
                  <td className="px-5 py-3 text-gray-400">{order.buyer_email}</td>
                  <td className="px-5 py-3 text-green-400 font-bold">GBP{(order.total_amount_gbp / 100).toFixed(2)}</td>
                  <td className="px-5 py-3">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold capitalize ${statusColor[order.status] ?? "bg-gray-800 text-gray-400"}`}>
                      {order.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {orders.length === 0 && (
            <div className="text-center py-16">
              <ShoppingBag className="w-10 h-10 text-gray-700 mx-auto mb-3" />
              <p className="text-gray-600">No orders found.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
