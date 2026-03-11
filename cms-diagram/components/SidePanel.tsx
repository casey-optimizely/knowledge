"use client";

import { X, ExternalLink, FileText } from "lucide-react";
import type { DiagramNode, ContentLink } from "@/data/nodes";

interface Props {
  node: DiagramNode | null;
  onClose: () => void;
}

// Convert a YouTube or Vimeo watch URL into an embeddable iframe src.
// Returns null for unrecognised URLs so we simply don't render the player.
function getEmbedUrl(url: string): string | null {
  try {
    const u = new URL(url);
    // youtube.com/watch?v=ID
    if (u.hostname.includes("youtube.com")) {
      const id = u.searchParams.get("v");
      return id ? `https://www.youtube.com/embed/${id}` : null;
    }
    // youtu.be/ID
    if (u.hostname === "youtu.be") {
      const id = u.pathname.slice(1);
      return id ? `https://www.youtube.com/embed/${id}` : null;
    }
    // vimeo.com/ID
    if (u.hostname.includes("vimeo.com")) {
      const id = u.pathname.replace(/^\//, "");
      return id ? `https://player.vimeo.com/video/${id}` : null;
    }
    return null;
  } catch {
    return null;
  }
}

export default function SidePanel({ node, onClose }: Props) {
  const isOpen = node !== null;

  // Derive accent colours from the node's colorClass (e.g. "border-sky-400 text-sky-300")
  const accentText = node?.colorClass?.split(" ")[1] ?? "text-white";
  const accentBg   = accentText.replace("text-", "bg-");

  // Pre-compute embed URL so JSX stays clean
  const embedUrl = node?.featuredVideoUrl ? getEmbedUrl(node.featuredVideoUrl) : null;

  // Helper: render a list of ContentLink items
  function LinkList({ links, accent }: { links: ContentLink[]; accent: string }) {
    return (
      <div className="space-y-2">
        {links.map((link, i) =>
          link.href ? (
            <a
              key={i}
              href={link.href}
              target={link.target ?? "_blank"}
              rel="noopener noreferrer"
              className={`flex items-center gap-2 text-sm font-medium ${accent} hover:underline`}
            >
              {link.text || link.href}
              <ExternalLink size={13} className="shrink-0" />
            </a>
          ) : null
        )}
      </div>
    );
  }

  return (
    <>
      {/* Backdrop (mobile only) */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Panel */}
      <aside
        className={`
          fixed top-0 right-0 h-full w-full max-w-sm z-40
          bg-gray-900 border-l border-gray-700
          transform transition-transform duration-300 ease-in-out
          flex flex-col overflow-hidden
          ${isOpen ? "translate-x-0" : "translate-x-full"}
        `}
        aria-label="Component details"
        role="complementary"
      >
        {node && (
          <>
            {/* ── Header ── */}
            <div className={`flex items-start justify-between gap-3 p-5 border-b border-gray-700 ${node.bgClass}`}>
              <div className="flex items-center gap-3">
                {node.icon && (
                  node.icon.startsWith("http") ? (
                    <img
                      src={node.icon}
                      alt=""
                      aria-hidden="true"
                      className="w-10 h-10 object-contain"
                    />
                  ) : (
                    <span className="text-3xl">{node.icon}</span>
                  )
                )}
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-400">
                    Component
                  </p>
                  <h2 className={`text-lg font-bold ${accentText}`}>
                    {node.label}
                  </h2>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-colors mt-0.5 shrink-0"
                aria-label="Close panel"
              >
                <X size={18} />
              </button>
            </div>

            {/* ── Body ── */}
            <div className="flex-1 overflow-y-auto p-5 space-y-6">

              {/* Summary — short one-liner from CMS, shown above the main description */}
              {node.summary && (
                <section>
                  <p className="text-sm font-medium text-gray-200 leading-relaxed italic">
                    {node.summary}
                  </p>
                </section>
              )}

              {/* Description — plain string (static fallback) or HTML (CMS richText).
                  dangerouslySetInnerHTML is safe here: content comes from trusted CMS
                  editors, not from user input. Tailwind arbitrary variants add basic
                  prose styling without needing the @tailwindcss/typography plugin. */}
              {node.description && (
                <section
                  className="text-sm text-gray-300 leading-relaxed
                    [&_p]:mb-2 [&_p:last-child]:mb-0
                    [&_ul]:list-disc [&_ul]:pl-4 [&_ul]:space-y-1
                    [&_ol]:list-decimal [&_ol]:pl-4 [&_ol]:space-y-1
                    [&_strong]:text-white [&_b]:text-white
                    [&_a]:underline [&_a]:text-current"
                  dangerouslySetInnerHTML={{ __html: node.description }}
                />
              )}

              {/* Responsibilities */}
              {Array.isArray(node.responsibilities) && node.responsibilities.length > 0 && (
                <section>
                  <h3 className="text-xs font-semibold uppercase tracking-widest text-gray-500 mb-3">
                    Responsibilities
                  </h3>
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

              {/* Common Tools & Vendors */}
              {Array.isArray(node.techExamples) && node.techExamples.length > 0 && (
                <section>
                  <h3 className="text-xs font-semibold uppercase tracking-widest text-gray-500 mb-3">
                    Common Tools & Vendors
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {node.techExamples.map((tech) => (
                      <span
                        key={tech}
                        className="px-2.5 py-1 rounded-full text-xs font-medium bg-gray-800 text-gray-300 border border-gray-600"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </section>
              )}

              {/* Learn More Links — prefers structured CMS learnMoreLinks array;
                  falls back to legacy learnMoreUrl for static fallback data */}
              {(node.learnMoreLinks?.length || node.learnMoreUrl) && (
                <section>
                  <h3 className="text-xs font-semibold uppercase tracking-widest text-gray-500 mb-3">
                    Learn More
                  </h3>
                  {node.learnMoreLinks?.length ? (
                    <LinkList links={node.learnMoreLinks} accent={accentText} />
                  ) : (
                    <a
                      href={node.learnMoreUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`flex items-center gap-2 text-sm font-medium ${accentText} hover:underline`}
                    >
                      Learn more
                      <ExternalLink size={13} className="shrink-0" />
                    </a>
                  )}
                </section>
              )}

              {/* Document Resources — PDF / guide links from CMS */}
              {node.documentLinks?.length && (
                <section>
                  <h3 className="text-xs font-semibold uppercase tracking-widest text-gray-500 mb-3">
                    Resources
                  </h3>
                  <div className="space-y-2">
                    {node.documentLinks.map((link, i) =>
                      link.href ? (
                        <a
                          key={i}
                          href={link.href}
                          target={link.target ?? "_blank"}
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 text-sm text-gray-300 hover:text-white transition-colors"
                        >
                          <FileText size={13} className="shrink-0 text-gray-500" />
                          {link.text || link.href}
                        </a>
                      ) : null
                    )}
                  </div>
                </section>
              )}

              {/* Featured Video — YouTube or Vimeo embed.
                  getEmbedUrl converts the watch URL to an embeddable src;
                  returns null for unrecognised formats so no broken iframe renders. */}
              {embedUrl && (
                <section>
                  <h3 className="text-xs font-semibold uppercase tracking-widest text-gray-500 mb-3">
                    Featured Video
                  </h3>
                  <div className="rounded-lg overflow-hidden aspect-video bg-black">
                    <iframe
                      src={embedUrl}
                      className="w-full h-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      title={`Video: ${node.label}`}
                    />
                  </div>
                </section>
              )}

            </div>
          </>
        )}
      </aside>
    </>
  );
}
