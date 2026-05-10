import { useState } from "react";
import { motion } from "motion/react";
import { Heart, CreditCard, Loader2, AlertCircle, Shield } from "lucide-react";
import { supabase } from "../../lib/supabase";
import { useAuth } from "../../context/AuthContext";

const PRESETS = [10, 25, 50, 100];

export function DonationPage() {
  const { user } = useAuth();
  const [amount, setAmount] = useState<number | "custom">(25);
  const [customAmount, setCustomAmount] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const currentAmount = amount === "custom" ? parseFloat(customAmount || "0") : amount;

  const handleCheckout = async () => {
    if (currentAmount < 1) {
      setError("Please enter a donation amount of at least £1.");
      return;
    }
    setLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase.functions.invoke("create-donation-session", {
        body: {
          amountPence: Math.round(currentAmount * 100),
          userId: user?.id ?? null,
          successUrl: `${window.location.origin}/donate/success`,
          cancelUrl: `${window.location.origin}/donate`,
        },
      });

      if (error) throw error;
      if (data?.url) window.location.href = data.url;
    } catch (err: unknown) {
      console.error(err);
      setError(err instanceof Error ? err.message : "Checkout failed. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black pt-24 pb-32">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-2xl">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-red-900/30 border-2 border-red-600 rounded-full mb-6">
            <Heart className="w-8 h-8 text-red-400" />
          </div>
          <h1 className="text-5xl font-black text-white mb-4">Support the Club</h1>
          <p className="text-gray-400 text-lg">
            Your generous contributions help us maintain Eirias Stadium, support our academy programs, and keep professional rugby thriving in North Wales.
          </p>
        </motion.div>

        {/* Donation Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white/5 border border-white/10 rounded-3xl p-6 md:p-10 shadow-2xl"
        >
          <h2 className="text-white font-bold text-xl mb-6">Select an amount</h2>

          {/* Preset Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
            {PRESETS.map((val) => (
              <button
                key={val}
                onClick={() => { setAmount(val); setError(null); }}
                className={`py-4 rounded-2xl font-black text-xl transition-all ${
                  amount === val
                    ? "bg-red-700 text-white shadow-lg shadow-red-900/50"
                    : "bg-white/5 text-gray-300 border border-white/10 hover:bg-white/10"
                }`}
              >
                £{val}
              </button>
            ))}
          </div>

          {/* Custom Amount */}
          <div className="mb-8">
            <button
              onClick={() => { setAmount("custom"); setError(null); }}
              className={`w-full py-4 rounded-2xl font-bold transition-all mb-4 ${
                amount === "custom"
                  ? "bg-red-900/40 text-white border border-red-700"
                  : "bg-white/5 text-gray-300 border border-white/10 hover:bg-white/10"
              }`}
            >
              Custom Amount
            </button>

            {amount === "custom" && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="relative">
                <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none">
                  <span className="text-white font-black text-3xl">£</span>
                </div>
                <input
                  type="number"
                  min="1"
                  step="1"
                  value={customAmount}
                  onChange={(e) => setCustomAmount(e.target.value)}
                  placeholder="0.00"
                  className="w-full pl-14 pr-6 py-5 bg-black border-2 border-red-700 rounded-2xl text-white font-black text-3xl focus:outline-none focus:ring-4 focus:ring-red-900/50 transition-all"
                />
              </motion.div>
            )}
          </div>

          {error && (
            <div className="flex items-center gap-3 bg-red-900/30 border border-red-700 rounded-xl p-4 mb-6">
              <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
              <p className="text-red-300 text-sm">{error}</p>
            </div>
          )}

          <div className="border-t border-white/10 pt-8 mt-8">
            <div className="flex items-center justify-between mb-6">
              <span className="text-gray-400 font-medium">Total Donation</span>
              <span className="text-white font-black text-4xl">£{currentAmount.toFixed(2)}</span>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleCheckout}
              disabled={loading || currentAmount < 1}
              className="w-full py-5 bg-gradient-to-r from-red-700 to-red-800 text-white rounded-2xl font-black text-lg border border-red-600 hover:shadow-xl hover:shadow-red-900/50 transition-all disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-3"
            >
              {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : <CreditCard className="w-6 h-6" />}
              {loading ? "Redirecting securely..." : "Donate with Stripe"}
            </motion.button>

            <div className="flex items-center justify-center gap-2 mt-4 text-gray-500 text-xs">
              <Shield className="w-4 h-4" /> Secure, encrypted payments via Stripe
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
