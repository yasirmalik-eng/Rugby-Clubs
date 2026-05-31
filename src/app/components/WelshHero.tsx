import { motion } from "motion/react";
import { Ticket, Calendar, FileText, Download } from "lucide-react";
import { useNavigate } from "react-router";

export function WelshHero() {
  const navigate = useNavigate();

  return (
    <section className="relative min-h-screen mt-[90px] flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('https://upload.wikimedia.org/wikipedia/commons/thumb/e/e7/Stadiwm_CSM.jpg/960px-Stadiwm_CSM.jpg')`,
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-red-900/30 to-transparent" />
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center max-w-5xl mx-auto"
        >
          {/* Logo */}
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: 0.2, duration: 0.8, type: "spring" }}
            className="inline-block mb-6"
          >
            <div className="relative">
              <div className="w-36 h-36 mx-auto bg-black rounded-full flex items-center justify-center border-4 border-red-600 shadow-2xl shadow-red-900/50 overflow-hidden p-3 backdrop-blur-md">
                <img
                  src="/logo.png"
                  alt="North Wales Crusaders Logo"
                  className="w-full h-full object-contain drop-shadow-2xl"
                />
              </div>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 border-4 border-transparent border-t-green-500 border-r-green-500 rounded-full"
              />
            </div>
          </motion.div>

          {/* Heading */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="mb-6"
          >
            <div className="text-md sm:text-lg font-extrabold text-white tracking-[0.3em] mb-4 uppercase">
              2026
            </div>
            <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black text-white mb-4 tracking-tight leading-tight">
              <span className="bg-gradient-to-r from-red-500 via-red-600 to-red-700 text-transparent bg-clip-text">
                North
              </span>
              <br />
              <span className="text-white">Wales Crusaders</span>
            </h1>
          </motion.div>

          {/* Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <motion.button
              whileHover={{ scale: 1.05, boxShadow: "0 20px 40px rgba(139,0,0,0.4)" }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate("/tickets")}
              className="group px-10 py-5 bg-gradient-to-r from-red-700 to-red-800 text-white rounded-xl font-bold shadow-xl shadow-red-900/50 transition-all duration-300 border-2 border-red-600 flex items-center gap-3 hover:from-red-600 hover:to-red-700"
            >
              <Ticket className="w-6 h-6 group-hover:rotate-12 transition-transform" />
              BUY MATCH TICKETS
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate("/fixtures")}
              className="group px-10 py-5 bg-white/10 backdrop-blur-md text-white rounded-xl font-bold border-2 border-green-700 hover:bg-green-700/20 transition-all duration-300 flex items-center gap-3"
            >
              <Calendar className="w-6 h-6 group-hover:scale-110 transition-transform" />
              VIEW FIXTURES
            </motion.button>

            <motion.a
              whileHover={{ scale: 1.05, boxShadow: "0 20px 40px rgba(34,197,94,0.3)" }}
              whileTap={{ scale: 0.95 }}
              href="/programme-v-salford-31st-may-2026.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="group px-10 py-5 bg-gradient-to-r from-green-700 to-green-800 text-white rounded-xl font-bold shadow-xl shadow-green-900/50 transition-all duration-300 border-2 border-green-600 flex items-center gap-3 hover:from-green-600 hover:to-green-700 cursor-pointer"
            >
              <FileText className="w-6 h-6 group-hover:scale-110 transition-transform" />
              MATCH PROGRAMME
            </motion.a>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}