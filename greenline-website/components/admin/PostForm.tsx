"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import RichTextEditor from "./RichTextEditor";
import MediaPicker from "./MediaPicker";
import { useAdminAuth } from "./AdminAuthContext";
import { adminApi, AdminBlogPost, PostInput } from "@/lib/admin-api";

interface PostFormProps {
  initial?: AdminBlogPost;
  mode: "create" | "edit";
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/[\s-]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 120);
}

const today = () => new Date().toISOString().slice(0, 10);

// "2026-04-29T13:30:00Z" → "2026-04-29T13:30" (datetime-local input)
function isoToLocal(iso: string): string {
  if (!iso) return "";
  try {
    const d = new Date(iso);
    if (isNaN(d.getTime())) return "";
    const pad = (n: number) => String(n).padStart(2, "0");
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(
      d.getHours()
    )}:${pad(d.getMinutes())}`;
  } catch {
    return "";
  }
}

export default function PostForm({ initial, mode }: PostFormProps) {
  const router = useRouter();
  const search = useSearchParams();
  const { user } = useAdminAuth();
  const canPublish = user?.role === "admin" || user?.role === "editor";

  const [title, setTitle] = useState(initial?.title ?? "");
  const [slug, setSlug] = useState(initial?.slug ?? "");
  const [seoTitle, setSeoTitle] = useState(initial?.seo_title ?? "");
  const [metaDescription, setMetaDescription] = useState(
    initial?.meta_description ?? ""
  );
  const [author, setAuthor] = useState(initial?.author ?? "Greenline Team");
  const [publishDate, setPublishDate] = useState(
    initial?.publish_date?.slice(0, 10) ?? today()
  );
  const [featuredImageUrl, setFeaturedImageUrl] = useState(
    initial?.featured_image_url ?? ""
  );
  const [bodyHtml, setBodyHtml] = useState(initial?.body_html ?? "");
  const [tags, setTags] = useState((initial?.tags ?? []).join(", "));
  const [status, setStatus] = useState<"draft" | "published" | "scheduled">(
    initial?.status ?? "draft"
  );
  const [scheduledFor, setScheduledFor] = useState(
    isoToLocal(initial?.scheduled_for ?? "")
  );

  const slugTouched = useRef(initial !== undefined && Boolean(initial.slug));
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploadingFeatured, setUploadingFeatured] = useState(false);
  const featuredInputRef = useRef<HTMLInputElement>(null);
  const [seoSuggesting, setSeoSuggesting] = useState(false);
  const [outlineGenerating, setOutlineGenerating] = useState(false);
  const [scheduling, setScheduling] = useState(false);
  const [mediaPickerFor, setMediaPickerFor] = useState<null | "featured">(null);
  const [showImportMd, setShowImportMd] = useState(
    mode === "create" && search.get("import") === "md"
  );
  const [importMd, setImportMd] = useState("");
  const [importingMd, setImportingMd] = useState(false);

  useEffect(() => {
    if (!slugTouched.current && title) {
      setSlug(slugify(title));
    }
  }, [title]);

  const buildPayload = (overrideStatus?: "draft" | "published" | "scheduled"): PostInput => ({
    title: title.trim(),
    slug: slug.trim() || slugify(title),
    seo_title: seoTitle.trim(),
    meta_description: metaDescription.trim(),
    author: author.trim() || "Greenline",
    publish_date: publishDate,
    featured_image_url: featuredImageUrl.trim(),
    body_html: bodyHtml,
    tags: tags
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean),
    status: overrideStatus ?? status,
    scheduled_for: scheduledFor ? new Date(scheduledFor).toISOString() : "",
  });

  const submit = async (saveStatus: "draft" | "published") => {
    if (!title.trim()) {
      setError("Title is required");
      return;
    }
    if (!bodyHtml || bodyHtml === "<p></p>") {
      setError("Post body is required");
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      const payload = buildPayload(saveStatus);
      if (mode === "create") {
        const created = await adminApi.createPost(payload);
        router.push(`/admin/posts/${created.id}/edit`);
      } else if (initial) {
        await adminApi.updatePost(initial.id, payload);
        setStatus(saveStatus);
        router.refresh();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Save failed");
    } finally {
      setSubmitting(false);
    }
  };

  const onSchedule = async () => {
    if (!scheduledFor) {
      setError("Pick a date & time first.");
      return;
    }
    if (mode === "create") {
      setError("Save the post first, then schedule it.");
      return;
    }
    if (!initial) return;
    setScheduling(true);
    setError(null);
    try {
      const iso = new Date(scheduledFor).toISOString();
      const updated = await adminApi.schedulePost(initial.id, iso);
      setStatus(updated.status);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Scheduling failed");
    } finally {
      setScheduling(false);
    }
  };

  const onGenerateOutline = async () => {
    if (!title.trim()) {
      setError("Add a working title first — the outline needs something to work with.");
      return;
    }
    setOutlineGenerating(true);
    setError(null);
    try {
      const { body_html } = await adminApi.generateOutline(title);
      setBodyHtml(body_html);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Outline generation failed");
    } finally {
      setOutlineGenerating(false);
    }
  };

  const onImportMarkdown = async () => {
    if (!title.trim() || !importMd.trim()) {
      setError("Title and markdown body are both required to import.");
      return;
    }
    setImportingMd(true);
    setError(null);
    try {
      const created = await adminApi.importMarkdown({
        title: title.trim(),
        slug: slug.trim() || undefined,
        author: author.trim() || undefined,
        publish_date: publishDate,
        tags: tags.split(",").map((t) => t.trim()).filter(Boolean),
        markdown: importMd,
      });
      router.push(`/admin/posts/${created.id}/edit`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Import failed");
    } finally {
      setImportingMd(false);
    }
  };

  const onFeaturedUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingFeatured(true);
    try {
      const { url } = await adminApi.uploadImage(file);
      setFeaturedImageUrl(url);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploadingFeatured(false);
      if (featuredInputRef.current) featuredInputRef.current.value = "";
    }
  };

  const onSuggestSeo = async () => {
    if (!bodyHtml || bodyHtml === "<p></p>") {
      setError("Write some body text first — the AI needs something to work with.");
      return;
    }
    setSeoSuggesting(true);
    setError(null);
    try {
      const { meta_description } = await adminApi.suggestSeo(title, bodyHtml);
      setMetaDescription(meta_description);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to generate meta description"
      );
    } finally {
      setSeoSuggesting(false);
    }
  };

  return (
    <main className="min-h-screen pb-20">
      <header className="bg-ink text-bone border-b-2 border-ink sticky top-0 z-30">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Link
              href="/admin"
              className="text-xs font-display font-bold uppercase tracking-wider hover:text-canopy"
              data-testid="post-form-back"
            >
              ← Dashboard
            </Link>
            <span className="text-sm font-display font-bold uppercase tracking-tight truncate max-w-md">
              {mode === "create" ? "New post" : title || "Untitled"}
            </span>
          </div>
          <div className="flex items-center gap-2">
            {(initial?.status === "published") && (
              <Link
                href={`/blog/${initial.slug}`}
                target="_blank"
                className="text-xs font-display font-bold uppercase tracking-wider hover:text-canopy"
                data-testid="post-form-view-link"
              >
                View live ↗
              </Link>
            )}
            <button
              type="button"
              onClick={() => submit("draft")}
              disabled={submitting}
              className="text-xs font-display font-bold uppercase tracking-wider px-4 py-2 border-2 border-bone hover:bg-bone hover:text-ink disabled:opacity-50"
              data-testid="post-form-save-draft"
            >
              Save draft
            </button>
            {canPublish && (
              <button
                type="button"
                onClick={() => submit("published")}
                disabled={submitting}
                className="text-xs font-display font-bold uppercase tracking-wider px-4 py-2 bg-canopy text-ink border-2 border-canopy hover:bg-canopy-dark disabled:opacity-50"
                data-testid="post-form-publish"
              >
                {submitting
                  ? "Saving…"
                  : status === "published"
                  ? "Update & publish"
                  : "Publish"}
              </button>
            )}
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-6 pt-8">
        {error && (
          <div
            className="mb-6 border-2 border-ink bg-street/20 px-4 py-3 font-bold"
            data-testid="post-form-error"
          >
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="label-brutal !mb-0" htmlFor="title">
                  Title *
                </label>
                {mode === "create" && (
                  <button
                    type="button"
                    onClick={onGenerateOutline}
                    disabled={outlineGenerating}
                    className="text-[10px] font-display font-bold uppercase tracking-wider px-2 py-1 border-2 border-ink bg-canopy hover:bg-canopy-dark hover:text-bone transition disabled:opacity-50"
                    title="Have Claude draft an H2/H3 skeleton from the title"
                    data-testid="post-form-outline"
                  >
                    {outlineGenerating ? "Drafting…" : "✨ Generate outline"}
                  </button>
                )}
              </div>
              <input
                id="title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Post title"
                className="input-brutal text-2xl font-display font-bold"
                data-testid="post-form-title"
              />
            </div>

            {mode === "create" && (
              <div className="bg-white border-2 border-ink shadow-brutal p-4">
                <div className="flex items-center justify-between mb-2">
                  <p className="eyebrow">Import from markdown</p>
                  <button
                    type="button"
                    onClick={() => setShowImportMd(!showImportMd)}
                    className="text-[10px] font-display font-bold uppercase tracking-wider px-2 py-1 border-2 border-ink hover:bg-ink hover:text-bone"
                    data-testid="post-form-import-toggle"
                  >
                    {showImportMd ? "Hide" : "Show"}
                  </button>
                </div>
                {showImportMd && (
                  <>
                    <textarea
                      rows={6}
                      value={importMd}
                      onChange={(e) => setImportMd(e.target.value)}
                      placeholder="# Heading&#10;Your post body in markdown..."
                      className="input-brutal text-sm font-mono"
                      data-testid="post-form-import-textarea"
                    />
                    <div className="mt-2 flex justify-end">
                      <button
                        type="button"
                        onClick={onImportMarkdown}
                        disabled={importingMd}
                        className="btn-canopy text-xs disabled:opacity-50"
                        data-testid="post-form-import-submit"
                      >
                        {importingMd ? "Importing…" : "Import as draft"}
                      </button>
                    </div>
                  </>
                )}
              </div>
            )}

            <div>
              <label className="label-brutal" htmlFor="body">
                Body *
              </label>
              <RichTextEditor value={bodyHtml} onChange={setBodyHtml} />
            </div>
          </div>

          <aside className="space-y-6">
            <div className="bg-white border-2 border-ink shadow-brutal p-5">
              <p className="eyebrow mb-3">Status</p>
              <p
                className={`inline-block text-xs font-display font-bold uppercase tracking-wider px-3 py-1.5 border-2 border-ink ${
                  status === "published"
                    ? "bg-canopy text-ink"
                    : status === "scheduled"
                    ? "bg-bone-warm text-ink"
                    : "bg-street text-bone"
                }`}
                data-testid="post-form-status"
              >
                {status === "scheduled" ? "⏰ Scheduled" : status}
              </p>
              {status === "scheduled" && initial?.scheduled_for && (
                <p className="text-[11px] font-mono text-ink/60 mt-2">
                  Goes live: {new Date(initial.scheduled_for).toLocaleString()}
                </p>
              )}
            </div>

            {canPublish && mode === "edit" && (
              <div className="bg-white border-2 border-ink shadow-brutal p-5 space-y-3">
                <p className="eyebrow">Schedule publish</p>
                <input
                  type="datetime-local"
                  value={scheduledFor}
                  onChange={(e) => setScheduledFor(e.target.value)}
                  className="input-brutal text-sm"
                  data-testid="post-form-schedule-input"
                />
                <button
                  type="button"
                  onClick={onSchedule}
                  disabled={scheduling || !scheduledFor}
                  className="text-xs font-display font-bold uppercase tracking-wider px-3 py-2 w-full border-2 border-ink bg-bone-warm hover:bg-canopy disabled:opacity-50"
                  data-testid="post-form-schedule-submit"
                >
                  {scheduling ? "Scheduling…" : "⏰ Schedule"}
                </button>
                <p className="text-[11px] text-ink/50">
                  Post will flip to "published" automatically at this time (UTC: backend converts your local timezone).
                </p>
              </div>
            )}

            <div className="bg-white border-2 border-ink shadow-brutal p-5 space-y-4">
              <div>
                <label className="label-brutal" htmlFor="slug">
                  Slug
                </label>
                <input
                  id="slug"
                  type="text"
                  value={slug}
                  onChange={(e) => {
                    slugTouched.current = true;
                    setSlug(slugify(e.target.value));
                  }}
                  className="input-brutal font-mono text-sm"
                  data-testid="post-form-slug"
                />
                <p className="text-[11px] text-ink/50 mt-1">/blog/{slug || "…"}</p>
              </div>

              <div>
                <label className="label-brutal" htmlFor="author">
                  Author
                </label>
                <input
                  id="author"
                  type="text"
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  className="input-brutal text-sm"
                  data-testid="post-form-author"
                />
              </div>

              <div>
                <label className="label-brutal" htmlFor="publish_date">
                  Publish date
                </label>
                <input
                  id="publish_date"
                  type="date"
                  value={publishDate}
                  onChange={(e) => setPublishDate(e.target.value)}
                  className="input-brutal text-sm"
                  data-testid="post-form-date"
                />
              </div>

              <div>
                <label className="label-brutal" htmlFor="tags">
                  Tags (comma-separated)
                </label>
                <input
                  id="tags"
                  type="text"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  placeholder="Field Marketing, Florida"
                  className="input-brutal text-sm"
                  data-testid="post-form-tags"
                />
              </div>
            </div>

            <div className="bg-white border-2 border-ink shadow-brutal p-5 space-y-4">
              <p className="eyebrow">Featured image</p>
              {featuredImageUrl && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={featuredImageUrl}
                  alt="Featured"
                  className="w-full border-2 border-ink object-cover max-h-48"
                  data-testid="post-form-featured-preview"
                />
              )}
              <input
                type="text"
                value={featuredImageUrl}
                onChange={(e) => setFeaturedImageUrl(e.target.value)}
                placeholder="Image URL"
                className="input-brutal text-sm"
                data-testid="post-form-featured-url"
              />
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => featuredInputRef.current?.click()}
                  disabled={uploadingFeatured}
                  className="btn-secondary text-xs flex-1 justify-center disabled:opacity-50"
                  data-testid="post-form-featured-upload"
                >
                  {uploadingFeatured ? "Uploading…" : "Upload"}
                </button>
                <button
                  type="button"
                  onClick={() => setMediaPickerFor("featured")}
                  className="btn-secondary text-xs flex-1 justify-center"
                  data-testid="post-form-featured-library"
                >
                  Library
                </button>
                {featuredImageUrl && (
                  <button
                    type="button"
                    onClick={() => setFeaturedImageUrl("")}
                    className="btn-secondary text-xs"
                    data-testid="post-form-featured-clear"
                  >
                    Clear
                  </button>
                )}
              </div>
              <input
                ref={featuredInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={onFeaturedUpload}
              />
            </div>

            <div className="bg-white border-2 border-ink shadow-brutal p-5 space-y-4">
              <p className="eyebrow">SEO</p>
              <div>
                <label className="label-brutal" htmlFor="seo_title">
                  SEO title
                </label>
                <input
                  id="seo_title"
                  type="text"
                  value={seoTitle}
                  onChange={(e) => setSeoTitle(e.target.value)}
                  className="input-brutal text-sm"
                  data-testid="post-form-seo-title"
                />
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="label-brutal !mb-0" htmlFor="meta_description">
                    Meta description
                  </label>
                  <button
                    type="button"
                    onClick={onSuggestSeo}
                    disabled={seoSuggesting}
                    className="text-[10px] font-display font-bold uppercase tracking-wider px-2 py-1 border-2 border-ink bg-canopy hover:bg-canopy-dark hover:text-bone transition disabled:opacity-50"
                    title="Generate from post body using Claude"
                    data-testid="post-form-meta-suggest"
                  >
                    {seoSuggesting ? "Thinking…" : "✨ AI suggest"}
                  </button>
                </div>
                <textarea
                  id="meta_description"
                  value={metaDescription}
                  onChange={(e) => setMetaDescription(e.target.value)}
                  rows={3}
                  className="input-brutal text-sm"
                  data-testid="post-form-meta"
                />
                <p className="text-[11px] text-ink/50 mt-1">
                  {metaDescription.length}/160 characters
                  {metaDescription.length > 160 && (
                    <span className="text-street font-bold"> · over limit</span>
                  )}
                </p>
              </div>
            </div>
          </aside>
        </div>
      </div>

      <MediaPicker
        open={mediaPickerFor !== null}
        onClose={() => setMediaPickerFor(null)}
        onPick={(url) => {
          if (mediaPickerFor === "featured") setFeaturedImageUrl(url);
        }}
      />

      {mode === "edit" && initial && (
        <div className="max-w-6xl mx-auto px-6 mt-6">
          <a
            href={`${process.env.NEXT_PUBLIC_BACKEND_URL ?? ""}/api/admin/posts/${initial.id}/export.md`}
            target="_blank"
            rel="noreferrer"
            className="text-[11px] font-display font-bold uppercase tracking-wider hover:text-canopy"
            data-testid="post-form-export-md"
          >
            ⬇ Download as markdown
          </a>
        </div>
      )}
    </main>
  );
}
