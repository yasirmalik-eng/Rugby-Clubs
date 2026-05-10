import { motion } from "motion/react";
import { ArrowLeft, Calendar, User, Loader2, AlertCircle } from "lucide-react";
import { useParams, useNavigate } from "react-router";
import { useBlogPost } from "../../hooks/useBlogPost";
import { format } from "date-fns";

export function NewsDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { post, loading, error } = useBlogPost(slug);

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-red-500 animate-spin" />
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen bg-black pt-24 flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-white text-2xl font-black mb-2">Article Not Found</h2>
          <p className="text-gray-400 mb-6">This article may have been removed or the link is incorrect.</p>
          <button onClick={() => navigate("/news")} className="px-6 py-3 bg-red-700 hover:bg-red-600 text-white rounded-xl font-bold transition-colors">← Back to News</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black pt-24 pb-20">
      {/* Hero Image */}
      {post.featured_image_url && (
        <div className="relative h-96 overflow-hidden mb-0">
          <img src={post.featured_image_url} alt={post.title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
        </div>
      )}

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl">
        {/* Back */}
        <button onClick={() => navigate("/news")} className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-8 mt-8">
          <ArrowLeft className="w-4 h-4" /> Back to News
        </button>

        {/* Meta */}
        <div className="flex flex-wrap gap-4 text-sm text-gray-500 mb-5">
          {post.published_at && (
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-red-500" />
              {format(new Date(post.published_at), "d MMMM yyyy")}
            </div>
          )}
        </div>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl md:text-5xl font-black text-white mb-6 leading-tight"
        >
          {post.title}
        </motion.h1>

        {post.excerpt && (
          <p className="text-gray-300 text-xl leading-relaxed mb-8 border-l-4 border-red-600 pl-5">{post.excerpt}</p>
        )}

        {/* Divider */}
        <div className="border-t border-white/10 mb-8" />

        {/* Content */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="prose prose-invert prose-lg max-w-none
            prose-headings:text-white prose-headings:font-black
            prose-p:text-gray-300 prose-p:leading-relaxed
            prose-a:text-red-400 prose-a:no-underline hover:prose-a:underline
            prose-strong:text-white
            prose-img:rounded-xl prose-img:shadow-xl
            prose-blockquote:border-red-600 prose-blockquote:text-gray-400"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />
      </div>
    </div>
  );
}
