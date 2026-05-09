import { motion } from "motion/react";
import { Calendar, MapPin, Clock, Ticket, Trophy } from "lucide-react";

interface FixturesPageProps {
  onNavigate: (page: string) => void;
}

const fixtures = [
  {
    opponent: "Llanelli Scarlets",
    date: "May 15, 2026",
    time: "15:00",
    venue: "Eirias Stadium",
    location: "Colwyn Bay",
    competition: "Welsh Premier Division",
    isHome: true
  },
  {
    opponent: "Cardiff Blues",
    date: "May 22, 2026",
    time: "14:30",
    venue: "Cardiff Arms Park",
    location: "Cardiff",
    competition: "Welsh Cup Semi-Final",
    isHome: false
  },
  {
    opponent: "Newport Dragons",
    date: "May 29, 2026",
    time: "16:00",
    venue: "Eirias Stadium",
    location: "Colwyn Bay",
    competition: "Welsh Premier Division",
    isHome: true
  },
  {
    opponent: "Swansea RFC",
    date: "June 5, 2026",
    time: "15:00",
    venue: "St. Helen's",
    location: "Swansea",
    competition: "Welsh Premier Division",
    isHome: false
  },
  {
    opponent: "Aberavon RFC",
    date: "June 12, 2026",
    time: "14:00",
    venue: "Eirias Stadium",
    location: "Colwyn Bay",
    competition: "Welsh Cup Final",
    isHome: true
  },
  {
    opponent: "Pontypridd RFC",
    date: "June 19, 2026",
    time: "15:30",
    venue: "Sardis Road",
    location: "Pontypridd",
    competition: "Welsh Premier Division",
    isHome: false
  }
];

export function FixturesPage({ onNavigate }: FixturesPageProps) {
  return (
    <div className="min-h-screen bg-black pt-24 pb-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-block px-4 py-2 bg-red-800/30 border border-red-600 rounded-full mb-4">
            <span className="text-red-400 font-bold text-sm flex items-center gap-2">
              <Trophy className="w-4 h-4" />
              2026 SEASON
            </span>
          </div>
          <h1 className="text-5xl md:text-6xl font-black text-white mb-4">
            MATCH FIXTURES
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Join us at Eirias Stadium for an unforgettable match-day experience
          </p>
        </motion.div>

        <div className="max-w-5xl mx-auto space-y-6">
          {fixtures.map((fixture, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ scale: 1.02, x: 8 }}
              className="group relative"
            >
              {fixture.isHome && (
                <div className="absolute -left-2 top-0 bottom-0 w-1 bg-gradient-to-b from-red-600 to-green-700 rounded-full"></div>
              )}

              <div className={`rounded-2xl p-6 md:p-8 transition-all duration-300 border-2 ${
                fixture.isHome
                  ? "bg-gradient-to-br from-red-900/40 to-black/60 border-red-600 hover:shadow-2xl hover:shadow-red-900/50"
                  : "bg-gradient-to-br from-gray-900/40 to-black/60 border-gray-700 hover:border-gray-600"
              }`}>
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-4">
                      <div className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${
                        fixture.isHome
                          ? "bg-red-600 text-white"
                          : "bg-gray-700 text-gray-300"
                      }`}>
                        {fixture.isHome ? "HOME MATCH" : "AWAY MATCH"}
                      </div>
                      <div className="px-3 py-1 bg-green-900/50 border border-green-700 rounded-full text-xs font-bold text-green-400">
                        {fixture.competition}
                      </div>
                    </div>

                    <h3 className="text-2xl md:text-3xl font-black text-white mb-4 group-hover:text-red-400 transition-colors">
                      WELSH RFC vs {fixture.opponent.toUpperCase()}
                    </h3>

                    <div className="grid sm:grid-cols-3 gap-4 text-gray-300">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-5 h-5 text-red-500 flex-shrink-0" />
                        <span className="font-semibold">{fixture.date}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-5 h-5 text-red-500 flex-shrink-0" />
                        <span className="font-semibold">{fixture.time} KO</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-5 h-5 text-red-500 flex-shrink-0" />
                        <div>
                          <div className="font-semibold">{fixture.venue}</div>
                          <div className="text-sm text-gray-500">{fixture.location}</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {fixture.isHome && (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => onNavigate("tickets")}
                      className="px-8 py-4 bg-gradient-to-r from-red-700 to-red-800 text-white rounded-lg font-bold shadow-lg border-2 border-red-600 flex items-center justify-center gap-2 whitespace-nowrap"
                    >
                      <Ticket className="w-5 h-5" />
                      BUY TICKETS
                    </motion.button>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-16 text-center"
        >
          <div className="bg-gradient-to-r from-red-900/20 via-green-900/20 to-red-900/20 border-2 border-red-600/30 rounded-2xl p-8 max-w-3xl mx-auto">
            <h3 className="text-2xl font-black text-white mb-4">
              SEASON TICKETS AVAILABLE
            </h3>
            <p className="text-gray-300 mb-6">
              Secure your seat for every home match and save up to 40%
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onNavigate("tickets")}
              className="px-10 py-4 bg-gradient-to-r from-green-700 to-green-800 text-white rounded-lg font-bold shadow-lg border-2 border-green-600"
            >
              VIEW SEASON TICKETS
            </motion.button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
