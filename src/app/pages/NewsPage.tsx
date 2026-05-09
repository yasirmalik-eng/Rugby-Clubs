import { motion } from "motion/react";
import { Newspaper, Calendar, ArrowRight } from "lucide-react";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";

export function NewsPage() {
  const featuredNews = {
    title: "Historic Victory Secures Welsh Cup Semi-Final Place",
    date: "May 8, 2026",
    category: "Match Report",
    excerpt: "In an electrifying display of Welsh rugby at its finest, our team secured a commanding 34-17 victory against Newport Dragons at Eirias Stadium.",
    image: "https://images.unsplash.com/photo-1557161283-c995e88037d4?w=1920",
    readTime: "5 min read"
  };

  const allNews = [
    {
      title: "Season Ticket Renewals Break Club Records",
      date: "May 7, 2026",
      category: "Club News",
      excerpt: "Over 85% of season ticket holders have renewed for the 2026/27 season",
      image: "https://images.unsplash.com/photo-1774916927099-5b0c72f2a683?w=800"
    },
    {
      title: "Youth Academy Players Selected for Regional Squad",
      date: "May 6, 2026",
      category: "Youth Development",
      excerpt: "Three of our academy stars receive call-up to North Wales regional team",
      image: "https://images.unsplash.com/photo-1760163506380-2be2a2f8bf0a?w=800"
    },
    {
      title: "New Training Facility Announced",
      date: "May 5, 2026",
      category: "Club News",
      excerpt: "State-of-the-art training complex to open at Eirias Park next season",
      image: "https://images.unsplash.com/photo-1633785587101-58bc8350818f?w=800"
    },
    {
      title: "Community Outreach: Rugby in Schools Program",
      date: "May 4, 2026",
      category: "Community",
      excerpt: "Bringing the love of rugby to local North Wales schools",
      image: "https://images.unsplash.com/photo-1721404001168-787668dd7703?w=800"
    },
    {
      title: "Match Preview: Llanelli Scarlets Clash",
      date: "May 3, 2026",
      category: "Match Preview",
      excerpt: "Everything you need to know ahead of Saturday's crucial fixture",
      image: "https://images.unsplash.com/photo-1665413813194-3b80d79b6421?w=800"
    },
    {
      title: "Fan of the Month: Meet Sarah Williams",
      date: "May 2, 2026",
      category: "Fan Stories",
      excerpt: "Celebrating our most passionate supporters and their club journey",
      image: "https://images.unsplash.com/photo-1763854413165-1713bc5a7f4a?w=800"
    }
  ];

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
              <Newspaper className="w-4 h-4" />
              LATEST UPDATES
            </span>
          </div>
          <h1 className="text-5xl md:text-6xl font-black text-white mb-4">
            CLUB NEWS
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Stay connected with all the latest from Welsh RFC
          </p>
        </motion.div>

        {/* Featured Article */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          whileHover={{ y: -8 }}
          className="max-w-6xl mx-auto mb-16 group cursor-pointer"
        >
          <div className="bg-gradient-to-br from-red-900/30 to-black border-2 border-red-600 rounded-3xl overflow-hidden hover:shadow-2xl hover:shadow-red-900/50 transition-all">
            <div className="grid md:grid-cols-2 gap-0">
              <div className="aspect-video md:aspect-auto overflow-hidden">
                <ImageWithFallback
                  src={featuredNews.image}
                  alt={featuredNews.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
              </div>
              <div className="p-8 md:p-12 flex flex-col justify-center">
                <div className="flex items-center gap-4 mb-4">
                  <span className="px-3 py-1 bg-red-600 text-white rounded-full text-xs font-bold">
                    FEATURED
                  </span>
                  <span className="px-3 py-1 bg-green-900/50 border border-green-700 text-green-400 rounded-full text-xs font-bold">
                    {featuredNews.category}
                  </span>
                </div>
                <h2 className="text-3xl md:text-4xl font-black text-white mb-4 group-hover:text-red-400 transition-colors">
                  {featuredNews.title}
                </h2>
                <p className="text-gray-300 text-lg mb-6 leading-relaxed">
                  {featuredNews.excerpt}
                </p>
                <div className="flex items-center gap-6 text-sm text-gray-400 mb-6">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-red-500" />
                    {featuredNews.date}
                  </div>
                  <div>{featuredNews.readTime}</div>
                </div>
                <motion.button
                  whileHover={{ x: 5 }}
                  className="flex items-center gap-2 text-red-500 font-bold group"
                >
                  READ FULL ARTICLE
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </motion.button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* All News Grid */}
        <div className="max-w-6xl mx-auto">
          <motion.h2
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-3xl font-black text-white mb-8"
          >
            ALL NEWS
          </motion.h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {allNews.map((article, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + index * 0.1 }}
                whileHover={{ y: -8 }}
                className="group cursor-pointer"
              >
                <div className="bg-gradient-to-br from-red-900/10 to-black border border-white/10 rounded-2xl overflow-hidden hover:border-red-600/50 transition-all h-full flex flex-col">
                  <div className="aspect-video overflow-hidden">
                    <ImageWithFallback
                      src={article.image}
                      alt={article.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-6 flex-1 flex flex-col">
                    <div className="flex items-center gap-3 mb-3">
                      <span className="px-2 py-1 bg-green-900/50 border border-green-700 text-green-400 rounded text-xs font-bold">
                        {article.category}
                      </span>
                      <div className="flex items-center gap-1 text-xs text-gray-500">
                        <Calendar className="w-3 h-3" />
                        {article.date}
                      </div>
                    </div>
                    <h3 className="text-xl font-bold text-white mb-3 group-hover:text-red-400 transition-colors flex-1">
                      {article.title}
                    </h3>
                    <p className="text-gray-400 text-sm mb-4">{article.excerpt}</p>
                    <motion.div
                      whileHover={{ x: 5 }}
                      className="flex items-center gap-2 text-red-500 font-bold text-sm"
                    >
                      Read More
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </motion.div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Newsletter Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto mt-20"
        >
          <div className="bg-gradient-to-r from-red-900/30 to-green-900/30 border-2 border-red-600/50 rounded-2xl p-8 md:p-12 text-center">
            <h3 className="text-3xl font-black text-white mb-4">
              NEVER MISS AN UPDATE
            </h3>
            <p className="text-gray-300 mb-8">
              Subscribe to our newsletter for exclusive news, match updates, and special offers
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Your email address"
                className="flex-1 px-6 py-4 bg-black/50 border border-white/20 rounded-lg text-white placeholder-gray-500 focus:border-red-600 focus:outline-none"
              />
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 bg-gradient-to-r from-red-700 to-red-800 text-white rounded-lg font-bold shadow-lg border-2 border-red-600 whitespace-nowrap"
              >
                SUBSCRIBE
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
