import "@/cms/content-types"; // ensure registry is initialized
import { graphClient } from "./optimizely-client";
import { GraphClient } from "@optimizely/cms-sdk";
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

// ─── Shared field fragment (reused in both queries) ───────────────────────────

const NODE_FIELDS = `
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
`;

// ─── Shared mapping helper ────────────────────────────────────────────────────

export function mapNodeItem(node: any): DiagramNode {
  const layerId = node.layerId ?? "services";
  const meta = LAYER_META[layerId] ?? LAYER_META.services;
  return {
    id:               node._metadata?.key ?? node.label,
    label:            node.label ?? "",
    icon:             node.icon?.url?.default ?? "",
    layerId,
    colorClass:       meta.colorClass,
    bgClass:          meta.bgClass,
    summary:          node.summary || undefined,
    description:      node.description?.html || undefined,
    responsibilities: node.responsibilities ?? [],
    techExamples:     node.techExamples ?? [],
    learnMoreLinks: node.learnMoreLinks?.length
      ? node.learnMoreLinks.map((l: any) => ({ text: l.text, title: l.title, target: l.target, href: l.url?.default }))
      : undefined,
    documentLinks: node.documentLinks?.length
      ? node.documentLinks.map((l: any) => ({ text: l.text, title: l.title, target: l.target, href: l.url?.default }))
      : undefined,
    featuredVideoUrl: node.featuredVideoUrl?.default || undefined,
    learnMoreUrl:     node.learnMoreLinks?.[0]?.url?.default ?? undefined,
  };
}

// ─── Queries ──────────────────────────────────────────────────────────────────

const DIAGRAM_QUERY = `
  query GetNodes {
    optiNode {
      items { ${NODE_FIELDS} }
    }
  }
`;

// Single-node query used by the preview page — filters by _metadata.key.
// When a preview_token is present we send it to the Graph endpoint so that
// unpublished (draft) content is included in the response.
const NODE_BY_KEY_QUERY = `
  query GetNodeByKey($key: String!) {
    optiNode(where: { _metadata: { key: { eq: $key } } }) {
      items { ${NODE_FIELDS} }
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

    const nodes: DiagramNode[] = items.map(mapNodeItem);

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

// ─── Preview fetcher ──────────────────────────────────────────────────────────
// Used by /preview page. When the CMS calls our preview URL it passes a
// preview_token that unlocks draft/unpublished content in Graph.
// We build a one-off GraphClient with the token appended to the endpoint so
// Graph returns the current saved (possibly unpublished) state of the item.
export async function fetchNodePreview(
  key: string,
  previewToken?: string,
): Promise<DiagramNode | null> {
  try {
    // If a preview token is present, append it to the Graph URL so Graph returns
    // draft content. Otherwise fall back to the shared published-content client.
    const client = previewToken
      ? new GraphClient(process.env.OPTIMIZELY_GRAPH_SINGLE_KEY!, {
          graphUrl: `${process.env.OPTIMIZELY_GRAPH_GATEWAY}/content/v2?preview_token=${previewToken}`,
        })
      : graphClient;

    const result = await client.request(NODE_BY_KEY_QUERY, { key });
    const item = result?.optiNode?.items?.[0];
    return item ? mapNodeItem(item) : null;
  } catch (err) {
    console.error("fetchNodePreview failed:", err);
    return null;
  }
}
