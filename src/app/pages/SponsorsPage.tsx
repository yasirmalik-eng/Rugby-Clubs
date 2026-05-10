import { motion } from "motion/react";
import { Trophy, Star, Crown, Award, Mail } from "lucide-react";
import { useSponsors } from "../../hooks/useSponsors";
import { useSponsorshipPackages } from "../../hooks/useSponsorshipPackages";

const tierIcons = {
  "Principal Partner": Crown,
  "Premium Partners": Star,
  "Official Partners": Trophy,
} as const;

export function SponsorsPage() {
  const { sponsors, loading: sponsorsLoading } = useSponsors();
  const { packages, loading: packagesLoading } = useSponsorshipPackages();

  const tierOrder = ["Principal Partner", "Premium Partners", "Official Partners"];
  const groupedSponsors = tierOrder.map((tier) => ({
    tier,
    icon: tierIcons[tier as keyof typeof tierIcons],
    sponsors: sponsors.filter((sponsor) => sponsor.tier === tier),
  }));

  return (
    <div className="min-h-screen bg-black pt-24 pb-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-16 text-center"
        >
          <div className="mb-4 inline-block rounded-full border border-green-600 bg-green-800/30 px-4 py-2">
            <span className="flex items-center gap-2 text-sm font-bold text-green-400">
              <Trophy className="h-4 w-4" />
              PARTNERSHIP OPPORTUNITIES
            </span>
          </div>

          <h1 className="mb-4 text-5xl font-black text-white md:text-6xl">
            OUR SPONSORS
          </h1>

          <p className="mx-auto max-w-2xl text-xl text-gray-400">
            Proud partners supporting North Wales Crusaders excellence
          </p>
        </motion.div>

        <div className="mx-auto mb-20 max-w-6xl">
          {groupedSponsors.map((tier, tierIndex) => {
            const Icon = tier.icon;
            const placeholderCount =
              tier.tier === "Principal Partner" ? 2 : tier.tier === "Premium Partners" ? 3 : 4;

            return (
              <motion.div
                key={tier.tier}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: tierIndex * 0.2 }}
                className="mb-16"
              >
                <div className="mb-8 flex items-center gap-3">
                  <Icon className="h-8 w-8 text-red-500" />
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
                  {sponsorsLoading
                    ? Array.from({ length: placeholderCount }).map((_, index) => (
                        <div
                          key={index}
                          className="aspect-square animate-pulse rounded-2xl border-2 border-white/10 bg-white/5"
                        />
                      ))
                    : tier.sponsors.length > 0
                      ? tier.sponsors.map((sponsor) => (
                          <motion.div
                            key={sponsor.id}
                            whileHover={{ scale: 1.05, y: -8 }}
                            className="flex aspect-square items-center justify-center rounded-2xl border-2 border-white/20 bg-gradient-to-br from-white/5 to-white/10 p-8 transition-all hover:border-red-600"
                          >
                            {sponsor.logo_url ? (
                              <img
                                src={sponsor.logo_url}
                                alt={sponsor.name}
                                className="max-h-20 w-auto object-contain"
                              />
                            ) : (
                              <div className="text-center">
                                <div className="text-lg font-black tracking-widest text-gray-400">
                                  {sponsor.name}
                                </div>
                              </div>
                            )}
                          </motion.div>
                        ))
                      : Array.from({ length: placeholderCount }).map((_, index) => (
                          <div
                            key={index}
                            className="flex aspect-square items-center justify-center rounded-2xl border-2 border-white/20 bg-gradient-to-br from-white/5 to-white/10 p-8"
                          >
                            <div className="text-lg font-black tracking-widest text-gray-400">
                              COMING SOON
                            </div>
                          </div>
                        ))}
                </div>
              </motion.div>
            );
          })}
        </div>

        <div className="mx-auto mb-20 max-w-6xl">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-4xl font-black text-white md:text-5xl">
              BECOME A SPONSOR
            </h2>

            <p className="text-xl text-gray-400">
              Partner with North Wales Crusaders and reach thousands of fans
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {(packagesLoading ? Array.from({ length: 3 }) : packages).map((pkg, index) => (
              <motion.div
                key={packagesLoading ? index : pkg.id}
                whileHover={{ y: -8, scale: !packagesLoading && pkg.featured ? 1.03 : 1.02 }}
                className={`rounded-2xl p-8 transition-all ${
                  !packagesLoading && pkg.featured
                    ? "border-2 border-red-600 bg-gradient-to-br from-red-900/40 to-green-900/40"
                    : "border-2 border-gray-800 bg-gradient-to-br from-gray-900/40 to-black"
                }`}
              >
                {!packagesLoading && pkg.featured && (
                  <div className="mb-4 text-center">
                    <span className="rounded-full bg-red-600 px-4 py-2 text-xs font-bold text-white">
                      MOST POPULAR
                    </span>
                  </div>
                )}

                <div className="mb-6 text-center">
                  <h3 className="mb-2 text-2xl font-black text-white">
                    {packagesLoading ? "Loading..." : pkg.title}
                  </h3>

                  <div className="mb-1 text-4xl font-black text-red-500">
                    {packagesLoading ? "..." : pkg.price_label}
                  </div>

                  <div className="text-sm text-gray-400">
                    {packagesLoading ? " " : pkg.billing_period}
                  </div>
                </div>

                <ul className="mb-8 space-y-3">
                  {(packagesLoading ? Array.from({ length: 4 }) : pkg.benefits).map((benefit, benefitIndex) => (
                    <li key={benefitIndex} className="flex items-start gap-2 text-gray-300">
                      <Award className="mt-0.5 h-5 w-5 text-green-500" />
                      <span className="text-sm">{packagesLoading ? "Loading benefit" : benefit}</span>
                    </li>
                  ))}
                </ul>

                <div className="mt-4 w-full text-center">
                  <a
                    href={`mailto:${packagesLoading ? "admin@northwalesrugby.com" : pkg.contact_email}`}
                    className="inline-block font-bold text-red-400 transition-all hover:text-red-300"
                  >
                    ENQUIRE NOW - {packagesLoading ? "admin@northwalesrugby.com" : pkg.contact_email}
                  </a>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="mx-auto max-w-4xl">
          <div className="rounded-2xl border-2 border-red-600 bg-gradient-to-br from-red-900/30 to-black p-8 md:p-12">
            <div className="mb-8 text-center">
              <h3 className="mb-4 text-3xl font-black text-white">
                INTERESTED IN PARTNERING?
              </h3>

              <p className="text-lg text-gray-300">
                Contact us for sponsorship opportunities
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-1">
              <a
                href="mailto:admin@northwalesrugby.com"
                className="flex items-center gap-4 rounded-xl border border-white/10 bg-black/50 p-6 transition hover:border-red-500"
              >
                <Mail className="h-10 w-10 text-red-500" />

                <div>
                  <div className="text-sm text-gray-400">Email</div>
                  <div className="font-bold text-white">admin@northwalesrugby.com</div>
                </div>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
