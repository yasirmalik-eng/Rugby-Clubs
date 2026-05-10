import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { CheckCircle, Ticket, Mail, ArrowRight, Loader2 } from "lucide-react";
import { useSearchParams, useNavigate } from "react-router";
import { supabase } from "../../lib/supabase";

interface OrderSummary {
  id: string;
  buyer_email: string;
  buyer_name: string | null;
  total_amount_gbp: number;
  status: string;
  order_items: {
    quantity: number;
    unit_price_gbp: number;
    tickets: { label: string };
  }[];
}

export function CheckoutSuccessPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const sessionId = searchParams.get("session_id");
  const [order, setOrder] = useState<OrderSummary | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!sessionId) { setLoading(false); return; }

    let active = true;

    const fetch = async () => {
      for (let attempt = 0; attempt < 5; attempt++) {
        const { data } = await supabase
          .from("orders")
          .select("id, buyer_email, buyer_name, total_amount_gbp, status, order_items(quantity, unit_price_gbp, tickets(label))")
          .eq("stripe_session_id", sessionId)
          .maybeSingle();

        if (!active) return;

        if (data) {
          setOrder(data as OrderSummary);
          setLoading(false);
          return;
        }

        await new Promise((resolve) => setTimeout(resolve, 1500));
      }

      if (active) {
        setLoading(false);
      }
    };

    void fetch();

    return () => {
      active = false;
    };
  }, [sessionId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-red-500 animate-spin mx-auto mb-4" />
          <p className="text-gray-400">Confirming your order...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black pt-24 pb-20 flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="max-w-lg w-full"
      >
        {/* Success Icon */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", delay: 0.2 }}
            className="inline-flex items-center justify-center w-24 h-24 bg-green-900/30 border-2 border-green-600 rounded-full mb-6"
          >
            <CheckCircle className="w-12 h-12 text-green-400" />
          </motion.div>
          <h1 className="text-4xl font-black text-white mb-2">Payment Confirmed!</h1>
          <p className="text-gray-400">
            Your tickets have been booked. Check your email for your confirmation.
          </p>
        </div>

        {/* Order Card */}
        <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden mb-6">
          <div className="bg-gradient-to-r from-red-900/40 to-transparent border-b border-white/10 px-6 py-4">
            <div className="flex items-center gap-3">
              <Ticket className="w-5 h-5 text-red-400" />
              <span className="text-white font-bold">Order Summary</span>
            </div>
          </div>

          <div className="px-6 py-5 space-y-4">
            {order ? (
              <>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Order ID</span>
                  <span className="text-white font-mono text-xs">{order.id.slice(0, 8).toUpperCase()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Email</span>
                  <span className="text-white">{order.buyer_email}</span>
                </div>
                <div className="border-t border-white/10 pt-4 space-y-2">
                  {order.order_items?.map((item, i) => (
                    <div key={i} className="flex justify-between text-sm">
                      <span className="text-gray-300">{item.tickets?.label} × {item.quantity}</span>
                      <span className="text-white font-bold">£{((item.unit_price_gbp * item.quantity) / 100).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
                <div className="border-t border-white/10 pt-4 flex justify-between">
                  <span className="text-white font-bold">Total Paid</span>
                  <span className="text-green-400 font-black text-xl">£{(order.total_amount_gbp / 100).toFixed(2)}</span>
                </div>
              </>
            ) : (
              <div className="text-center py-4">
                <div className="flex items-center justify-center gap-2 text-gray-400 mb-2">
                  <Mail className="w-5 h-5" />
                  <span>Confirmation email on its way!</span>
                </div>
                <p className="text-gray-600 text-sm">Your receipt will arrive within a few minutes.</p>
              </div>
            )}
          </div>
        </div>

        {/* Email notice */}
        <div className="bg-blue-900/20 border border-blue-700/40 rounded-xl px-5 py-4 mb-8 flex items-start gap-3">
          <Mail className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
          <p className="text-blue-300 text-sm">
            A confirmation email with your ticket details has been sent to your inbox. Please check your spam folder if it doesn't arrive within 5 minutes.
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={() => navigate("/")}
            className="flex-1 px-6 py-3 bg-white/5 border border-white/10 text-white rounded-xl font-semibold hover:bg-white/10 transition-colors"
          >
            Back to Home
          </button>
          <button
            onClick={() => navigate("/fixtures")}
            className="flex-1 px-6 py-3 bg-gradient-to-r from-red-700 to-red-800 text-white rounded-xl font-bold border border-red-600 hover:shadow-lg hover:shadow-red-900/50 transition-all flex items-center justify-center gap-2"
          >
            View Fixtures <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </motion.div>
    </div>
  );
}
