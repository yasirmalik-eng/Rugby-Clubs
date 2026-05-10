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

interface WelshNavbarProps {
  currentPage: string;
  onNavigate: (page: string) => void;
}

export function WelshNavbar({
  currentPage,
  onNavigate,
}: WelshNavbarProps) {
  const [isOpen, setIsOpen] = useState(false);

  const { scrollY } = useScroll();

  const backgroundColor = useTransform(
    scrollY,
    [0, 100],
    ["rgba(10, 10, 10, 0)", "rgba(10, 10, 10, 0.95)"]
  );

  // Club removed
  const navLinks = [
    { name: "Home", page: "home" },
    { name: "Fixtures", icon: Calendar, page: "fixtures" },
    { name: "Tickets", icon: Ticket, page: "tickets" },
    { name: "News", icon: Newspaper, page: "news" },
    { name: "Sponsors", icon: Trophy, page: "sponsors" },
  ];

  return (
    <motion.nav
      style={{ backgroundColor }}
      className="fixed top-0 left-0 right-0 z-50 border-b border-white/10 backdrop-blur-md"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo Section */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-3 cursor-pointer"
            onClick={() => onNavigate("home")}
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

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-2">
            {navLinks.map((link, index) => {
              const Icon = link.icon;

              return (
                <motion.button
                  key={link.page}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.08 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    onNavigate(link.page);
                    setIsOpen(false);
                  }}
                  className={`px-4 py-2 rounded-lg transition-all duration-200 flex items-center gap-2 ${
                    currentPage === link.page
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

          {/* Desktop Buttons */}
          <div className="hidden lg:flex items-center gap-3">
            
            {/* Donate Button */}
            {/* <motion.button
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-6 py-3 bg-gradient-to-r from-red-700 to-red-800 text-white rounded-lg font-bold hover:shadow-lg hover:shadow-red-900/50 transition-all duration-200 border border-red-600 flex items-center gap-2"
            >
              <Heart className="w-4 h-4" />
              DONATE
            </motion.button> */}
            <motion.button
  onClick={() => onNavigate("donate")}   // 👈 THIS CONNECTS PAGE
  initial={{ opacity: 0, x: 20 }}
  animate={{ opacity: 1, x: 0 }}
  whileHover={{ scale: 1.05 }}
  whileTap={{ scale: 0.95 }}
  className="px-6 py-3 bg-gradient-to-r from-red-700 to-red-800 text-white rounded-lg font-bold hover:shadow-lg hover:shadow-red-900/50 transition-all duration-200 border border-red-600 flex items-center gap-2"
>
  <Heart className="w-4 h-4" />
  DONATE
</motion.button>

            {/* Buy Tickets Button */}
            <motion.button
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onNavigate("tickets")}
              className="px-6 py-3 bg-gradient-to-r from-red-700 to-red-800 text-white rounded-lg font-bold hover:shadow-lg hover:shadow-red-900/50 transition-all duration-200 border border-red-600 flex items-center gap-2"
            >
              <Ticket className="w-4 h-4" />
              BUY TICKETS
            </motion.button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden text-white p-2"
          >
            {isOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
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
                key={link.page}
                whileHover={{ x: 8 }}
                onClick={() => {
                  onNavigate(link.page);
                  setIsOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                  currentPage === link.page
                    ? "bg-red-800 text-white"
                    : "text-gray-300 hover:bg-white/5"
                }`}
              >
                {Icon && <Icon className="w-5 h-5" />}
                {link.name}
              </motion.button>
            );
          })}

          {/* Mobile Buttons */}
          <div className="pt-3 space-y-3">
            
            {/* Donate Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full px-6 py-3 bg-gradient-to-r from-red-700 to-red-800 text-white rounded-lg font-bold border border-red-600 flex items-center justify-center gap-2"
            >
              <Heart className="w-4 h-4" />
              DONATE
            </motion.button>

            {/* Buy Tickets Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                onNavigate("tickets");
                setIsOpen(false);
              }}
              className="w-full px-6 py-3 bg-gradient-to-r from-red-700 to-red-800 text-white rounded-lg font-bold border border-red-600 flex items-center justify-center gap-2"
            >
              <Ticket className="w-4 h-4" />
              BUY TICKETS
            </motion.button>
          </div>
        </div>
      </motion.div>
    </motion.nav>
  );
}