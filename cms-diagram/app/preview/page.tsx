// ─── /preview ─────────────────────────────────────────────────────────────────
// Visual preview page for a single OptiNode content item.
//
// Optimizely SaaS CMS opens this page in an iframe when the editor clicks
// "Preview" on an optiNode shared block. It renders both the diagram card AND
// the full flyout panel side-by-side so editors see exactly how their content
// will appear in the live diagram.
//
// The page respects draft mode: if the request came via /api/preview the
// preview_token cookie is present and Graph returns unpublished content.
// ──────────────────────────────────────────────────────────────────────────────

export const dynamic = "force-dynamic";

import { cookies } from "next/headers";
import { fetchNodePreview } from "@/lib/fetch-diagram-data";
import { ExternalLink, FileText, X, Eye, EyeOff } from "lucide-react";
import type { DiagramNode, ContentLink } from "@/data/nodes";
import PreviewRefresh from "@/components/PreviewRefresh";

// ── helpers ───────────────────────────────────────────────────────────────────

function getEmbedUrl(url: string): string | null {
  try {
    const u = new URL(url);
    if (u.hostname.includes("youtube.com")) {
      const id = u.searchParams.get("v");
      return id ? `https://www.youtube.com/embed/${id}` : null;
    }
    if (u.hostname === "youtu.be") {
      return u.pathname.slice(1) ? `https://www.youtube.com/embed/${u.pathname.slice(1)}` : null;
    }
    if (u.hostname.includes("vimeo.com")) {
      const id = u.pathname.replace(/^\//, "");
      return id ? `https://player.vimeo.com/video/${id}` : null;
    }
    return null;
  } catch {
    return null;
  }
}

function LinkList({ links, accent }: { links: ContentLink[]; accent: string }) {
  return (
    <div className="space-y-2">
      {links.map((link, i) =>
        link.href ? (
          <a key={i} href={link.href} target={link.target ?? "_blank"} rel="noopener noreferrer"
            className={`flex items-center gap-2 text-sm font-medium ${accent} hover:underline`}>
            {link.text || link.href}
            <ExternalLink size={12} className="shrink-0" />
          </a>
        ) : null
      )}
    </div>
  );
}

// ── main component ────────────────────────────────────────────────────────────

export default async function PreviewPage({
  searchParams,
}: {
  searchParams: Promise<{ key?: string }>;
}) {
  const params = await searchParams;
  const key = params.key ?? "";

  // Read preview token from cookie (set by /api/preview).
  const cookieStore = await cookies();
  const previewToken = cookieStore.get("opti_preview_token")?.value;
  const isDraft      = Boolean(previewToken);

  if (!key) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-950 text-gray-400">
        <p>No content key provided. Open this page via the CMS preview button.</p>
      </div>
    );
  }

  const node = await fetchNodePreview(key, previewToken);

  if (!node) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-950 text-gray-400">
        <p>Content item not found for key: <code className="font-mono text-sm">{key}</code></p>
      </div>
    );
  }

  const accentText = node.colorClass?.split(" ")[1] ?? "text-white";
  const accentBg   = accentText.replace("text-", "bg-");
  const embedUrl   = node.featuredVideoUrl ? getEmbedUrl(node.featuredVideoUrl) : null;

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100">
      <PreviewRefresh />

      {/* ── Preview banner ── */}
      <div className={`flex items-center justify-between px-5 py-2.5 text-xs font-medium
        ${isDraft ? "bg-amber-500/20 border-b border-amber-500/40 text-amber-300"
                  : "bg-blue-500/20 border-b border-blue-500/40 text-blue-300"}`}>
        <div className="flex items-center gap-2">
          {isDraft ? <Eye size={13} /> : <EyeOff size={13} />}
          {isDraft
            ? "DRAFT PREVIEW — showing unpublished content"
            : "PUBLISHED PREVIEW — showing live content"}
        </div>
        <a href="/api/preview/disable"
          className="flex items-center gap-1.5 hover:text-white transition-colors">
          <X size={13} /> Exit preview
        </a>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-10 space-y-10">

        {/* ── Page title ── */}
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-gray-500 mb-1">
            OptiNode Preview
          </p>
          <h1 className={`text-2xl font-bold ${accentText}`}>{node.label}</h1>
          <p className="text-sm text-gray-500 mt-1">
            Layer: <span className="text-gray-300">{node.layerId}</span>
            {" · "}Key: <span className="font-mono text-gray-400">{node.id}</span>
          </p>
        </div>

        <div className="grid md:grid-cols-[auto_1fr] gap-8 items-start">

          {/* ── Left: Diagram card preview ── */}
          <div className="space-y-3">
            <h2 className="text-xs font-semibold uppercase tracking-widest text-gray-500">
              Diagram Card
            </h2>
            <div className={`flex flex-col items-center gap-1.5 px-4 py-3 rounded-xl border-2
              ${node.bgClass} ${node.colorClass} min-w-[120px] max-w-[160px]`}>
              {node.icon && (
                node.icon.startsWith("http") ? (
                  <img src={node.icon} alt="" aria-hidden="true" className="w-8 h-8 object-contain" />
                ) : (
                  <span className="text-xl leading-none" aria-hidden="true">{node.icon}</span>
                )
              )}
              <span className="text-xs font-semibold text-center leading-tight text-gray-100">
                {node.label}
              </span>
            </div>
          </div>

          {/* ── Right: Flyout panel content ── */}
          <div className="space-y-3">
            <h2 className="text-xs font-semibold uppercase tracking-widest text-gray-500">
              Flyout Panel Content
            </h2>
            <div className="bg-gray-900 border border-gray-700 rounded-xl overflow-hidden">

              {/* Header */}
              <div className={`flex items-center gap-3 p-5 border-b border-gray-700 ${node.bgClass}`}>
                {node.icon && (
                  node.icon.startsWith("http") ? (
                    <img src={node.icon} alt="" aria-hidden="true" className="w-10 h-10 object-contain" />
                  ) : (
                    <span className="text-3xl">{node.icon}</span>
                  )
                )}
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-400">
                    Component
                  </p>
                  <h3 className={`text-lg font-bold ${accentText}`}>{node.label}</h3>
                </div>
              </div>

              {/* Body */}
              <div className="p-5 space-y-6">

                {node.summary && (
                  <p className="text-sm font-medium text-gray-200 leading-relaxed italic">
                    {node.summary}
                  </p>
                )}

                {node.description && (
                  <div
                    className="text-sm text-gray-300 leading-relaxed
                      [&_p]:mb-2 [&_p:last-child]:mb-0
                      [&_ul]:list-disc [&_ul]:pl-4 [&_ul]:space-y-1
                      [&_ol]:list-decimal [&_ol]:pl-4 [&_ol]:space-y-1
                      [&_strong]:text-white [&_b]:text-white
                      [&_a]:underline [&_a]:text-current"
                    dangerouslySetInnerHTML={{ __html: node.description }}
                  />
                )}

                {node.responsibilities.length > 0 && (
                  <section>
                    <h4 className="text-xs font-semibold uppercase tracking-widest text-gray-500 mb-3">
                      Responsibilities
                    </h4>
                    <ul className="space-y-2">
                      {node.responsibilities.map((r, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-gray-300">
                          <span className={`mt-1.5 w-1.5 h-1.5 rounded-full shrink-0 ${accentBg}`} />
                          {r}
                        </li>
                      ))}
                    </ul>
                  </section>
                )}

                {node.techExamples.length > 0 && (
                  <section>
                    <h4 className="text-xs font-semibold uppercase tracking-widest text-gray-500 mb-3">
                      Common Tools & Vendors
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {node.techExamples.map((tech) => (
                        <span key={tech}
                          className="px-2.5 py-1 rounded-full text-xs font-medium bg-gray-800 text-gray-300 border border-gray-600">
                          {tech}
                        </span>
                      ))}
                    </div>
                  </section>
                )}

                {(node.learnMoreLinks?.length || node.learnMoreUrl) && (
                  <section>
                    <h4 className="text-xs font-semibold uppercase tracking-widest text-gray-500 mb-3">
                      Learn More
                    </h4>
                    {node.learnMoreLinks?.length ? (
                      <LinkList links={node.learnMoreLinks} accent={accentText} />
                    ) : (
                      <a href={node.learnMoreUrl} target="_blank" rel="noopener noreferrer"
                        className={`flex items-center gap-2 text-sm font-medium ${accentText} hover:underline`}>
                        Learn more <ExternalLink size={13} className="shrink-0" />
                      </a>
                    )}
                  </section>
                )}

                {node.documentLinks?.length && (
                  <section>
                    <h4 className="text-xs font-semibold uppercase tracking-widest text-gray-500 mb-3">
                      Resources
                    </h4>
                    <div className="space-y-2">
                      {node.documentLinks.map((link, i) =>
                        link.href ? (
                          <a key={i} href={link.href} target={link.target ?? "_blank"} rel="noopener noreferrer"
                            className="flex items-center gap-2 text-sm text-gray-300 hover:text-white transition-colors">
                            <FileText size={13} className="shrink-0 text-gray-500" />
                            {link.text || link.href}
                          </a>
                        ) : null
                      )}
                    </div>
                  </section>
                )}

                {embedUrl && (
                  <section>
                    <h4 className="text-xs font-semibold uppercase tracking-widest text-gray-500 mb-3">
                      Featured Video
                    </h4>
                    <div className="rounded-lg overflow-hidden aspect-video bg-black">
                      <iframe src={embedUrl} className="w-full h-full"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen title={`Video: ${node.label}`} />
                    </div>
                  </section>
                )}

                {/* Empty state */}
                {!node.summary && !node.description && node.responsibilities.length === 0 &&
                  node.techExamples.length === 0 && (
                  <p className="text-sm text-gray-500 italic">
                    No content yet — fill in the fields in the CMS editor to see them here.
                  </p>
                )}

              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
