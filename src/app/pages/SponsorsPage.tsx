import { motion } from "motion/react";
import { Trophy, Star, Crown, Award, Mail, Phone } from "lucide-react";

export function SponsorsPage() {
  const sponsorTiers = [
    {
      tier: "Principal Partner",
      icon: Crown,
      sponsors: ["COMING SOON", "COMING SOON"],
    },
    {
      tier: "Premium Partners",
      icon: Star,
      sponsors: ["COMING SOON", "COMING SOON", "COMING SOON"],
    },
    {
      tier: "Official Partners",
      icon: Trophy,
      sponsors: [
        "COMING SOON",
        "COMING SOON",
        "COMING SOON",
        "COMING SOON",
      ],
    },
  ];

  const packages = [
    {
      title: "Match Day Sponsor",
      price: "£2,500",
      benefits: [
        "Logo on matchday materials",
        "Social media recognition",
        "10 complimentary tickets",
        "Pitch-side advertising board",
      ],
    },
    {
      title: "Season Partner",
      price: "£10,000",
      benefits: [
        "Logo on team kit",
        "Stadium advertising",
        "25 season tickets",
        "Hospitality suite access",
        "Meet the team events",
      ],
      featured: true,
    },
    {
      title: "Principal Partner",
      price: "£25,000+",
      benefits: [
        "Prime kit placement",
        "Stadium naming rights",
        "50 premium season tickets",
        "Executive box access",
        "Brand integration across club",
        "Exclusive partnership benefits",
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-black pt-24 pb-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">

        {/* HEADER */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <div className="inline-block px-4 py-2 bg-green-800/30 border border-green-600 rounded-full mb-4">
            <span className="text-green-400 font-bold text-sm flex items-center gap-2">
              <Trophy className="w-4 h-4" />
              PARTNERSHIP OPPORTUNITIES
            </span>
          </div>

          <h1 className="text-5xl md:text-6xl font-black text-white mb-4">
            OUR SPONSORS
          </h1>

          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Proud partners supporting North Wales Crusaders excellence
          </p>
        </motion.div>

        {/* SPONSORS */}
        <div className="max-w-6xl mx-auto mb-20">
          {sponsorTiers.map((tier, tierIndex) => {
            const Icon = tier.icon;

            return (
              <motion.div
                key={tierIndex}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: tierIndex * 0.2 }}
                className="mb-16"
              >
                <div className="flex items-center gap-3 mb-8">
                  <Icon className="w-8 h-8 text-red-500" />
                  <h2 className="text-3xl font-black text-white">
                    {tier.tier.toUpperCase()}
                  </h2>
                </div>

                <div
                  className={`grid gap-6 ${
                    tier.tier === "Principal Partner"
                      ? "md:grid-cols-2"
                      : tier.tier === "Premium Partners"
                      ? "md:grid-cols-3"
                      : "md:grid-cols-4"
                  }`}
                >
                  {tier.sponsors.map((sponsor, index) => (
                    <motion.div
                      key={index}
                      whileHover={{ scale: 1.05, y: -8 }}
                      className="aspect-square bg-gradient-to-br from-white/5 to-white/10 border-2 border-white/20 rounded-2xl flex items-center justify-center hover:border-red-600 transition-all p-8"
                    >
                      <div className="text-center">
                        <div className="font-black text-gray-400 text-lg tracking-widest">
                          {sponsor}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* PACKAGES */}
        <div className="max-w-6xl mx-auto mb-20">

          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-black text-white mb-4">
              BECOME A SPONSOR
            </h2>

            <p className="text-xl text-gray-400">
              Partner with North Wales Crusaders and reach thousands of fans
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">

            {packages.map((pkg, index) => (
              <motion.div
                key={index}
                whileHover={{ y: -8, scale: pkg.featured ? 1.03 : 1.02 }}
                className={`rounded-2xl p-8 transition-all ${
                  pkg.featured
                    ? "bg-gradient-to-br from-red-900/40 to-green-900/40 border-2 border-red-600"
                    : "bg-gradient-to-br from-gray-900/40 to-black border-2 border-gray-800"
                }`}
              >
                {pkg.featured && (
                  <div className="text-center mb-4">
                    <span className="px-4 py-2 bg-red-600 text-white rounded-full text-xs font-bold">
                      MOST POPULAR
                    </span>
                  </div>
                )}

                <div className="text-center mb-6">
                  <h3 className="text-2xl font-black text-white mb-2">
                    {pkg.title}
                  </h3>

                  <div className="text-4xl font-black text-red-500 mb-1">
                    {pkg.price}
                  </div>

                  <div className="text-sm text-gray-400">
                    per season
                  </div>
                </div>

                <ul className="space-y-3 mb-8">
                  {pkg.benefits.map((benefit, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-2 text-gray-300"
                    >
                      <Award className="w-5 h-5 text-green-500 mt-0.5" />
                      <span className="text-sm">{benefit}</span>
                    </li>
                  ))}
                </ul>

                {/* ENQUIRE */}
                <div className="w-full text-center mt-4">
                  <a
                    href="mailto:admin@northwalesrugby.com"
                    className="inline-block text-red-400 font-bold hover:text-red-300 transition-all"
                  >
                    ENQUIRE NOW - admin@northwalesrugby.com
                  </a>
                </div>

              </motion.div>
            ))}

          </div>
        </div>

        {/* CONTACT */}
        <div className="max-w-4xl mx-auto">

          <div className="bg-gradient-to-br from-red-900/30 to-black border-2 border-red-600 rounded-2xl p-8 md:p-12">

            <div className="text-center mb-8">
              <h3 className="text-3xl font-black text-white mb-4">
                INTERESTED IN PARTNERING?
              </h3>

              <p className="text-gray-300 text-lg">
                Contact us for sponsorship opportunities
              </p>
            </div>

            <div className="grid md:grid-cols-1 gap-6">

            <a
  href="mailto:admin@northwalesrugby.com"
  className="bg-black/50 border border-white/10 rounded-xl p-6 flex items-center gap-4 hover:border-red-500 transition"
>
  <Mail className="w-10 h-10 text-red-500" />

  <div>
    <div className="text-sm text-gray-400">Email</div>
    <div className="text-white font-bold">
      admin@northwalesrugby.com
    </div>
  </div>
</a>

           

            </div>

          </div>

        </div>

      </div>
    </div>
  );
}