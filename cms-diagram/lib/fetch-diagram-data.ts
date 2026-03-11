import "@/cms/content-types"; // ensure registry is initialized
import { graphClient } from "./optimizely-client";
import { layers as fallback } from "@/data/nodes";
import type { DiagramLayer, DiagramNode } from "@/data/nodes";

// ─── Layer metadata ───────────────────────────────────────────────────────────
// Colors and display labels are derived in code from the layerId enum value.
// This keeps CSS class names out of the CMS entirely — editors choose a layer
// from a dropdown; the app decides how that maps to visual styling.

const LAYER_META: Record<string, { label: string; colorClass: string; bgClass: string }> = {
  client:      { label: "Client",            colorClass: "border-sky-400 text-sky-300",       bgClass: "bg-sky-950" },
  edge:        { label: "Edge / CDN",        colorClass: "border-indigo-400 text-indigo-300", bgClass: "bg-indigo-950" },
  frontend:    { label: "Frontend",          colorClass: "border-pink-400 text-pink-300",     bgClass: "bg-pink-950" },
  integration: { label: "Integration / API", colorClass: "border-amber-400 text-amber-300",   bgClass: "bg-amber-950" },
  services:    { label: "Core Services",     colorClass: "border-blue-400 text-blue-300",     bgClass: "bg-blue-950" },
  foundation:  { label: "Foundation",        colorClass: "border-green-400 text-green-300",   bgClass: "bg-green-950" },
};

// Controls top-to-bottom layer order in the diagram
const LAYER_ORDER = ["client", "edge", "frontend", "integration", "services", "foundation"];

// ─── Queries ──────────────────────────────────────────────────────────────────

const DIAGRAM_QUERY = `
  query GetNodes {
    optiNode {
      items {
        label
        icon { url { default } }
        layerId
        summary
        description { html }
        responsibilities
        techExamples
        learnMoreLinks { text title target url { default } }
        documentLinks  { text title target url { default } }
        featuredVideoUrl { default }
        _metadata { key }
      }
    }
  }
`;

// Updated to query LaunchOptiDomain (was LaunchOpti — key changed in content type push)
const PAGE_TITLE_QUERY = `
  query GetPageTitle {
    LaunchOptiDomain(limit: 1) {
      items {
        Title
      }
    }
  }
`;

// ─── Fetchers ─────────────────────────────────────────────────────────────────

export async function fetchPageTitle(): Promise<string> {
  try {
    const result = await graphClient.request(PAGE_TITLE_QUERY, {});
    return result?.LaunchOptiDomain?.items?.[0]?.Title ?? "";
  } catch (err) {
    console.error("fetchPageTitle failed:", err);
    return "";
  }
}

export async function fetchDiagramData(): Promise<DiagramLayer[]> {
  try {
    const result = await graphClient.request(DIAGRAM_QUERY, {});
    const items: any[] = result?.optiNode?.items ?? [];

    if (items.length === 0) return fallback;

    // Map each CMS item to a DiagramNode.
    // colorClass and bgClass are derived here from layerId — not stored in CMS.
    // description comes back as an HTML string inside `{ html }` from richText.
    // learnMoreLinks / documentLinks are arrays of { text, href, title, target }.
    const nodes: DiagramNode[] = items.map((node: any) => {
      const layerId = node.layerId ?? "services";
      const meta = LAYER_META[layerId] ?? LAYER_META.services;

      return {
        id:              node._metadata?.key ?? node.label,
        label:           node.label ?? "",
        // icon is a contentReference — Graph exposes the asset URL via ContentUrl.default.
        // Falls back to empty string (no icon shown) if not yet set in CMS.
        icon:            node.icon?.url?.default ?? "",
        layerId,
        colorClass:      meta.colorClass,
        bgClass:         meta.bgClass,
        summary:          node.summary || undefined,
        description:      node.description?.html || undefined,
        responsibilities: node.responsibilities ?? [],
        techExamples:     node.techExamples ?? [],
        // Link items from Graph: { text, title, target, url: { default } }
        // We normalise url.default → href so the UI ContentLink interface stays stable
        learnMoreLinks: node.learnMoreLinks?.length
          ? node.learnMoreLinks.map((l: any) => ({ text: l.text, title: l.title, target: l.target, href: l.url?.default }))
          : undefined,
        documentLinks: node.documentLinks?.length
          ? node.documentLinks.map((l: any)  => ({ text: l.text, title: l.title, target: l.target, href: l.url?.default }))
          : undefined,
        // featuredVideoUrl from Graph: ContentUrl object — we only need the default URL string
        featuredVideoUrl: node.featuredVideoUrl?.default || undefined,
        // backward-compat: populate learnMoreUrl from first learnMoreLink so
        // any code still referencing the old field continues to work
        learnMoreUrl: node.learnMoreLinks?.[0]?.url?.default ?? undefined,
      };
    });

    // Group nodes by their layerId, then emit layers in the fixed LAYER_ORDER.
    // Layers that have no CMS nodes are simply omitted rather than shown empty.
    const byLayer = new Map<string, DiagramNode[]>();
    for (const node of nodes) {
      if (!byLayer.has(node.layerId)) byLayer.set(node.layerId, []);
      byLayer.get(node.layerId)!.push(node);
    }

    return LAYER_ORDER
      .filter(id => byLayer.has(id))
      .map(id => ({
        id,
        label: LAYER_META[id].label,
        nodes: byLayer.get(id)!,
      }));

  } catch (err) {
    console.error("Optimizely Graph fetch failed, using static fallback:", err);
    return fallback;
  }
}
