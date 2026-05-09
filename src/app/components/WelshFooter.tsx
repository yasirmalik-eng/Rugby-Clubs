import { motion } from "motion/react";
import { Facebook, Twitter, Instagram, Youtube, Mail, Phone, MapPin, Shield } from "lucide-react";

interface WelshFooterProps {
  onNavigate: (page: string) => void;
}

const socialLinks = [
  { icon: Facebook, href: "#", label: "Facebook", color: "hover:bg-blue-600" },
  { icon: Twitter, href: "#", label: "Twitter", color: "hover:bg-blue-400" },
  { icon: Instagram, href: "#", label: "Instagram", color: "hover:bg-pink-600" },
  { icon: Youtube, href: "#", label: "YouTube", color: "hover:bg-red-600" }
];

export function WelshFooter({ onNavigate }: WelshFooterProps) {
  return (
    <footer className="bg-black border-t-2 border-red-600/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-12 mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-red-800 to-red-900 rounded-lg flex items-center justify-center border-2 border-red-600">
                <Shield className="w-7 h-7 text-white" />
              </div>
              <div>
                <div className="text-xl font-bold text-white">WELSH RFC</div>
                <div className="text-xs text-green-500 font-semibold">EST. 1899</div>
              </div>
            </div>
            <p className="text-gray-400 mb-6 leading-relaxed">
              Building champions on and off the field for over 127 years
            </p>
            <div className="flex gap-3">
              {socialLinks.map((social, index) => (
                <motion.a
                  key={index}
                  href={social.href}
                  whileHover={{ scale: 1.2, y: -2 }}
                  whileTap={{ scale: 0.9 }}
                  className={`w-10 h-10 bg-white/5 border border-white/10 rounded-lg flex items-center justify-center ${social.color} transition-all`}
                  aria-label={social.label}
                >
                  <social.icon className="w-5 h-5 text-white" />
                </motion.a>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <h4 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <div className="w-1 h-6 bg-red-600 rounded"></div>
              Quick Links
            </h4>
            <ul className="space-y-2">
              {[
                { name: "Home", page: "home" },
                { name: "Fixtures", page: "fixtures" },
                { name: "Tickets", page: "tickets" },
                { name: "Club", page: "club" },
                { name: "News", page: "news" },
                { name: "Sponsors", page: "sponsors" }
              ].map((link, index) => (
                <li key={index}>
                  <motion.button
                    onClick={() => onNavigate(link.page)}
                    whileHover={{ x: 5 }}
                    className="text-gray-400 hover:text-red-500 transition-colors inline-block"
                  >
                    {link.name}
                  </motion.button>
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h4 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <div className="w-1 h-6 bg-green-700 rounded"></div>
              Contact Info
            </h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-red-500 mt-1 flex-shrink-0" />
                <div>
                  <div className="text-sm text-white font-semibold mb-1">Eirias Stadium</div>
                  <span className="text-sm text-gray-400">
                    Abergele Road, Colwyn Bay<br />
                    North Wales, LL29 7SP
                  </span>
                </div>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-red-500 flex-shrink-0" />
                <span className="text-sm text-gray-400">+44 29 2087 4000</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-red-500 flex-shrink-0" />
                <span className="text-sm text-gray-400">info@welshrfc.com</span>
              </li>
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <h4 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <div className="w-1 h-6 bg-red-600 rounded"></div>
              Newsletter
            </h4>
            <p className="text-gray-400 mb-4 text-sm">
              Stay updated with match news, exclusive offers, and club events
            </p>
            <div className="space-y-2">
              <input
                type="email"
                placeholder="Your email"
                className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 focus:border-red-600 focus:outline-none text-white placeholder-gray-500 text-sm"
              />
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full px-6 py-3 bg-gradient-to-r from-red-700 to-red-800 text-white rounded-lg font-bold hover:shadow-lg hover:shadow-red-900/50 transition-all text-sm border border-red-600"
              >
                SUBSCRIBE
              </motion.button>
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="border-t border-white/10 pt-8"
        >
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-500 text-sm text-center md:text-left">
              &copy; 2026 Welsh Rugby Football Club. All rights reserved.
              <br className="md:hidden" />
              <span className="hidden md:inline"> | </span>
              Built with pride and passion for Welsh rugby.
            </p>
            <div className="flex gap-6 text-sm text-gray-500">
              <button className="hover:text-red-500 transition-colors">Privacy Policy</button>
              <button className="hover:text-red-500 transition-colors">Terms of Use</button>
              <button className="hover:text-red-500 transition-colors">Cookie Policy</button>
            </div>
          </div>
        </motion.div>
      </div>
    </footer>
  );
}
