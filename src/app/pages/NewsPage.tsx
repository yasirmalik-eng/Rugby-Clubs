import { format } from "date-fns";
import { motion } from "motion/react";
import { ArrowRight, Calendar, Newspaper, Search } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router";
import { useBlogPosts } from "../../hooks/useBlogPosts";
import { supabase } from "../../lib/supabase";
import { toast } from "sonner";

export function NewsPage() {
  const navigate = useNavigate();
  const [page, setPage] = useState(0);
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [subscribing, setSubscribing] = useState(false);
  const LIMIT = 9;
  const { posts, loading, error, total } = useBlogPosts(LIMIT, page);
  const totalPages = Math.ceil(total / LIMIT);
  const [featuredPost, ...remainingPosts] = posts;

  const handleSubscribe = async () => {
    const email = newsletterEmail.trim();

    if (!email) {
      toast.error("Please enter your email address.");
      return;
    }

    const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    if (!isValidEmail) {
      toast.error("Please enter a valid email address.");
      return;
    }

    setSubscribing(true);

    const { error: insertError } = await supabase.from("contact_submissions").insert([
      {
        name: "Newsletter Subscriber",
        email,
        subject: "Newsletter Subscription",
        message: "Please add this email address to the club newsletter mailing list.",
      },
    ]);

    setSubscribing(false);

    if (insertError) {
      toast.error("Subscription failed. Please try again.");
      return;
    }

    toast.success("You have been added to the newsletter list.");
    setNewsletterEmail("");
  };

  return (
    <div className="min-h-screen bg-black pt-24 pb-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-16 text-center"
        >
          <div className="mb-4 inline-block rounded-full border border-red-600 bg-red-800/30 px-4 py-2">
            <span className="flex items-center gap-2 text-sm font-bold text-red-400">
              <Newspaper className="h-4 w-4" />
              LATEST UPDATES
            </span>
          </div>

          <h1 className="mb-4 text-5xl font-black text-white md:text-6xl">CLUB NEWS</h1>

          <p className="mx-auto max-w-2xl text-xl text-gray-400">
            Stay connected with the latest match reports, club updates, and stories from around the squad.
          </p>
        </motion.div>

        {loading ? (
          <div className="mx-auto max-w-6xl">
            <div className="mb-16 overflow-hidden rounded-3xl border-2 border-red-600/40 bg-gradient-to-br from-red-900/30 to-black animate-pulse">
              <div className="grid md:grid-cols-2">
                <div className="aspect-video bg-white/10" />
                <div className="flex justify-center p-8 md:p-12">
                  <div className="w-full space-y-4">
                    <div className="h-6 w-40 rounded bg-white/10" />
                    <div className="h-12 w-full rounded bg-white/10" />
                    <div className="h-5 w-4/5 rounded bg-white/5" />
                    <div className="h-5 w-2/3 rounded bg-white/5" />
                    <div className="h-10 w-40 rounded bg-white/10" />
                  </div>
                </div>
              </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, index) => (
                <div key={index} className="overflow-hidden rounded-2xl border border-white/10 bg-white/5 animate-pulse">
                  <div className="aspect-video bg-white/10" />
                  <div className="space-y-3 p-6">
                    <div className="h-5 w-32 rounded bg-white/10" />
                    <div className="h-7 w-full rounded bg-white/10" />
                    <div className="h-4 w-4/5 rounded bg-white/5" />
                    <div className="h-4 w-24 rounded bg-white/10" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : error ? (
          <div className="py-24 text-center">
            <p className="text-lg text-red-400">Failed to load news articles. Please try again.</p>
          </div>
        ) : posts.length === 0 ? (
          <div className="py-24 text-center">
            <Search className="mx-auto mb-4 h-12 w-12 text-gray-700" />
            <p className="text-lg text-gray-500">No news articles published yet.</p>
          </div>
        ) : (
          <>
            {featuredPost && (
              <motion.article
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
                whileHover={{ y: -8 }}
                onClick={() => navigate(`/news/${featuredPost.slug}`)}
                className="group mx-auto mb-16 max-w-6xl cursor-pointer"
              >
                <div className="overflow-hidden rounded-3xl border-2 border-red-600 bg-gradient-to-br from-red-900/30 to-black transition-all hover:shadow-2xl hover:shadow-red-900/40">
                  <div className="grid md:grid-cols-2">
                    <div className="aspect-video overflow-hidden md:aspect-auto">
                      {featuredPost.featured_image_url ? (
                        <img
                          src={featuredPost.featured_image_url}
                          alt={featuredPost.title}
                          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                      ) : (
                        <div className="flex h-full min-h-72 items-center justify-center bg-gradient-to-br from-red-950/60 to-black">
                          <Newspaper className="h-16 w-16 text-red-800" />
                        </div>
                      )}
                    </div>

                    <div className="flex flex-col justify-center p-8 md:p-12">
                      <div className="mb-4 flex flex-wrap items-center gap-3">
                        <span className="rounded-full bg-red-600 px-3 py-1 text-xs font-bold text-white">
                          FEATURED
                        </span>
                        <span className="rounded-full border border-green-700 bg-green-900/50 px-3 py-1 text-xs font-bold text-green-400">
                          Club News
                        </span>
                      </div>

                      <h2 className="mb-4 text-3xl font-black text-white transition-colors group-hover:text-red-400 md:text-4xl">
                        {featuredPost.title}
                      </h2>

                      <p className="mb-6 text-lg leading-relaxed text-gray-300">
                        {featuredPost.excerpt ?? "Read the latest update from North Wales Crusaders."}
                      </p>

                      <div className="mb-6 flex items-center gap-2 text-sm text-gray-400">
                        <Calendar className="h-4 w-4 text-red-500" />
                        {featuredPost.published_at
                          ? format(new Date(featuredPost.published_at), "d MMM yyyy")
                          : "Latest update"}
                      </div>

                      <div className="flex items-center gap-2 font-bold text-red-500">
                        READ FULL ARTICLE
                        <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                      </div>
                    </div>
                  </div>
                </div>
              </motion.article>
            )}

            {remainingPosts.length > 0 && (
              <div className="mx-auto max-w-6xl">
                <motion.h2
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.25 }}
                  className="mb-8 text-3xl font-black text-white"
                >
                  ALL NEWS
                </motion.h2>

                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {remainingPosts.map((post, index) => (
                    <motion.article
                      key={post.id}
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 + index * 0.06 }}
                      whileHover={{ y: -8 }}
                      onClick={() => navigate(`/news/${post.slug}`)}
                      className="group h-full cursor-pointer"
                    >
                      <div className="flex h-full flex-col overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-red-900/10 to-black transition-all hover:border-red-600/50">
                        <div className="aspect-video overflow-hidden">
                          {post.featured_image_url ? (
                            <img
                              src={post.featured_image_url}
                              alt={post.title}
                              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                            />
                          ) : (
                            <div className="flex h-full items-center justify-center bg-gradient-to-br from-red-950/40 to-black">
                              <Newspaper className="h-12 w-12 text-red-800" />
                            </div>
                          )}
                        </div>

                        <div className="flex flex-1 flex-col p-6">
                          <div className="mb-3 flex items-center justify-between gap-3">
                            <span className="rounded border border-green-700 bg-green-900/50 px-2 py-1 text-xs font-bold text-green-400">
                              Club News
                            </span>
                            <div className="flex items-center gap-1 text-xs text-gray-500">
                              <Calendar className="h-3 w-3" />
                              {post.published_at
                                ? format(new Date(post.published_at), "d MMM yyyy")
                                : "Published"}
                            </div>
                          </div>

                          <h3 className="mb-3 flex-1 line-clamp-2 text-xl font-bold text-white transition-colors group-hover:text-red-400">
                            {post.title}
                          </h3>

                          <p className="mb-4 line-clamp-3 text-sm text-gray-400">
                            {post.excerpt ?? "Open the story for the full club update."}
                          </p>

                          <div className="flex items-center gap-2 text-sm font-bold text-red-500">
                            Read More
                            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                          </div>
                        </div>
                      </div>
                    </motion.article>
                  ))}
                </div>
              </div>
            )}

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mx-auto mt-20 max-w-4xl"
            >
              <div className="rounded-[2rem] border-2 border-red-700 bg-gradient-to-r from-red-950/70 via-[#20170e] to-green-950/70 p-8 text-center md:p-12">
                <h3 className="mb-4 text-3xl font-black text-white">NEVER MISS AN UPDATE</h3>

                <p className="mb-8 text-gray-300">
                  Subscribe to our newsletter for exclusive news, match updates, and special offers
                </p>

                <div className="mx-auto flex max-w-2xl flex-col justify-center gap-4 sm:flex-row">
                  <input
                    type="email"
                    placeholder="Your email address"
                    value={newsletterEmail}
                    onChange={(event) => setNewsletterEmail(event.target.value)}
                    onKeyDown={(event) => {
                      if (event.key === "Enter") {
                        event.preventDefault();
                        void handleSubscribe();
                      }
                    }}
                    className="flex-1 rounded-2xl border border-white/15 bg-black/55 px-8 py-5 text-lg text-white placeholder:text-gray-500 focus:border-red-600 focus:outline-none"
                  />

                  <button
                    type="button"
                    onClick={() => void handleSubscribe()}
                    disabled={subscribing}
                    className="rounded-2xl border-2 border-red-500 bg-red-700 px-10 py-5 text-lg font-black text-white transition-colors hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-70"
                  >
                    {subscribing ? "SUBSCRIBING..." : "SUBSCRIBE"}
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}

        {totalPages > 1 && (
          <div className="mt-12 flex justify-center gap-3">
            <button
              onClick={() => setPage((currentPage) => Math.max(0, currentPage - 1))}
              disabled={page === 0}
              className="rounded-xl border border-white/10 bg-white/5 px-5 py-2 font-semibold text-white transition-colors hover:bg-white/10 disabled:opacity-30"
            >
              &larr; Prev
            </button>
            <span className="px-5 py-2 text-sm text-gray-400">
              {page + 1} / {totalPages}
            </span>
            <button
              onClick={() => setPage((currentPage) => Math.min(totalPages - 1, currentPage + 1))}
              disabled={page >= totalPages - 1}
              className="rounded-xl border border-white/10 bg-white/5 px-5 py-2 font-semibold text-white transition-colors hover:bg-white/10 disabled:opacity-30"
            >
              Next &rarr;
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
