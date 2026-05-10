import { motion } from "motion/react";
import { Calendar, MapPin, Clock, Ticket, Trophy } from "lucide-react";

interface Fixture {
  opponent: string;
  date: string;
  time: string;
  venue: string;
  location: string;
  competition: string;
  isHome: boolean;
}

interface FixturesPageProps {
  onNavigate: (page: string, data?: any) => void;
}

const fixtures: Fixture[] = [
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

  const handleTicketClick = (fixture: Fixture) => {
    onNavigate("tickets", {
      match: fixture.opponent,
      date: fixture.date,
      time: fixture.time,
      venue: fixture.venue,
      competition: fixture.competition,
      location: fixture.location
    });
  };

  return (
    <div className="min-h-screen bg-black pt-24 pb-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">

        {/* HEADER */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >

          <div className="inline-flex items-center gap-2 px-4 py-2 bg-red-900/30 border border-red-700 rounded-full mb-5">
            <Trophy className="w-4 h-4 text-red-400" />
            <span className="text-red-400 font-bold text-sm tracking-wide">
              2026 SEASON FIXTURES
            </span>
          </div>

          <h1 className="text-5xl md:text-6xl font-black text-white mb-5">
            MATCH FIXTURES
          </h1>

          <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto">
            Follow North Wales Crusaders throughout the 2026 season and secure
            your tickets for upcoming home fixtures at Stadiwm Eirias.
          </p>

        </motion.div>

        {/* FIXTURES */}
        <div className="max-w-5xl mx-auto space-y-6">

          {fixtures.map((fixture, index) => (

            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.08 }}
              whileHover={{ scale: 1.015 }}
              className="group"
            >

              <div
                className={`rounded-3xl p-6 md:p-8 border transition-all duration-300 ${
                  fixture.isHome
                    ? "border-red-700 bg-gradient-to-br from-red-950/40 via-black to-green-950/20 hover:shadow-2xl hover:shadow-red-900/30"
                    : "border-gray-800 bg-gradient-to-br from-black to-zinc-900"
                }`}
              >

                <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-6">

                  {/* LEFT SIDE */}
                  <div className="flex-1">

                    {/* BADGES */}
                    <div className="flex flex-wrap gap-3 mb-5">

                      <span
                        className={`px-4 py-1.5 text-xs font-bold rounded-full tracking-wide ${
                          fixture.isHome
                            ? "bg-green-700 text-white"
                            : "bg-gray-700 text-gray-300"
                        }`}
                      >
                        {fixture.isHome ? "HOME MATCH" : "AWAY MATCH"}
                      </span>

                      <span className="px-4 py-1.5 text-xs font-bold bg-red-900/40 border border-red-700 text-red-300 rounded-full tracking-wide">
                        {fixture.competition}
                      </span>

                    </div>

                    {/* TITLE */}
                    <h2 className="text-2xl md:text-3xl font-black text-white mb-5 group-hover:text-red-400 transition-colors duration-300">
                      NORTH WALES CRUSADERS vs{" "}
                      {fixture.opponent.toUpperCase()}
                    </h2>

                    {/* INFO */}
                    <div className="grid sm:grid-cols-3 gap-5 text-gray-300">

                      <div className="flex items-center gap-3">
                        <Calendar className="w-5 h-5 text-red-500 flex-shrink-0" />
                        <span className="font-medium">{fixture.date}</span>
                      </div>

                      <div className="flex items-center gap-3">
                        <Clock className="w-5 h-5 text-red-500 flex-shrink-0" />
                        <span className="font-medium">
                          {fixture.time} KO
                        </span>
                      </div>

                      <div className="flex items-center gap-3">
                        <MapPin className="w-5 h-5 text-red-500 flex-shrink-0" />
                        <div>
                          <div className="font-medium">{fixture.venue}</div>
                          <div className="text-sm text-gray-500">
                            {fixture.location}
                          </div>
                        </div>
                      </div>

                    </div>

                    {/* HOME STADIUM LABEL */}
                    {fixture.isHome && (
                      <div className="mt-5 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-900/30 border border-green-700 text-green-400 text-xs font-bold tracking-wide">
                        STADIWM EIRIAS HOME GAME
                      </div>
                    )}

                  </div>

                  {/* BUTTON */}
                  {fixture.isHome && (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleTicketClick(fixture)}
                      className="px-6 py-3 bg-gradient-to-r from-red-700 to-red-800 hover:from-red-600 hover:to-red-700 text-white rounded-full font-bold flex items-center justify-center gap-2 transition-all duration-300 shadow-lg whitespace-nowrap"
                    >
                      <Ticket className="w-4 h-4" />
                      BUY TICKETS
                    </motion.button>
                  )}

                </div>

              </div>

            </motion.div>

          ))}

        </div>

      </div>
    </div>
  );
}