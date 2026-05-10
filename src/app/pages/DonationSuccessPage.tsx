import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { CheckCircle, Heart, Mail, ArrowRight, Loader2 } from "lucide-react";
import { useSearchParams, useNavigate } from "react-router";
import { supabase } from "../../lib/supabase";

interface DonationSummary {
  id: string;
  donor_email: string;
  donor_name: string | null;
  amount_gbp: number;
  status: string;
}

export function DonationSuccessPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const sessionId = searchParams.get("session_id");
  const [donation, setDonation] = useState<DonationSummary | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!sessionId) { setLoading(false); return; }
    const fetch = async () => {
      const { data } = await supabase
        .from("donations")
        .select("id, donor_email, donor_name, amount_gbp, status")
        .eq("stripe_session_id", sessionId)
        .single();
      setDonation(data as DonationSummary | null);
      setLoading(false);
    };
    // Poll briefly to allow webhook to process
    setTimeout(fetch, 2000);
  }, [sessionId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-red-500 animate-spin mx-auto mb-4" />
          <p className="text-gray-400">Confirming your donation...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black pt-24 pb-20 flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="max-w-lg w-full text-center"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", delay: 0.2 }}
          className="inline-flex items-center justify-center w-24 h-24 bg-red-900/30 border-2 border-red-600 rounded-full mb-6"
        >
          <Heart className="w-10 h-10 text-red-400" />
        </motion.div>

        <h1 className="text-4xl font-black text-white mb-4">Thank You!</h1>
        <p className="text-gray-300 text-lg mb-8 leading-relaxed">
          Your generous contribution of{" "}
          <strong className="text-white">
            £{donation ? (donation.amount_gbp / 100).toFixed(2) : "..."}
          </strong>{" "}
          has been received. We truly appreciate your support for North Wales Crusaders.
        </p>

        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-8 text-left">
          <div className="flex items-start gap-4">
            <Mail className="w-6 h-6 text-red-400 flex-shrink-0 mt-1" />
            <div>
              <h3 className="text-white font-bold mb-1">Receipt Sent</h3>
              <p className="text-gray-400 text-sm">
                We've sent a formal receipt to{" "}
                <span className="text-white font-medium">{donation?.donor_email ?? "your email address"}</span>
                . It should arrive within the next 5 minutes.
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={() => navigate("/")}
          className="px-8 py-4 bg-gradient-to-r from-red-700 to-red-800 text-white rounded-xl font-bold border border-red-600 hover:shadow-lg hover:shadow-red-900/50 transition-all flex items-center justify-center gap-2 mx-auto"
        >
          Return Home <ArrowRight className="w-4 h-4" />
        </button>
      </motion.div>
    </div>
  );
}
