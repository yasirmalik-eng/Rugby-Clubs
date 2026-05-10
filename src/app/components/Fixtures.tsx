import { motion } from "motion/react";
import { Calendar, MapPin, Clock } from "lucide-react";

// Match type (fixes TypeScript issues)
interface Match {
  id: number;
  opponent: string;
  date: string;
  time: string;
  venue: string;
  competition: string;
  isHome: boolean;
}

// Props type (FIX for your error)
interface FixturesProps {
  onNavigate: (page: string, match?: Match) => void;
}

const upcomingMatches: Match[] = [
  {
    id: 1,
    opponent: "Cardiff Blues",
    date: "May 15, 2026",
    time: "15:00",
    venue: "Cardiff Arms Park",
    competition: "Welsh Premier Division",
    isHome: false,
  },
  {
    id: 2,
    opponent: "Llanelli Scarlets",
    date: "May 22, 2026",
    time: "14:30",
    venue: "Home Ground",
    competition: "Welsh Cup Semi-Final",
    isHome: true,
  },
  {
    id: 3,
    opponent: "Newport Dragons",
    date: "May 29, 2026",
    time: "16:00",
    venue: "Rodney Parade",
    competition: "Welsh Premier Division",
    isHome: false,
  },
];

export function Fixtures({ onNavigate }: FixturesProps) {
  // Only HOME matches (H rule fix)
  const homeMatches = upcomingMatches.filter((match) => match.isHome);

  return (
    <section className="py-16 sm:py-20 md:py-24 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">

        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 sm:mb-16"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Upcoming Fixtures
          </h2>

          <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto">
            Support our team in the upcoming home matches
          </p>
        </motion.div>

        {/* Matches */}
        <div className="max-w-4xl mx-auto space-y-4 sm:space-y-6">

          {homeMatches.map((match, index) => (
            <motion.div
              key={match.id}
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ scale: 1.02, x: 8 }}
              className="group"
            >
              <div className="bg-gradient-to-r from-red-50 to-white rounded-2xl p-6 sm:p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border-l-4 border-red-600">

                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">

                  {/* Match Info */}
                  <div className="flex-1">

                    <div className="inline-block px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs sm:text-sm font-semibold mb-3">
                      {match.competition}
                    </div>

                    <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2 group-hover:text-red-600 transition-colors">
                      North Wales Crusaders vs {match.opponent}
                    </h3>

                    <div className="flex flex-wrap gap-4 text-gray-600">

                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-red-600" />
                        <span className="text-sm sm:text-base">{match.date}</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-red-600" />
                        <span className="text-sm sm:text-base">{match.time}</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-red-600" />
                        <span className="text-sm sm:text-base">{match.venue}</span>
                      </div>

                    </div>
                  </div>

                  {/* Ticket Button */}
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => onNavigate("tickets", match)}
                    className="px-6 py-3 bg-red-600 text-white rounded-full font-semibold shadow-lg hover:bg-red-700 transition-all duration-300 lg:ml-4"
                  >
                    Get Tickets
                  </motion.button>

                </div>
              </div>
            </motion.div>
          ))}

        </div>
      </div>
    </section>
  );
}