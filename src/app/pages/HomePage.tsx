import { motion } from "motion/react";
import { WelshHero } from "../components/WelshHero";
import { Ticket, Calendar, Users, Trophy, ArrowRight, Flame } from "lucide-react";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";

interface HomePageProps {
  onNavigate: (page: string) => void;
}

export function HomePage({ onNavigate }: HomePageProps) {
  const sponsors = Array.from({ length: 6 });

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

      {/* NEXT FIXTURE SECTION */}
      <section className="py-20 bg-gradient-to-b from-black to-red-950/20 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `url('https://images.unsplash.com/photo-1671042299447-f6f67b313f32?w=1920')`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          />
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <div className="inline-block px-4 py-2 bg-red-800/30 border border-red-600 rounded-full mb-4">
              <span className="text-red-400 font-bold text-sm flex items-center gap-2">
                <Flame className="w-4 h-4" />
                NEXT HOME MATCH
              </span>
            </div>

            <h2 className="text-4xl md:text-5xl font-black text-white mb-4">
              UPCOMING FIXTURE
            </h2>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            whileHover={{ scale: 1.02 }}
            className="max-w-4xl mx-auto bg-gradient-to-br from-red-900/40 to-black/40 backdrop-blur-sm border-2 border-red-600 rounded-2xl p-8 md:p-12 shadow-2xl shadow-red-900/50"
          >
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-black text-white mb-4">
                FIXTURE COMING SOON
              </div>

              <p className="text-gray-300 mb-6">
                Next opponent will be announced shortly by the club
              </p>

              <div className="flex items-center justify-center gap-2 text-gray-300 mb-2">
                <Calendar className="w-5 h-5 text-red-500" />
                <span className="font-bold">DATE TBA</span>
              </div>

              <div className="text-2xl font-bold text-green-500">
                TIME TBA
              </div>

              <div className="text-sm text-gray-400 mt-2">
                Eirias Stadium
              </div>
            </div>

            <div className="mt-8 pt-8 border-t border-white/10 flex flex-col sm:flex-row gap-4 justify-center">

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => onNavigate("tickets")}
                className="px-8 py-4 bg-gradient-to-r from-red-700 to-red-800 text-white rounded-lg font-bold border-2 border-red-600 flex items-center justify-center gap-2"
              >
                <Ticket className="w-5 h-5" />
                BUY TICKETS
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => onNavigate("fixtures")}
                className="px-8 py-4 bg-white/5 text-white rounded-lg font-bold border-2 border-green-700"
              >
                VIEW ALL FIXTURES
                <ArrowRight className="w-5 h-5 inline ml-2" />
              </motion.button>

            </div>
          </motion.div>
        </div>
      </section>

      {/* HERITAGE SECTION */}
      <section className="py-20 bg-black relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1759951913073-9c5d411002d1?w=1920')`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            filter: "grayscale(100%)"
          }}
        />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* unchanged */}
        </div>
      </section>

      {/* SPONSORS (UPDATED) */}
      <section className="py-20 bg-gradient-to-b from-black to-green-950/20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">

          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-black text-white mb-4">
              OUR PROUD SPONSORS
            </h2>
            <p className="text-gray-400">Partnership opportunities coming soon</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">

            {sponsors.map((_, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.05, y: -5 }}
                className="aspect-square bg-gradient-to-br from-red-900/30 to-black border-2 border-dashed border-red-600 rounded-xl flex items-center justify-center shadow-lg"
              >
                <div className="text-center">
                  <div className="text-sm font-black text-red-400 tracking-widest">
                    COMING
                  </div>
                  <div className="text-lg font-bold text-white tracking-widest">
                    SOON
                  </div>
                </div>
              </motion.div>
            ))}

          </div>
        </div>
      </section>

      {/* NEWS */}
      <section className="py-20 bg-black">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">

          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-black text-white mb-2">
              LATEST NEWS
            </h2>
          </div>

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