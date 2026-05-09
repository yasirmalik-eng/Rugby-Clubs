import { motion } from "motion/react";
import { Ticket, Calendar, Trophy } from "lucide-react";

interface WelshHeroProps {
  onNavigate: (page: string) => void;
}

export function WelshHero({ onNavigate }: WelshHeroProps) {
  return (
    <section className="relative min-h-screen mt-[90px] flex items-center justify-center overflow-hidden">

      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1633785587101-58bc8350818f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwzfHxydWdieSUyMHN0YWRpdW0lMjBhdG1vc3BoZXJlJTIwY3Jvd2R8ZW58MXx8fHwxNzc4MzI2MjQ3fDA&ixlib=rb-4.1.0&q=80&w=1920')`,
        }}
      >
        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black via-black/70 to-black"></div>

        {/* Red Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-red-900/30 to-transparent"></div>
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
            transition={{
              delay: 0.2,
              duration: 0.8,
              type: "spring",
            }}
            className="inline-block mb-6"
          >
            <div className="relative">
              <div className="w-32 h-32 mx-auto bg-gradient-to-br from-red-800 to-red-900 rounded-full flex items-center justify-center border-4 border-red-600 shadow-2xl shadow-red-900/50">
                <Trophy className="w-16 h-16 text-yellow-400" />
              </div>

              <motion.div
                animate={{ rotate: 360 }}
                transition={{
                  duration: 20,
                  repeat: Infinity,
                  ease: "linear",
                }}
                className="absolute inset-0 border-4 border-transparent border-t-green-600 border-r-green-600 rounded-full"
              />
            </div>
          </motion.div>

          {/* Heading */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="mb-4"
          >
            <div className="text-sm sm:text-base font-bold text-green-500 tracking-[0.3em] mb-3">
              ESTABLISHED 1899
            </div>

            <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black text-white mb-4 tracking-tight leading-tight">
              <span className="bg-gradient-to-r from-red-500 via-red-600 to-red-700 text-transparent bg-clip-text">
                WELSH
              </span>

              <br />

              <span className="text-white">
                RUGBY CLUB
              </span>
            </h1>
          </motion.div>

          {/* Paragraph */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="text-xl sm:text-2xl md:text-3xl text-gray-300 mb-12 max-w-3xl mx-auto font-light"
          >
            Pride. Passion.
            <span className="text-green-500 font-bold">
              {" "}Power.
            </span>

            <br />

            <span className="text-lg sm:text-xl text-gray-400 mt-2 block">
              Experience the roar of Eirias Stadium
            </span>
          </motion.p>

          {/* Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >

            {/* Ticket Button */}
            <motion.button
              whileHover={{
                scale: 1.05,
                boxShadow: "0 20px 40px rgba(139,0,0,0.4)",
              }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onNavigate("tickets")}
              className="group px-10 py-5 bg-gradient-to-r from-red-700 to-red-800 text-white rounded-lg font-bold shadow-xl shadow-red-900/50 transition-all duration-300 border-2 border-red-600 flex items-center gap-3"
            >
              <Ticket className="w-6 h-6 group-hover:rotate-12 transition-transform" />

              BUY MATCH TICKETS
            </motion.button>

            {/* Fixtures Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onNavigate("fixtures")}
              className="group px-10 py-5 bg-white/5 backdrop-blur-sm text-white rounded-lg font-bold border-2 border-green-700 hover:bg-green-700/20 transition-all duration-300 flex items-center gap-3"
            >
              <Calendar className="w-6 h-6 group-hover:scale-110 transition-transform" />

              VIEW FIXTURES
            </motion.button>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{
              delay: 1,
              duration: 0.6,
            }}
            className="mt-16 flex items-center justify-center gap-8 text-gray-400 flex-wrap"
          >

            <div className="text-center">
              <div className="text-3xl font-bold text-white">
                127+
              </div>

              <div className="text-sm">
                Years
              </div>
            </div>

            <div className="w-px h-12 bg-white/20 hidden sm:block"></div>

            <div className="text-center">
              <div className="text-3xl font-bold text-white">
                450+
              </div>

              <div className="text-sm">
                Members
              </div>
            </div>

            <div className="w-px h-12 bg-white/20 hidden sm:block"></div>

            <div className="text-center">
              <div className="text-3xl font-bold text-white">
                23
              </div>

              <div className="text-sm">
                Trophies
              </div>
            </div>

          </motion.div>

        </motion.div>
      </div>
    </section>
  );
}