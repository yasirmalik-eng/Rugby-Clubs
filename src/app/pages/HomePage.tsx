import { motion } from "motion/react";
import { WelshHero } from "../components/WelshHero";
import { Ticket, Calendar, ArrowRight, Flame, FileText } from "lucide-react";
import { useNavigate } from "react-router";
import { useFixtures } from "../../hooks/useFixtures";
import { useBlogPosts } from "../../hooks/useBlogPosts";
import { useSponsors } from "../../hooks/useSponsors";
import { format } from "date-fns";

export function HomePage() {
  const navigate = useNavigate();
  const { fixtures, loading: fixturesLoading } = useFixtures("upcoming");
  const { posts, loading: postsLoading } = useBlogPosts(3);
  const { sponsors, loading: sponsorsLoading } = useSponsors();

  const nextFixture = fixtures.find((fixture) => fixture.is_home) ?? fixtures[0] ?? null;
  const sponsorCards = sponsors.slice(0, 6);

  return (
    <div>
      <WelshHero />

      <section className="relative overflow-hidden bg-gradient-to-b from-black to-red-950/30 py-24">
        <div className="absolute inset-0 opacity-10 bg-[url('https://images.unsplash.com/photo-1671042299447-f6f67b313f32?w=1920')] bg-cover bg-center" />

        <div className="container relative z-10 mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-12 text-center"
          >
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-red-600 bg-red-800/30 px-4 py-2">
              <Flame className="h-4 w-4 text-red-400" />
              <span className="text-sm font-bold text-red-400">NEXT HOME GAME</span>
            </div>

            <h2 className="mb-2 text-4xl font-black text-white md:text-5xl">EIRIAS STADIUM SHOWDOWN</h2>

            <p className="text-gray-400">
              {nextFixture ? "Official fixture details are live now" : "Official fixture announcement coming soon"}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="mx-auto max-w-4xl rounded-3xl border border-red-700 bg-gradient-to-br from-red-900/40 to-black/60 p-8 text-center shadow-2xl md:p-10"
          >
            {fixturesLoading ? (
              <div className="animate-pulse text-center">
                <div className="mx-auto mb-4 h-10 w-64 rounded bg-white/10" />
                <div className="mx-auto h-5 w-40 rounded bg-white/5" />
              </div>
            ) : nextFixture ? (
              <>
                <div className="mb-4 text-3xl font-black text-white md:text-4xl">NEXT HOME MATCH</div>

                <div className="mb-2 text-xl font-bold text-white md:text-2xl">
                  NORTH WALES CRUSADERS vs {nextFixture.opponent.toUpperCase()}
                </div>

                <div className="mb-2 flex flex-col items-center justify-center gap-2 text-gray-300 sm:flex-row">
                  <Calendar className="h-5 w-5 text-red-500" />
                  <span className="font-bold">
                    {format(new Date(nextFixture.match_date), "d MMMM yyyy")}
                  </span>
                </div>

                <div className="mb-2 text-2xl font-bold text-green-500">
                  {nextFixture.kick_off_time.slice(0, 5)}
                </div>

                <div className="text-gray-400">{nextFixture.venue}</div>
              </>
            ) : (
              <>
                <div className="mb-4 text-3xl font-black text-white md:text-4xl">NEXT HOME MATCH</div>
                <div className="font-bold text-gray-300">Date and opponent to be confirmed</div>
              </>
            )}

            <div className="mt-10 flex flex-col justify-center gap-4 sm:flex-row">
              <button
                onClick={() =>
                  nextFixture?.tickets_available
                    ? navigate(`/tickets?fixture=${nextFixture.id}`)
                    : navigate("/tickets")
                }
                className="flex items-center justify-center gap-2 rounded-xl bg-red-700 px-8 py-4 font-black text-white transition-all hover:bg-red-600"
              >
                <Ticket className="h-5 w-5" />
                BUY TICKETS
              </button>

              <button
                onClick={() => navigate("/fixtures")}
                className="rounded-xl border border-green-700 px-8 py-4 font-bold text-white transition-all hover:bg-white/5"
              >
                VIEW FIXTURES
                <ArrowRight className="ml-2 inline h-5 w-5" />
              </button>

              <a
                href="/programme-v-salford-31st-may-2026.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-green-700 to-green-800 px-8 py-4 font-bold text-white transition-all hover:from-green-600 hover:to-green-700 border border-green-600 shadow-lg shadow-green-900/30 cursor-pointer"
              >
                <FileText className="h-5 w-5" />
                VIEW PROGRAMME (PDF)
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="bg-gradient-to-b from-black to-green-950/20 py-20">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-black text-white md:text-4xl">OUR PROUD SPONSORS</h2>
            <p className="text-gray-400">Partner with North Wales Crusaders</p>
          </div>

          <div className="grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-6">
            {sponsorsLoading
              ? Array.from({ length: 6 }).map((_, index) => (
                  <div
                    key={index}
                    className="aspect-square animate-pulse rounded-xl border border-red-700/40 bg-white/5"
                  />
                ))
              : sponsorCards.length > 0
                ? sponsorCards.map((sponsor) => (
                    <motion.div
                      key={sponsor.id}
                      initial={{ opacity: 0, scale: 0.8 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      whileHover={{ scale: 1.05, y: -5 }}
                      className="aspect-square rounded-xl border border-red-700/40 bg-gradient-to-br from-red-900/30 to-black p-5 shadow-lg"
                    >
                      <div className="flex h-full flex-col items-center justify-center text-center">
                        {sponsor.logo_url ? (
                          <img src={sponsor.logo_url} alt={sponsor.name} className="max-h-16 w-auto object-contain" />
                        ) : (
                          <>
                            <div className="text-xs font-black uppercase tracking-[0.28em] text-red-400">
                              {sponsor.tier}
                            </div>
                            <div className="mt-3 text-lg font-bold text-white">{sponsor.name}</div>
                          </>
                        )}
                      </div>
                    </motion.div>
                  ))
                : Array.from({ length: 6 }).map((_, index) => (
                    <div
                      key={index}
                      className="flex aspect-square items-center justify-center rounded-xl border border-dashed border-red-600 bg-gradient-to-br from-red-900/30 to-black"
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

      <section className="bg-black py-20">
        <div className="container mx-auto px-4">
          <h2 className="mb-10 text-center text-3xl font-black text-white md:text-4xl">LATEST NEWS</h2>

          {postsLoading ? (
            <div className="grid gap-6 md:grid-cols-3">
              {[1, 2, 3].map((item) => (
                <div key={item} className="animate-pulse overflow-hidden rounded-xl border border-white/10 bg-white/5">
                  <div className="h-48 w-full bg-white/10" />
                  <div className="space-y-3 p-5">
                    <div className="h-3 w-24 rounded bg-white/10" />
                    <div className="h-5 w-full rounded bg-white/10" />
                    <div className="h-4 w-3/4 rounded bg-white/5" />
                  </div>
                </div>
              ))}
            </div>
          ) : posts.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-3">
              {posts.map((post) => (
                <motion.div
                  key={post.id}
                  whileHover={{ y: -4 }}
                  onClick={() => navigate(`/news/${post.slug}`)}
                  className="group cursor-pointer overflow-hidden rounded-xl border border-white/10 bg-white/5"
                >
                  {post.featured_image_url && (
                    <img
                      src={post.featured_image_url}
                      alt={post.title}
                      className="h-48 w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  )}

                  <div className="p-5">
                    <div className="mb-1 text-xs text-red-500">
                      {post.published_at ? format(new Date(post.published_at), "d MMM yyyy") : ""}
                    </div>
                    <h3 className="mb-1 font-bold text-white">{post.title}</h3>
                    <p className="text-sm text-gray-400">{post.excerpt}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-500">
              No news yet. Import the starter stories from admin when you are ready.
            </p>
          )}
        </div>
      </section>
    </div>
  );
}
