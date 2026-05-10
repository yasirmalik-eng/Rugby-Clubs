import { motion } from "motion/react";
import { Facebook, Mail } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router";
import { supabase } from "../../lib/supabase";
import { toast } from "sonner";

const socialLinks = [
  {
    icon: Facebook,
    href: "https://www.facebook.com/share/1CjwtXgibd/?mibextid=wwXIfr",
    label: "Facebook",
    color: "hover:bg-blue-600",
  },
];

const quickLinks = [
  { name: "Home", path: "/" },
  { name: "Fixtures", path: "/fixtures" },
  { name: "Tickets", path: "/tickets" },
  { name: "News", path: "/news" },
  { name: "Sponsors", path: "/sponsors" },
  { name: "Contact", path: "/contact" },
];

export function WelshFooter() {
  const navigate = useNavigate();
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [subscribing, setSubscribing] = useState(false);

  const handleSubscribe = async () => {
    const email = newsletterEmail.trim();

    if (!email) {
      toast.error("Please enter your email address.");
      return;
    }

    const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    if (!isValidEmail) {
      toast.error("Please enter a valid email address.");
      return;
    }

    setSubscribing(true);

    const { error } = await supabase.from("contact_submissions").insert([
      {
        name: "Newsletter Subscriber",
        email,
        subject: "Newsletter Subscription",
        message: "Please add this email address to the club newsletter mailing list.",
      },
    ]);

    setSubscribing(false);

    if (error) {
      toast.error("Subscription failed. Please try again.");
      return;
    }

    toast.success("You have been added to the newsletter list.");
    setNewsletterEmail("");
  };

  return (
    <footer className="bg-black border-t-2 border-red-600/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">

        {/* TOP GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">

          {/* LOGO + SOCIAL */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="flex flex-col items-start mb-4">
              <div className="w-20 h-20 rounded-lg border-2 border-red-600 overflow-hidden">
                <img
                  src="/logo.png"
                  alt="Logo"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="text-lg font-bold text-white mt-2">
                North Wales Crusaders
              </div>
            </div>

            <div className="flex gap-3">
              {socialLinks.map((social, index) => (
                <motion.a
                  key={index}
                  href={social.href}
                  target="_blank"
                  rel="noreferrer"
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.9 }}
                  className={`w-10 h-10 flex items-center justify-center bg-white/5 border border-white/10 rounded-lg ${social.color} transition-all`}
                  aria-label={social.label}
                >
                  <social.icon className="w-5 h-5 text-white" />
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* QUICK LINKS */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            <h4 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <div className="w-1 h-6 bg-red-600 rounded" />
              Quick Links
            </h4>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.path}>
                  <motion.button
                    onClick={() => navigate(link.path)}
                    whileHover={{ x: 5 }}
                    className="text-gray-400 hover:text-red-500 transition-colors"
                  >
                    {link.name}
                  </motion.button>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* CONTACT */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <h4 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <div className="w-1 h-6 bg-green-700 rounded" />
              Contact Info
            </h4>
            <ul className="space-y-4">
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-red-500" />
                <span className="text-gray-400 text-sm">
                  admin@northwalesrugby.com
                </span>
              </li>
            </ul>
          </motion.div>

          {/* NEWSLETTER */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
          >
            <h4 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <div className="w-1 h-6 bg-red-600 rounded" />
              Newsletter
            </h4>
            <p className="text-gray-400 mb-4 text-sm">
              Stay updated with match news, offers &amp; events
            </p>
            <input
              type="email"
              placeholder="Your email"
              value={newsletterEmail}
              onChange={(event) => setNewsletterEmail(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  event.preventDefault();
                  void handleSubscribe();
                }
              }}
              className="w-full px-4 py-3 mb-2 rounded-lg bg-white/5 border border-white/10 focus:border-red-600 text-white placeholder-gray-500 text-sm outline-none transition-colors"
            />
            <button
              type="button"
              onClick={() => void handleSubscribe()}
              disabled={subscribing}
              className="w-full px-6 py-3 bg-red-700 hover:bg-red-800 text-white rounded-lg font-bold transition-all text-sm disabled:cursor-not-allowed disabled:opacity-70"
            >
              {subscribing ? "SUBSCRIBING..." : "SUBSCRIBE"}
            </button>
          </motion.div>
        </div>

        {/* BOTTOM */}
        <div className="border-t border-white/10 pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-gray-500 text-sm text-center md:text-left">
            © 2026 North Wales Crusaders. All rights reserved.
          </p>
          <div className="flex gap-6 text-sm text-gray-500">
            <button className="hover:text-red-500 transition-colors">Privacy</button>
            <button className="hover:text-red-500 transition-colors">Terms</button>
            <button className="hover:text-red-500 transition-colors">Cookies</button>
          </div>
        </div>
      </div>
    </footer>
  );
}
