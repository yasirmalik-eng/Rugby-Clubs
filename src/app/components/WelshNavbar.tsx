import { motion, useScroll, useTransform } from "motion/react";
import {
  Menu,
  X,
  Ticket,
  Calendar,
  Newspaper,
  Trophy,
  Heart,
} from "lucide-react";
import { useState } from "react";
import { useNavigate, useLocation } from "react-router";

const navLinks = [
  { name: "Home", path: "/" },
  { name: "Fixtures", icon: Calendar, path: "/fixtures" },
  { name: "Tickets", icon: Ticket, path: "/tickets" },
  { name: "News", icon: Newspaper, path: "/news" },
  { name: "Sponsors", icon: Trophy, path: "/sponsors" },
];

export function WelshNavbar() {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const { scrollY } = useScroll();
  const backgroundColor = useTransform(
    scrollY,
    [0, 100],
    ["rgba(10, 10, 10, 0)", "rgba(10, 10, 10, 0.95)"]
  );

  const handleNav = (path: string) => {
    navigate(path);
    setIsOpen(false);
  };

  const isActive = (path: string) => {
    if (path === "/") return location.pathname === "/";
    return location.pathname.startsWith(path);
  };

  return (
    <motion.nav
      style={{ backgroundColor }}
      className="fixed top-0 left-0 right-0 z-50 border-b border-white/10 backdrop-blur-md"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">

          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-3 cursor-pointer"
            onClick={() => handleNav("/")}
          >
            <div className="relative">
              <img
                src="/logo.png"
                alt="North Wales Crusaders"
                className="w-14 h-14 object-contain"
              />
            </div>
            <div>
              <div className="text-lg sm:text-xl font-bold text-white tracking-tight leading-tight">
                North Wales
              </div>
              <div className="text-xs text-red-500 font-semibold tracking-[2px] uppercase">
                Crusaders
              </div>
            </div>
          </motion.div>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-2">
            {navLinks.map((link, index) => {
              const Icon = link.icon;
              return (
                <motion.button
                  key={link.path}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.08 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleNav(link.path)}
                  className={`px-4 py-2 rounded-lg transition-all duration-200 flex items-center gap-2 ${
                    isActive(link.path)
                      ? "bg-red-800 text-white"
                      : "text-gray-300 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  {Icon && <Icon className="w-4 h-4" />}
                  {link.name}
                </motion.button>
              );
            })}
          </div>

          {/* Desktop Right Actions */}
          <div className="hidden lg:flex items-center gap-3">
            {/* Donate */}
            <motion.button
              onClick={() => handleNav("/donate")}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-5 py-2.5 bg-white/5 border border-white/10 text-white rounded-lg font-semibold hover:bg-white/10 transition-all flex items-center gap-2"
            >
              <Heart className="w-4 h-4 text-red-500" />
              DONATE
            </motion.button>

            {/* Buy Tickets */}
            <motion.button
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleNav("/tickets")}
              className="px-6 py-2.5 bg-gradient-to-r from-red-700 to-red-800 text-white rounded-lg font-bold hover:shadow-lg hover:shadow-red-900/50 transition-all duration-200 border border-red-600 flex items-center gap-2"
            >
              <Ticket className="w-4 h-4" />
              BUY TICKETS
            </motion.button>

          </div>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden text-white p-2"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <motion.div
        initial={false}
        animate={{ height: isOpen ? "auto" : 0 }}
        className="lg:hidden overflow-hidden bg-black/95 border-t border-white/10"
      >
        <div className="container mx-auto px-4 py-4 space-y-2">
          {navLinks.map((link) => {
            const Icon = link.icon;
            return (
              <motion.button
                key={link.path}
                whileHover={{ x: 8 }}
                onClick={() => handleNav(link.path)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                  isActive(link.path)
                    ? "bg-red-800 text-white"
                    : "text-gray-300 hover:bg-white/5"
                }`}
              >
                {Icon && <Icon className="w-5 h-5" />}
                {link.name}
              </motion.button>
            );
          })}

          <div className="pt-3 space-y-3">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleNav("/tickets")}
              className="w-full px-6 py-3 bg-gradient-to-r from-red-700 to-red-800 text-white rounded-lg font-bold border border-red-600 flex items-center justify-center gap-2"
            >
              <Ticket className="w-4 h-4" />
              BUY TICKETS
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleNav("/donate")}
              className="w-full px-6 py-3 bg-white/5 border border-white/10 text-white rounded-lg font-bold flex items-center justify-center gap-2"
            >
              <Heart className="w-4 h-4 text-red-500" />
              DONATE
            </motion.button>
          </div>
        </div>
      </motion.div>
    </motion.nav>
  );
}
