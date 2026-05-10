import { useEffect, useRef, useState, type ChangeEvent } from "react";
import { motion } from "motion/react";
import {
  Plus,
  Pencil,
  Trash2,
  Loader2,
  Eye,
  EyeOff,
  Check,
  X,
  Globe,
  Bold,
  Italic,
  Underline,
  Strikethrough,
  List,
  ListOrdered,
  Quote,
  Heading2,
  Heading3,
  Link as LinkIcon,
  Unlink,
  Image,
  Undo2,
  Redo2,
  Eraser,
  Minus,
  Upload,
} from "lucide-react";
import { supabase } from "../../../lib/supabase";
import { format } from "date-fns";
import { toast } from "sonner";
import { useAuth } from "../../../context/AuthContext";
import type { Database } from "../../../lib/database.types";
import { normalizeBlogHtmlContent, normalizeBlogPostMedia, resolveBlogImageUrl } from "../../../lib/blogMedia";
import { uploadBlogImage } from "../../../lib/blogStorage";

type BlogPost = Database["public"]["Tables"]["blog_posts"]["Row"];

function slugify(text: string) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

export function BlogAdmin() {
  const { user } = useAuth();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [view, setView] = useState<"list" | "editor">("list");
  const [editPost, setEditPost] = useState<Partial<BlogPost>>({});
  const [saving, setSaving] = useState(false);
  const [uploadingTarget, setUploadingTarget] = useState<"featured" | "content" | null>(null);
  const editorRef = useRef<HTMLDivElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const fetchPosts = async () => {
    setLoading(true);
    const { data, error } = await supabase.from("blog_posts").select("*").order("created_at", { ascending: false });
    setError(error?.message ?? null);
    setPosts((data ?? []).map(normalizeBlogPostMedia));
    setLoading(false);
  };

  useEffect(() => {
    void fetchPosts();
  }, []);

  const openNew = () => {
    setEditPost({
      title: "",
      slug: "",
      excerpt: "",
      content: "",
      featured_image_url: "",
      is_published: false,
      author_id: user?.id ?? "",
    });
    setView("editor");
  };

  const openEdit = (post: BlogPost) => {
    setEditPost(normalizeBlogPostMedia(post));
    setView("editor");
  };

  const handleTitleChange = (title: string) => {
    setEditPost((prev) => ({ ...prev, title, slug: prev.id ? prev.slug : slugify(title) }));
  };

  const handleSave = async (publish?: boolean) => {
    if (!editPost.title || !editPost.content) {
      toast.error("Title and content are required");
      return;
    }

    if (!user?.id) {
      toast.error("You must be signed in to save a post");
      return;
    }

    setSaving(true);

    const payload = {
      title: editPost.title,
      slug: editPost.slug || slugify(editPost.title),
      excerpt: editPost.excerpt ?? null,
      content: normalizeBlogHtmlContent(editPost.content),
      featured_image_url: resolveBlogImageUrl(editPost.featured_image_url) ?? null,
      is_published: publish ?? editPost.is_published ?? false,
      published_at: publish
        ? editPost.published_at ?? new Date().toISOString()
        : editPost.is_published
        ? editPost.published_at ?? null
        : null,
      updated_at: new Date().toISOString(),
      author_id: user.id,
    };

    const result = editPost.id
      ? await supabase.from("blog_posts").update(payload).eq("id", editPost.id)
      : await supabase.from("blog_posts").insert([{ ...payload, created_at: new Date().toISOString() }]);

    setSaving(false);

    if (result.error) {
      setError(result.error.message);
      toast.error(result.error.message);
      return;
    }

    toast.success(editPost.id ? (publish ? "Post published!" : "Saved") : "Post created!");
    setView("list");
    void fetchPosts();
  };

  const handleTogglePublish = async (post: BlogPost) => {
    const newState = !post.is_published;
    const { error } = await supabase
      .from("blog_posts")
      .update({ is_published: newState, published_at: newState ? post.published_at ?? new Date().toISOString() : null })
      .eq("id", post.id);

    if (error) {
      setError(error.message);
      toast.error(error.message);
      return;
    }

    toast.success(newState ? "Post published" : "Post unpublished");
    void fetchPosts();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this post permanently?")) return;

    const { error } = await supabase.from("blog_posts").delete().eq("id", id);

    if (error) {
      setError(error.message);
      toast.error(error.message);
      return;
    }

    toast.success("Post deleted");
    void fetchPosts();
  };

  const inputClass =
    "w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-red-600 transition-colors placeholder-gray-600";
  const toolbarButtonClass =
    "inline-flex h-10 min-w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 px-3 text-gray-300 transition-colors hover:bg-white/10 hover:text-white";

  useEffect(() => {
    if (view !== "editor" || !editorRef.current) return;

    if (editorRef.current.innerHTML !== (editPost.content ?? "")) {
      editorRef.current.innerHTML = editPost.content ?? "";
    }
  }, [editPost.content, view]);

  const syncEditorContent = () => {
    if (!editorRef.current) return;
    setEditPost((prev) => ({ ...prev, content: editorRef.current?.innerHTML ?? "" }));
  };

  const runEditorCommand = (command: string, value?: string) => {
    if (!editorRef.current) return;

    editorRef.current.focus();
    document.execCommand(command, false, value);
    syncEditorContent();
  };

  const applyBlockFormat = (tag: "p" | "h2" | "h3" | "blockquote" | "pre") => {
    runEditorCommand("formatBlock", tag);
  };

  const insertLink = () => {
    const url = window.prompt("Enter the link URL");
    if (!url) return;
    runEditorCommand("createLink", url);
  };

  const insertImage = () => {
    const url = window.prompt("Enter the image URL");
    if (!url) return;
    runEditorCommand("insertImage", url);
  };

  const openFilePicker = (target: "featured" | "content") => {
    setUploadingTarget(target);
    fileInputRef.current?.click();
  };

  const handleImageUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    const target = uploadingTarget;
    event.target.value = "";

    if (!file || !target) return;
    if (!user?.id) {
      toast.error("You must be signed in to upload an image");
      setUploadingTarget(null);
      return;
    }

    if (!file.type.startsWith("image/")) {
      toast.error("Please choose an image file");
      setUploadingTarget(null);
      return;
    }

    try {
      const publicUrl = await uploadBlogImage(file, user.id);

      if (target === "featured") {
        setEditPost((prev) => ({ ...prev, featured_image_url: publicUrl }));
      } else {
        runEditorCommand("insertImage", publicUrl);
      }

      toast.success("Image uploaded");
    } catch (uploadError) {
      const message = uploadError instanceof Error ? uploadError.message : "Image upload failed";
      toast.error(message);
    } finally {
      setUploadingTarget(null);
    }
  };

  if (view === "editor") {
    return (
      <div className="p-8 max-w-4xl">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleImageUpload}
        />
        <div className="flex items-center gap-4 mb-8">
          <button onClick={() => setView("list")} className="text-gray-400 hover:text-white transition-colors text-sm flex items-center gap-1">
            <X className="w-4 h-4" /> Cancel
          </button>
          <h1 className="text-2xl font-black text-white">{editPost.id ? "Edit Post" : "New Post"}</h1>
        </div>

        <div className="space-y-5">
          <div>
            <label className="text-gray-400 text-sm mb-1.5 block">Title *</label>
            <input value={editPost.title ?? ""} onChange={(e) => handleTitleChange(e.target.value)} placeholder="Match Report: Crusaders vs..." className={inputClass} />
          </div>
          <div>
            <label className="text-gray-400 text-sm mb-1.5 block">Slug</label>
            <input value={editPost.slug ?? ""} onChange={(e) => setEditPost((prev) => ({ ...prev, slug: e.target.value }))} className={inputClass} />
          </div>
          <div>
            <label className="text-gray-400 text-sm mb-1.5 block">Excerpt (shown in card previews)</label>
            <textarea value={editPost.excerpt ?? ""} onChange={(e) => setEditPost((prev) => ({ ...prev, excerpt: e.target.value }))} rows={2} className={`${inputClass} resize-none`} placeholder="Brief description of the article..." />
          </div>
          <div>
            <label className="text-gray-400 text-sm mb-1.5 block">Featured Image URL</label>
            <div className="flex flex-col gap-3 sm:flex-row">
              <input value={editPost.featured_image_url ?? ""} onChange={(e) => setEditPost((prev) => ({ ...prev, featured_image_url: e.target.value }))} placeholder="https://... or upload below" className={inputClass} />
              <button
                type="button"
                onClick={() => openFilePicker("featured")}
                disabled={uploadingTarget !== null}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-white/10 disabled:opacity-60"
              >
                {uploadingTarget === "featured" ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
                Upload
              </button>
            </div>
            {editPost.featured_image_url && (
              <img
                src={resolveBlogImageUrl(editPost.featured_image_url) ?? editPost.featured_image_url}
                alt="Featured preview"
                className="mt-3 h-40 w-full rounded-2xl border border-white/10 object-cover"
              />
            )}
          </div>
          <div>
            <label className="text-gray-400 text-sm mb-3 block">Content *</label>

            <div className="mb-3 rounded-2xl border border-white/10 bg-black/30 p-3">
              <div className="flex flex-wrap gap-2">
                <button type="button" onClick={() => runEditorCommand("bold")} className={toolbarButtonClass} title="Bold">
                  <Bold className="h-4 w-4" />
                </button>
                <button type="button" onClick={() => runEditorCommand("italic")} className={toolbarButtonClass} title="Italic">
                  <Italic className="h-4 w-4" />
                </button>
                <button type="button" onClick={() => runEditorCommand("underline")} className={toolbarButtonClass} title="Underline">
                  <Underline className="h-4 w-4" />
                </button>
                <button type="button" onClick={() => runEditorCommand("strikeThrough")} className={toolbarButtonClass} title="Strikethrough">
                  <Strikethrough className="h-4 w-4" />
                </button>
                <button type="button" onClick={() => applyBlockFormat("h2")} className={toolbarButtonClass} title="Heading 2">
                  <Heading2 className="h-4 w-4" />
                </button>
                <button type="button" onClick={() => applyBlockFormat("h3")} className={toolbarButtonClass} title="Heading 3">
                  <Heading3 className="h-4 w-4" />
                </button>
                <button type="button" onClick={() => applyBlockFormat("p")} className={toolbarButtonClass} title="Paragraph">
                  P
                </button>
                <button type="button" onClick={() => applyBlockFormat("blockquote")} className={toolbarButtonClass} title="Quote">
                  <Quote className="h-4 w-4" />
                </button>
                <button type="button" onClick={() => runEditorCommand("insertUnorderedList")} className={toolbarButtonClass} title="Bullet list">
                  <List className="h-4 w-4" />
                </button>
                <button type="button" onClick={() => runEditorCommand("insertOrderedList")} className={toolbarButtonClass} title="Numbered list">
                  <ListOrdered className="h-4 w-4" />
                </button>
                <button type="button" onClick={insertLink} className={toolbarButtonClass} title="Insert link">
                  <LinkIcon className="h-4 w-4" />
                </button>
                <button type="button" onClick={() => runEditorCommand("unlink")} className={toolbarButtonClass} title="Remove link">
                  <Unlink className="h-4 w-4" />
                </button>
                <button type="button" onClick={insertImage} className={toolbarButtonClass} title="Insert image URL">
                  <Image className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => openFilePicker("content")}
                  disabled={uploadingTarget !== null}
                  className={toolbarButtonClass}
                  title="Upload image"
                >
                  {uploadingTarget === "content" ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
                </button>
                <button type="button" onClick={() => runEditorCommand("insertHorizontalRule")} className={toolbarButtonClass} title="Horizontal line">
                  <Minus className="h-4 w-4" />
                </button>
                <button type="button" onClick={() => runEditorCommand("removeFormat")} className={toolbarButtonClass} title="Clear formatting">
                  <Eraser className="h-4 w-4" />
                </button>
                
              </div>
            </div>

            <div
              ref={editorRef}
              contentEditable
              suppressContentEditableWarning
              onInput={syncEditorContent}
              onBlur={syncEditorContent}
              className="min-h-[420px] w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-4 text-sm leading-7 text-white focus:border-red-600 focus:outline-none [&_a]:text-red-400 [&_blockquote]:border-l-4 [&_blockquote]:border-red-600 [&_blockquote]:pl-4 [&_h2]:mt-6 [&_h2]:text-3xl [&_h2]:font-black [&_h3]:mt-5 [&_h3]:text-2xl [&_h3]:font-black [&_hr]:my-6 [&_img]:my-4 [&_img]:rounded-xl [&_img]:shadow-lg [&_li]:ml-5 [&_ol]:list-decimal [&_ol]:pl-6 [&_p]:mb-4 [&_strong]:font-bold [&_ul]:list-disc [&_ul]:pl-6"
              data-placeholder="Write your article here..."
            />
            <p className="mt-2 text-xs text-gray-500">
              Use the toolbar to format your article content.
            </p>
          </div>
          <div className="flex gap-3 pt-2">
            <button onClick={() => handleSave(false)} disabled={saving} className="flex items-center gap-2 px-5 py-3 bg-white/5 border border-white/10 text-white rounded-xl font-bold text-sm hover:bg-white/10 disabled:opacity-60">
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />} Save Draft
            </button>
            <button onClick={() => handleSave(true)} disabled={saving} className="flex items-center gap-2 px-5 py-3 bg-green-700 hover:bg-green-600 text-white rounded-xl font-bold text-sm disabled:opacity-60">
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Globe className="w-4 h-4" />} Publish
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-black text-white">Blog</h1>
          <p className="text-gray-500 mt-1">Create and manage news articles</p>
        </div>
        <button onClick={openNew} className="flex items-center gap-2 px-5 py-2.5 bg-red-700 hover:bg-red-600 text-white rounded-xl font-bold text-sm transition-colors">
          <Plus className="w-4 h-4" /> New Post
        </button>
      </div>

      {error && <p className="mb-4 text-sm text-amber-400">{error}</p>}

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 text-red-500 animate-spin" />
        </div>
      ) : (
        <div className="space-y-3">
          {posts.length === 0 && <p className="text-center text-gray-600 py-12">No posts yet. Create your first article!</p>}
          {posts.map((post) => (
            <motion.div key={post.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-4 bg-white/5 border border-white/10 rounded-xl px-5 py-4 hover:bg-white/[0.07] transition-colors">
              {post.featured_image_url && <img src={post.featured_image_url} alt="" className="w-14 h-14 rounded-lg object-cover flex-shrink-0" />}
              <div className="flex-1 min-w-0">
                <div className="text-white font-bold text-sm truncate">{post.title}</div>
                <div className="text-gray-500 text-xs mt-0.5">{post.published_at ? format(new Date(post.published_at), "d MMM yyyy") : "Draft"}</div>
              </div>
              <span className={`px-2.5 py-1 rounded-full text-xs font-bold flex-shrink-0 ${post.is_published ? "bg-green-800 text-green-200" : "bg-gray-800 text-gray-400"}`}>
                {post.is_published ? "Published" : "Draft"}
              </span>
              <div className="flex gap-2 flex-shrink-0">
                <button onClick={() => handleTogglePublish(post)} title={post.is_published ? "Unpublish" : "Publish"} className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-colors">
                  {post.is_published ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                </button>
                <button onClick={() => openEdit(post)} className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-colors">
                  <Pencil className="w-3.5 h-3.5" />
                </button>
                <button onClick={() => handleDelete(post.id)} className="p-1.5 rounded-lg bg-red-900/20 hover:bg-red-900/40 text-red-400 transition-colors">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
