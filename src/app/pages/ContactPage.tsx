import { motion } from "motion/react";
import { Mail, Phone, MapPin, Send, CheckCircle, Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState } from "react";
import { supabase } from "../../lib/supabase";
import { toast } from "sonner";

const schema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email"),
  subject: z.string().min(3, "Subject must be at least 3 characters"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

type FormData = z.infer<typeof schema>;

export function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm<FormData>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: FormData) => {
    const { error } = await supabase.from("contact_submissions").insert([{ name: data.name, email: data.email, subject: data.subject, message: data.message }]);
    if (error) { toast.error("Failed to send message. Please try again."); return; }
    setSubmitted(true);
    toast.success("Message sent! We'll get back to you soon.");
    reset();
  };

  const inputClass = "w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-600 focus:outline-none focus:border-red-600 transition-colors text-sm";
  const errorClass = "text-red-400 text-xs mt-1";

  return (
    <div className="min-h-screen bg-black pt-24 pb-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-red-900/30 border border-red-700 rounded-full mb-5">
            <Mail className="w-4 h-4 text-red-400" />
            <span className="text-red-400 font-bold text-sm">GET IN TOUCH</span>
          </div>
          <h1 className="text-5xl font-black text-white mb-4">CONTACT US</h1>
          <p className="text-gray-400 max-w-xl mx-auto">Questions about tickets, sponsorship, or the club? We'd love to hear from you.</p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-10">
          {/* Info Panel */}
          <div className="space-y-6">
            {[
              { icon: Mail, label: "Email", value: "admin@northwalesrugby.com", href: "mailto:admin@northwalesrugby.com" },
              { icon: MapPin, label: "Ground", value: "Eirias Stadium, Colwyn Bay, LL29", href: "#" },
              { icon: Phone, label: "Matchday", value: "Available on matchday", href: "#" },
            ].map((item) => (
              <motion.a key={item.label} href={item.href} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="flex items-start gap-4 p-5 bg-white/5 border border-white/10 rounded-2xl hover:border-red-700/50 transition-all group block">
                <div className="w-10 h-10 bg-red-900/30 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:bg-red-800/40 transition-colors">
                  <item.icon className="w-5 h-5 text-red-400" />
                </div>
                <div>
                  <div className="text-gray-500 text-xs font-semibold uppercase tracking-wider mb-1">{item.label}</div>
                  <div className="text-white text-sm font-medium">{item.value}</div>
                </div>
              </motion.a>
            ))}
          </div>

          {/* Form */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="lg:col-span-2">
            {submitted ? (
              <div className="bg-green-900/20 border border-green-700 rounded-2xl p-10 text-center">
                <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-4" />
                <h3 className="text-white font-black text-2xl mb-2">Message Sent!</h3>
                <p className="text-gray-400 mb-6">Thanks for reaching out. We'll get back to you as soon as possible.</p>
                <button onClick={() => setSubmitted(false)} className="px-6 py-3 bg-white/5 border border-white/10 text-white rounded-xl hover:bg-white/10 transition-colors font-semibold">Send Another</button>
              </div>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} className="bg-white/5 border border-white/10 rounded-2xl p-8 space-y-5">
                <div className="grid sm:grid-cols-2 gap-5">
                  <div>
                    <label className="text-gray-400 text-sm mb-1.5 block">Your Name *</label>
                    <input {...register("name")} placeholder="John Smith" className={inputClass} />
                    {errors.name && <p className={errorClass}>{errors.name.message}</p>}
                  </div>
                  <div>
                    <label className="text-gray-400 text-sm mb-1.5 block">Email Address *</label>
                    <input {...register("email")} type="email" placeholder="john@example.com" className={inputClass} />
                    {errors.email && <p className={errorClass}>{errors.email.message}</p>}
                  </div>
                </div>
                <div>
                  <label className="text-gray-400 text-sm mb-1.5 block">Subject *</label>
                  <input {...register("subject")} placeholder="Ticket enquiry, Sponsorship..." className={inputClass} />
                  {errors.subject && <p className={errorClass}>{errors.subject.message}</p>}
                </div>
                <div>
                  <label className="text-gray-400 text-sm mb-1.5 block">Message *</label>
                  <textarea {...register("message")} rows={5} placeholder="Tell us how we can help..." className={`${inputClass} resize-none`} />
                  {errors.message && <p className={errorClass}>{errors.message.message}</p>}
                </div>
                <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} type="submit" disabled={isSubmitting} className="w-full py-4 bg-gradient-to-r from-red-700 to-red-800 text-white rounded-xl font-black border border-red-600 hover:shadow-xl hover:shadow-red-900/50 transition-all flex items-center justify-center gap-3 disabled:opacity-60">
                  {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                  {isSubmitting ? "Sending..." : "Send Message"}
                </motion.button>
              </form>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
