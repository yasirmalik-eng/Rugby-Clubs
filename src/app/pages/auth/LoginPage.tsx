import { motion } from "motion/react";
import { useState } from "react";
import { useNavigate } from "react-router";
import { Lock, Mail, Loader2, AlertCircle, Eye, EyeOff } from "lucide-react";
import { supabase } from "../../../lib/supabase";

export function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); setError(null);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) { setError(error.message); setLoading(false); return; }
    navigate("/admin");
  };

  const inputClass = "w-full pl-11 pr-4 py-3.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-600 focus:outline-none focus:border-red-600 transition-colors text-sm";

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4">
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 mx-auto bg-black border-2 border-red-600 rounded-full overflow-hidden p-2 mb-4">
            <img src="/logo.png" alt="Logo" className="w-full h-full object-contain" />
          </div>
          <h1 className="text-3xl font-black text-white">Admin Login</h1>
          <p className="text-gray-500 text-sm mt-1">North Wales Crusaders CMS</p>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-2xl p-8">
          {error && (
            <div className="flex items-center gap-3 bg-red-900/30 border border-red-700 rounded-xl p-4 mb-6">
              <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
              <p className="text-red-300 text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="text-gray-400 text-sm mb-1.5 block">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600" />
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="admin@northwalesrugby.com" required className={inputClass} />
              </div>
            </div>
            <div>
              <label className="text-gray-400 text-sm mb-1.5 block">Password</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600" />
                <input type={showPassword ? "text" : "password"} value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" required className={`${inputClass} pr-11`} />
                <button type="button" onClick={() => setShowPassword(v => !v)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-400">
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} type="submit" disabled={loading} className="w-full py-4 bg-gradient-to-r from-red-700 to-red-800 text-white rounded-xl font-black border border-red-600 hover:shadow-xl hover:shadow-red-900/50 transition-all flex items-center justify-center gap-3 disabled:opacity-60 mt-2">
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Lock className="w-5 h-5" />}
              {loading ? "Signing in..." : "Sign In"}
            </motion.button>
          </form>
        </div>

        <p className="text-center text-gray-700 text-xs mt-6">Access restricted to authorised personnel only.</p>
      </motion.div>
    </div>
  );
}
