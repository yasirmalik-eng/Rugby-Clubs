import { motion } from "motion/react";
import { WelshHero } from "../components/WelshHero";
import { Ticket, Calendar, Users, Trophy, ArrowRight, Flame } from "lucide-react";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";

interface HomePageProps {
  onNavigate: (page: string) => void;
}

export function HomePage({ onNavigate }: HomePageProps) {
  const sponsors = [
    "SPONSOR ONE", "SPONSOR TWO", "SPONSOR THREE",
    "SPONSOR FOUR", "SPONSOR FIVE", "SPONSOR SIX"
  ];

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

      {/* Next Match Section */}
      <section className="py-20 bg-gradient-to-b from-black to-red-950/20 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1671042299447-f6f67b313f32?w=1920')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}></div>
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <div className="inline-block px-4 py-2 bg-red-800/30 border border-red-600 rounded-full mb-4">
              <span className="text-red-400 font-bold text-sm flex items-center gap-2">
                <Flame className="w-4 h-4" />
                NEXT HOME MATCH
              </span>
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-white mb-4">
              UPCOMING FIXTURES
            </h2>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            whileHover={{ scale: 1.02 }}
            className="max-w-4xl mx-auto bg-gradient-to-br from-red-900/40 to-black/40 backdrop-blur-sm border-2 border-red-600 rounded-2xl p-8 md:p-12 shadow-2xl shadow-red-900/50"
          >
            <div className="grid md:grid-cols-3 gap-8 items-center">
              <div className="text-center md:text-right">
                <div className="text-3xl md:text-4xl font-black text-white mb-2">WELSH RFC</div>
                <div className="text-red-400 font-bold">HOME</div>
              </div>

              <div className="text-center">
                <div className="text-6xl font-black text-white mb-4">VS</div>
                <div className="space-y-2">
                  <div className="flex items-center justify-center gap-2 text-gray-300">
                    <Calendar className="w-5 h-5 text-red-500" />
                    <span className="font-bold">MAY 15, 2026</span>
                  </div>
                  <div className="text-2xl font-bold text-green-500">15:00 KO</div>
                  <div className="text-sm text-gray-400">Eirias Stadium</div>
                </div>
              </div>

              <div className="text-center md:text-left">
                <div className="text-3xl md:text-4xl font-black text-white mb-2">LLANELLI</div>
                <div className="text-gray-400 font-bold">AWAY</div>
              </div>
            </div>

            <div className="mt-8 pt-8 border-t border-white/10 flex flex-col sm:flex-row gap-4 justify-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => onNavigate("tickets")}
                className="px-8 py-4 bg-gradient-to-r from-red-700 to-red-800 text-white rounded-lg font-bold shadow-lg border-2 border-red-600 flex items-center justify-center gap-2"
              >
                <Ticket className="w-5 h-5" />
                BUY TICKETS
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => onNavigate("fixtures")}
                className="px-8 py-4 bg-white/5 backdrop-blur-sm text-white rounded-lg font-bold border-2 border-green-700 hover:bg-green-700/20 transition-all flex items-center justify-center gap-2"
              >
                VIEW ALL FIXTURES
                <ArrowRight className="w-5 h-5" />
              </motion.button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Welsh Heritage Section */}
      <section className="py-20 bg-black relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1759951913073-9c5d411002d1?w=1920')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            filter: 'grayscale(100%)'
          }}
        ></div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <div className="text-sm font-bold text-green-500 tracking-[0.3em] mb-4">
                OUR HERITAGE
              </div>
              <h2 className="text-4xl md:text-5xl font-black text-white mb-6 leading-tight">
                127 Years of
                <br />
                <span className="text-red-600">Welsh Rugby Pride</span>
              </h2>
              <p className="text-lg text-gray-300 mb-8 leading-relaxed">
                Since 1899, we've been at the heart of North Wales rugby. From historic battles
                at Eirias Stadium to developing the next generation of Welsh rugby talent, our
                legacy is built on passion, community, and unwavering commitment to the sport.
              </p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => onNavigate("club")}
                className="px-8 py-4 bg-gradient-to-r from-red-700 to-red-800 text-white rounded-lg font-bold shadow-lg border-2 border-red-600 flex items-center gap-2"
              >
                <Trophy className="w-5 h-5" />
                DISCOVER OUR STORY
              </motion.button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="grid grid-cols-2 gap-4"
            >
              {[
                { number: "127+", label: "Years of History" },
                { number: "23", label: "Championships" },
                { number: "450+", label: "Active Members" },
                { number: "98%", label: "Fan Satisfaction" }
              ].map((stat, index) => (
                <motion.div
                  key={index}
                  whileHover={{ scale: 1.05, y: -5 }}
                  className="bg-gradient-to-br from-red-900/40 to-black/60 backdrop-blur-sm border-2 border-red-800/50 rounded-xl p-6 text-center"
                >
                  <div className="text-4xl font-black text-white mb-2">{stat.number}</div>
                  <div className="text-sm text-gray-400 font-semibold">{stat.label}</div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Sponsors Section */}
      <section className="py-20 bg-gradient-to-b from-black to-green-950/20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-black text-white mb-4">
              OUR PROUD SPONSORS
            </h2>
            <p className="text-gray-400">Supporting Welsh rugby excellence</p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {sponsors.map((sponsor, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.05, y: -5 }}
                className="aspect-square bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl flex items-center justify-center hover:bg-white/10 transition-all"
              >
                <div className="text-center p-4">
                  <div className="text-xs font-bold text-gray-400">{sponsor}</div>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mt-12"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onNavigate("sponsors")}
              className="px-8 py-4 bg-green-800 text-white rounded-lg font-bold border-2 border-green-600 hover:bg-green-700 transition-all"
            >
              BECOME A SPONSOR
            </motion.button>
          </motion.div>
        </div>
      </section>

      {/* Latest News Section */}
      <section className="py-20 bg-black">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex justify-between items-end mb-12"
          >
            <div>
              <h2 className="text-3xl md:text-4xl font-black text-white mb-2">
                LATEST NEWS
              </h2>
              <p className="text-gray-400">Stay updated with club news</p>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onNavigate("news")}
              className="hidden sm:flex items-center gap-2 text-red-500 font-bold hover:text-red-400 transition-colors"
            >
              VIEW ALL
              <ArrowRight className="w-5 h-5" />
            </motion.button>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {news.map((article, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -8 }}
                className="group cursor-pointer"
              >
                <div className="bg-gradient-to-br from-red-900/20 to-black border border-white/10 rounded-xl overflow-hidden hover:border-red-600/50 transition-all">
                  <div className="aspect-video overflow-hidden">
                    <ImageWithFallback
                      src={article.image}
                      alt={article.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-6">
                    <div className="text-xs text-red-500 font-bold mb-2">{article.date}</div>
                    <h3 className="text-xl font-bold text-white mb-2 group-hover:text-red-500 transition-colors">
                      {article.title}
                    </h3>
                    <p className="text-gray-400 text-sm">{article.excerpt}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
