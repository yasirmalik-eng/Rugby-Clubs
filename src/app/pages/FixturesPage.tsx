import { motion } from "motion/react";
import { Calendar, MapPin, Clock, Ticket, Trophy } from "lucide-react";
import { useNavigate } from "react-router";
import { format } from "date-fns";
import { useFixtures } from "../../hooks/useFixtures";

export function FixturesPage() {
  const navigate = useNavigate();
  const { fixtures, loading, error } = useFixtures("all");

  return (
    <div className="min-h-screen bg-black pt-24 pb-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-16 text-center"
        >
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-red-700 bg-red-900/30 px-4 py-2">
            <Trophy className="h-4 w-4 text-red-400" />
            <span className="text-sm font-bold text-red-400">2026 FIXTURES</span>
          </div>

          <h1 className="mb-5 text-5xl font-black text-white">MATCH FIXTURES</h1>

          <p className="mx-auto max-w-2xl text-gray-400">
            North Wales Crusaders 2026 season fixtures — click home games to buy tickets.
          </p>
        </motion.div>

        <div className="mx-auto max-w-5xl space-y-6">
          {loading ? (
            Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="rounded-3xl border border-gray-800 bg-zinc-900/50 p-6 animate-pulse">
                <div className="mb-4 h-5 w-32 rounded bg-white/10" />
                <div className="mb-4 h-8 w-3/4 rounded bg-white/10" />
                <div className="space-y-2">
                  <div className="h-4 w-40 rounded bg-white/5" />
                  <div className="h-4 w-32 rounded bg-white/5" />
                </div>
              </div>
            ))
          ) : error ? (
            <p className="text-center text-red-400">Failed to load fixtures. Please try again.</p>
          ) : fixtures.length === 0 ? (
            <p className="py-20 text-center text-gray-500">No fixtures found right now.</p>
          ) : (
            fixtures.map((fixture, index) => {
              const isPast = new Date(fixture.match_date) < new Date(new Date().toISOString().split("T")[0]);

              return (
              <motion.div
                key={fixture.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="rounded-3xl border border-gray-800 bg-gradient-to-br from-black to-zinc-900 p-6"
              >
                <div className="flex flex-col justify-between gap-6 lg:flex-row">
                  <div>
                    <div className="mb-4 flex gap-2">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-bold text-white ${
                          fixture.is_home ? "bg-green-700" : "bg-gray-700"
                        }`}
                      >
                        {fixture.is_home ? "HOME (H)" : "AWAY (A)"}
                      </span>

                      <span className="rounded-full bg-red-900/40 px-3 py-1 text-xs text-red-300">
                        {fixture.competition}
                      </span>
                    </div>

                    <h2 className="mb-4 text-2xl font-bold text-white">
                      NORTH WALES CRUSADERS vs {fixture.opponent.toUpperCase()}
                    </h2>

                    <div className="space-y-2 text-gray-300">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-red-500" />
                        {format(new Date(fixture.match_date), "d MMMM yyyy")}
                      </div>

                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-red-500" />
                        {fixture.kick_off_time.slice(0, 5)}
                      </div>

                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-red-500" />
                        {fixture.venue}
                      </div>
                    </div>

                    {fixture.home_score !== null && fixture.away_score !== null && (
                      <div className="mt-4 inline-flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-4 py-2">
                        <span className="text-xl font-black text-white">{fixture.home_score}</span>
                        <span className="text-sm text-gray-500">-</span>
                        <span className="text-xl font-black text-white">{fixture.away_score}</span>
                        <span
                          className={`ml-2 rounded-full px-2 py-0.5 text-xs font-bold ${
                            fixture.result === "W"
                              ? "bg-green-700 text-white"
                              : fixture.result === "L"
                                ? "bg-red-800 text-white"
                                : "bg-gray-700 text-white"
                          }`}
                        >
                          {fixture.result}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="flex items-start">
                    <button
                      onClick={() =>
                        fixture.is_home && !isPast &&
                        navigate(
                          fixture.tickets_available ? `/tickets?fixture=${fixture.id}` : "/tickets",
                        )
                      }
                      disabled={!fixture.is_home || isPast}
                      className={`inline-flex items-center gap-2 rounded-lg px-4 py-2 font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-2 focus:ring-offset-black ${
                        isPast 
                          ? "cursor-not-allowed border border-white/10 bg-white/5 text-gray-500"
                          : fixture.is_home
                            ? "bg-red-600 text-white hover:bg-red-500"
                            : "cursor-not-allowed border border-white/10 bg-white/5 text-gray-500"
                      }`}
                    >
                      <Ticket className="h-4 w-4" />
                      {isPast ? "MATCH CONCLUDED" : fixture.is_home ? "BUY TICKETS" : "AWAY FIXTURE"}
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })
          )}

        </div>
      </div>
    </div>
  );
} 