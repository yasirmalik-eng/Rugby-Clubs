import { motion } from "motion/react";
import { WelshHero } from "../components/WelshHero";
import { Ticket, Calendar, ArrowRight, Flame } from "lucide-react";

interface HomePageProps {
  onNavigate: (page: string) => void;
}

export function HomePage({ onNavigate }: HomePageProps) {

  const news = [
    {
      title: "Victory Against Cardiff Blues",
      date: "May 5, 2026",
      excerpt: "Dominant performance secures crucial win in front of home crowd",
      image: "https://images.unsplash.com/photo-1557161283-c995e88037d4?w=800"
    },
    {
      title: "Season Tickets Now Available",
      date: "May 3, 2026",
      excerpt: "Secure your place at Eirias Stadium for the entire season",
      image: "https://images.unsplash.com/photo-1774916927099-5b0c72f2a683?w=800"
    },
    {
      title: "Youth Academy Success",
      date: "May 1, 2026",
      excerpt: "Three academy players selected for regional squad",
      image: "https://images.unsplash.com/photo-1760163506380-2be2a2f8bf0a?w=800"
    }
  ];

  return (
    <div>
      <WelshHero onNavigate={onNavigate} />

      {/* NEXT HOME GAME */}
      <section className="py-24 bg-gradient-to-b from-black to-red-950/30 relative overflow-hidden">

        <div className="absolute inset-0 opacity-10 bg-[url('https://images.unsplash.com/photo-1671042299447-f6f67b313f32?w=1920')] bg-cover bg-center" />

        <div className="container mx-auto px-4 relative z-10">

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-red-800/30 border border-red-600 rounded-full mb-4">
              <Flame className="w-4 h-4 text-red-400" />
              <span className="text-red-400 font-bold text-sm">
                NEXT HOME GAME
              </span>
            </div>

            <h2 className="text-4xl md:text-5xl font-black text-white mb-2">
              EIRIAS STADIUM SHOWDOWN
            </h2>

            <p className="text-gray-400">
              Official fixture announcement coming soon
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto bg-gradient-to-br from-red-900/40 to-black/60 border border-red-700 rounded-3xl p-10 text-center shadow-2xl"
          >

            <div className="text-3xl md:text-4xl font-black text-white mb-4">
              NEXT HOME MATCH
            </div>

            <div className="flex items-center justify-center gap-2 text-gray-300 mb-2">
              <Calendar className="w-5 h-5 text-red-500" />
              <span className="font-bold">DATE TBA</span>
            </div>

            <div className="text-2xl font-bold text-green-500 mb-2">
              KICK OFF TIME TBA
            </div>

            <div className="text-gray-400">
              Eirias Stadium, Colwyn Bay
            </div>

            <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">

              <button
                onClick={() => onNavigate("tickets")}
                className="px-8 py-4 bg-red-700 hover:bg-red-600 transition-all text-white rounded-xl font-black flex items-center justify-center gap-2"
              >
                <Ticket className="w-5 h-5" />
                BUY TICKETS
              </button>

              <button
                onClick={() => onNavigate("fixtures")}
                className="px-8 py-4 border border-green-700 text-white rounded-xl font-bold hover:bg-white/5 transition-all"
              >
                VIEW FIXTURES
                <ArrowRight className="w-5 h-5 inline ml-2" />
              </button>

            </div>

          </motion.div>

        </div>
      </section>

      {/* SPONSORS */}
      <section className="py-20 bg-gradient-to-b from-black to-green-950/20">

        <div className="container mx-auto px-4">

          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-black text-white mb-4">
              OUR PROUD SPONSORS
            </h2>

            <p className="text-gray-400">
              Partner with North Wales Crusaders
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">

            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="aspect-square bg-gradient-to-br from-red-900/30 to-black border border-dashed border-red-600 rounded-xl flex items-center justify-center"
              >
                <div className="text-center">
                  <div className="text-sm font-black text-red-400">COMING</div>
                  <div className="text-lg font-bold text-white">SOON</div>
                </div>
              </div>
            ))}

          </div>

        </div>

      </section>

      {/* NEWS */}
      <section className="py-20 bg-black">

        <div className="container mx-auto px-4">

          <h2 className="text-3xl md:text-4xl font-black text-white text-center mb-10">
            LATEST NEWS
          </h2>

          <div className="grid md:grid-cols-3 gap-6">

            {news.map((n, i) => (
              <div key={i} className="bg-white/5 border border-white/10 rounded-xl overflow-hidden">

                <img src={n.image} className="w-full h-48 object-cover" />

                <div className="p-5">
                  <div className="text-xs text-red-500">{n.date}</div>
                  <h3 className="text-white font-bold">{n.title}</h3>
                  <p className="text-gray-400 text-sm">{n.excerpt}</p>
                </div>

              </div>
            ))}

          </div>

        </div>

      </section>

    </div>
  );
}