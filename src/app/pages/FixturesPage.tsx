import { motion } from "motion/react";
import { Calendar, MapPin, Clock, Ticket, Trophy } from "lucide-react";

interface Fixture {
  id: string;
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
    id: "batley",
    opponent: "Batley Bulldogs",
    date: "24 May",
    time: "15:00",
    venue: "Eirias Stadium",
    location: "Colwyn Bay",
    competition: "Betfred Championship",
    isHome: false
  },
  {
    id: "salford1",
    opponent: "Salford RLFC",
    date: "31 May",
    time: "15:00",
    venue: "Eirias Stadium",
    location: "Colwyn Bay",
    competition: "Betfred Championship",
    isHome: true
  },
  {
    id: "london",
    opponent: "London Broncos",
    date: "7 June",
    time: "15:00",
    venue: "Eirias Stadium",
    location: "Colwyn Bay",
    competition: "Betfred Championship",
    isHome: true
  },
  {
    id: "whitehaven",
    opponent: "Whitehaven",
    date: "14 June",
    time: "15:00",
    venue: "Eirias Stadium",
    location: "Colwyn Bay",
    competition: "Betfred Championship",
    isHome: false
  },
  {
    id: "halifax",
    opponent: "Halifax Panthers",
    date: "21 June",
    time: "15:00",
    venue: "Eirias Stadium",
    location: "Colwyn Bay",
    competition: "Betfred Championship",
    isHome: true
  },
  {
    id: "salford2",
    opponent: "Salford RLFC",
    date: "5 July",
    time: "15:00",
    venue: "Eirias Stadium",
    location: "Colwyn Bay",
    competition: "Betfred Championship",
    isHome: false
  },
  {
    id: "widnes",
    opponent: "Widnes Vikings",
    date: "12 July",
    time: "15:00",
    venue: "Eirias Stadium",
    location: "Colwyn Bay",
    competition: "Betfred Championship",
    isHome: true
  },
  {
    id: "newcastle",
    opponent: "Newcastle Thunder",
    date: "19 July",
    time: "15:00",
    venue: "Eirias Stadium",
    location: "Colwyn Bay",
    competition: "Betfred Championship",
    isHome: true
  },
  {
    id: "goole",
    opponent: "Goole Vikings",
    date: "2 August",
    time: "15:00",
    venue: "Eirias Stadium",
    location: "Colwyn Bay",
    competition: "Betfred Championship",
    isHome: true
  },
  {
    id: "swinton",
    opponent: "Swinton Lions",
    date: "16 August",
    time: "15:00",
    venue: "Eirias Stadium",
    location: "Colwyn Bay",
    competition: "Betfred Championship",
    isHome: false
  },
  {
    id: "keighley",
    opponent: "Keighley Cougars",
    date: "23 August",
    time: "15:00",
    venue: "Eirias Stadium",
    location: "Colwyn Bay",
    competition: "Betfred Championship",
    isHome: true
  },
  {
    id: "midlands",
    opponent: "Midlands Hurricanes",
    date: "30 August",
    time: "15:00",
    venue: "Eirias Stadium",
    location: "Colwyn Bay",
    competition: "Betfred Championship",
    isHome: false
  }
];

export function FixturesPage({ onNavigate }: FixturesPageProps) {

  const handleTicketClick = (fixture: Fixture) => {
    onNavigate("tickets", {
      matchId: fixture.id,
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
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-red-900/30 border border-red-700 rounded-full mb-5">
            <Trophy className="w-4 h-4 text-red-400" />
            <span className="text-red-400 font-bold text-sm">
              2026 FIXTURES
            </span>
          </div>

          <h1 className="text-5xl font-black text-white mb-5">
            MATCH FIXTURES
          </h1>

          <p className="text-gray-400 max-w-2xl mx-auto">
            North Wales Crusaders 2026 season fixtures — home games only have tickets.
          </p>
        </motion.div>

        {/* FIXTURES LIST */}
        <div className="max-w-5xl mx-auto space-y-6">

          {fixtures.map((fixture, index) => (

            <motion.div
              key={fixture.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="rounded-3xl p-6 border border-gray-800 bg-gradient-to-br from-black to-zinc-900"
            >

              <div className="flex flex-col lg:flex-row justify-between gap-6">

                {/* LEFT */}
                <div>

                  <div className="flex gap-2 mb-4">
                    <span className={`px-3 py-1 text-xs rounded-full font-bold ${
                      fixture.isHome ? "bg-green-700" : "bg-gray-700"
                    } text-white`}>
                      {fixture.isHome ? "HOME (H)" : "AWAY (A)"}
                    </span>

                    <span className="px-3 py-1 text-xs rounded-full bg-red-900/40 text-red-300">
                      {fixture.competition}
                    </span>
                  </div>

                  <h2 className="text-2xl font-bold text-white mb-4">
                    NORTH WALES CRUSADERS vs {fixture.opponent.toUpperCase()}
                  </h2>

                  <div className="space-y-2 text-gray-300">

                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-red-500" />
                      {fixture.date}
                    </div>

                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-red-500" />
                      {fixture.time}
                    </div>

                    {fixture.isHome && (
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-red-500" />
                        {fixture.venue} - {fixture.location}
                      </div>
                    )}

                  </div>

                </div>

   <div className="flex items-center lg:justify-end justify-start">
  {fixture.isHome && (
    <button
      onClick={() => handleTicketClick(fixture)}
      className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-500 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-2 focus:ring-offset-black"
    >
      <Ticket className="w-4 h-4" />
      BUY TICKETS
    </button>
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