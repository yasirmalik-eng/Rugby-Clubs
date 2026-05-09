import { motion } from "motion/react";
import { Trophy, Users, Calendar, Shield, Heart, Target } from "lucide-react";

const features = [
  {
    icon: Trophy,
    title: "Championship Legacy",
    description: "Over 100 years of competitive rugby excellence and countless trophies",
    color: "from-yellow-400 to-orange-500"
  },
  {
    icon: Users,
    title: "Strong Community",
    description: "A family of passionate players, coaches, and supporters united by the sport",
    color: "from-blue-400 to-cyan-500"
  },
  {
    icon: Calendar,
    title: "Year-Round Training",
    description: "Professional coaching and facilities available throughout the season",
    color: "from-green-400 to-emerald-500"
  },
  {
    icon: Shield,
    title: "Youth Development",
    description: "Nurturing the next generation of Welsh rugby talent from age 5+",
    color: "from-purple-400 to-pink-500"
  },
  {
    icon: Heart,
    title: "Inclusive Culture",
    description: "Welcome to all skill levels, ages, and backgrounds in our rugby family",
    color: "from-red-400 to-rose-500"
  },
  {
    icon: Target,
    title: "Elite Performance",
    description: "State-of-the-art training methods and nutrition programs for peak performance",
    color: "from-indigo-400 to-violet-500"
  }
];

export function Features() {
  return (
    <section className="py-16 sm:py-20 md:py-24 bg-gradient-to-b from-white to-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 sm:mb-16"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Why Choose Us
          </h2>
          <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto">
            Experience the best of Welsh rugby tradition with modern excellence
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -8, transition: { duration: 0.2 } }}
              className="group"
            >
              <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 h-full">
                <motion.div
                  whileHover={{ rotate: [0, -10, 10, -10, 0], scale: 1.1 }}
                  transition={{ duration: 0.5 }}
                  className={`w-14 h-14 sm:w-16 sm:h-16 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4 sm:mb-6 shadow-lg`}
                >
                  <feature.icon className="w-7 h-7 sm:w-8 sm:h-8 text-white" />
                </motion.div>
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
