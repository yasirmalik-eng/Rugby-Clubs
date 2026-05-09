import { motion } from "motion/react";
import { Trophy, Heart, Users, Target, Shield, Award } from "lucide-react";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";

export function ClubPage() {
  const values = [
    {
      icon: Shield,
      title: "Pride",
      description: "Representing North Wales with honor and passion in every match"
    },
    {
      icon: Heart,
      title: "Community",
      description: "Building lasting bonds through the love of rugby"
    },
    {
      icon: Trophy,
      title: "Excellence",
      description: "Pursuing greatness on and off the field since 1899"
    },
    {
      icon: Target,
      title: "Development",
      description: "Nurturing the next generation of Welsh rugby talent"
    }
  ];

  const timeline = [
    { year: "1899", event: "Club Founded", description: "Welsh RFC established in North Wales" },
    { year: "1925", event: "First Championship", description: "Won inaugural Welsh Premier Division title" },
    { year: "1967", event: "Eirias Stadium", description: "Moved to our historic home ground" },
    { year: "1989", event: "Youth Academy", description: "Launched development program for young players" },
    { year: "2010", event: "European Glory", description: "Competed in European Rugby Championship" },
    { year: "2026", event: "Modern Era", description: "Continuing our legacy of Welsh rugby excellence" }
  ];

  return (
    <div className="min-h-screen bg-black pt-24 pb-20">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1671042299447-f6f67b313f32?w=1920')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-black via-black/50 to-black"></div>
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-4xl mx-auto"
          >
            <div className="inline-block px-4 py-2 bg-green-800/30 border border-green-600 rounded-full mb-6">
              <span className="text-green-400 font-bold text-sm flex items-center gap-2">
                <Trophy className="w-4 h-4" />
                ESTABLISHED 1899
              </span>
            </div>
            <h1 className="text-5xl md:text-7xl font-black text-white mb-6">
              OUR <span className="text-red-600">STORY</span>
            </h1>
            <p className="text-xl text-gray-300 leading-relaxed">
              For over 127 years, Welsh RFC has been the beating heart of North Wales rugby.
              From the historic fortress of Eirias Stadium to the passionate roar of our supporters,
              we are more than a club—we are a <span className="text-green-500 font-bold">Welsh legacy</span>.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-gradient-to-b from-black to-red-950/20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-black text-white mb-4">
              OUR VALUES
            </h2>
            <p className="text-xl text-gray-400">The principles that drive us forward</p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -8, scale: 1.02 }}
                className="bg-gradient-to-br from-red-900/20 to-black border-2 border-red-800/50 rounded-2xl p-8 hover:border-red-600 transition-all"
              >
                <motion.div
                  whileHover={{ rotate: [0, -10, 10, -10, 0], scale: 1.1 }}
                  transition={{ duration: 0.5 }}
                  className="w-16 h-16 bg-gradient-to-br from-red-700 to-red-900 rounded-xl flex items-center justify-center mb-6 shadow-lg shadow-red-900/50"
                >
                  <value.icon className="w-8 h-8 text-white" />
                </motion.div>
                <h3 className="text-2xl font-black text-white mb-3">{value.title}</h3>
                <p className="text-gray-400 leading-relaxed">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Heritage Section */}
      <section className="py-20 bg-black relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1759951913073-9c5d411002d1?w=1920')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        ></div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-black text-white mb-4">
              WELSH HERITAGE
            </h2>
            <p className="text-xl text-gray-400">Rooted in tradition, built on excellence</p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              <div className="aspect-video rounded-2xl overflow-hidden border-2 border-red-800">
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1760163506380-2be2a2f8bf0a?w=800"
                  alt="Welsh Rugby Atmosphere"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="aspect-video rounded-2xl overflow-hidden border-2 border-green-800">
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1671042299447-f6f67b313f32?w=800"
                  alt="Welsh Castle Heritage"
                  className="w-full h-full object-cover"
                />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              <p className="text-lg text-gray-300 leading-relaxed">
                Like the ancient castles that dot the Welsh landscape, our club stands as a fortress
                of rugby tradition in North Wales. We carry the warrior spirit of our ancestors onto
                the field, defending our heritage with pride and passion.
              </p>
              <p className="text-lg text-gray-300 leading-relaxed">
                The roar of our supporters echoes through Eirias Stadium like the battle cries of old,
                united in their love for the game and their unwavering support for the red and green.
              </p>
              <div className="bg-gradient-to-r from-red-900/30 to-green-900/30 border-l-4 border-red-600 p-6 rounded-r-xl">
                <p className="text-xl font-bold text-white italic">
                  "Mae'r clwb hwn yn fwy na gêm—mae'n etifeddiaeth"
                </p>
                <p className="text-sm text-gray-400 mt-2">
                  This club is more than a game—it's a legacy
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="py-20 bg-gradient-to-b from-black to-green-950/20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-black text-white mb-4">
              OUR JOURNEY
            </h2>
            <p className="text-xl text-gray-400">127 years of rugby excellence</p>
          </motion.div>

          <div className="max-w-4xl mx-auto">
            {timeline.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="relative pl-12 pb-12 border-l-2 border-red-600/30 last:border-transparent last:pb-0"
              >
                <div className="absolute left-0 top-0 w-6 h-6 -translate-x-[13px] bg-red-600 rounded-full border-4 border-black shadow-lg shadow-red-600/50"></div>
                <div className="bg-gradient-to-br from-red-900/20 to-black border border-red-800/50 rounded-xl p-6 hover:border-red-600 transition-all">
                  <div className="text-3xl font-black text-red-500 mb-2">{item.year}</div>
                  <h3 className="text-xl font-bold text-white mb-2">{item.event}</h3>
                  <p className="text-gray-400">{item.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Fan Culture Section */}
      <section className="py-20 bg-black">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto bg-gradient-to-br from-red-900/30 to-black border-2 border-red-600 rounded-3xl p-12 text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
            >
              <Users className="w-20 h-20 text-red-500 mx-auto mb-6" />
              <h2 className="text-4xl md:text-5xl font-black text-white mb-6">
                JOIN THE FAMILY
              </h2>
              <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
                Be part of a community that lives and breathes rugby. From youth players to lifelong supporters,
                we welcome everyone who shares our passion for the sport and pride in Welsh heritage.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-10 py-5 bg-gradient-to-r from-red-700 to-red-800 text-white rounded-lg font-bold shadow-xl border-2 border-red-600"
                >
                  BECOME A MEMBER
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-10 py-5 bg-white/5 backdrop-blur-sm text-white rounded-lg font-bold border-2 border-green-700 hover:bg-green-700/20 transition-all"
                >
                  JOIN YOUTH ACADEMY
                </motion.button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
