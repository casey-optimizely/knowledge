import "@/cms/content-types"; // ensure registry is initialized
import { graphClient } from "./optimizely-client";
import { layers as fallback } from "@/data/nodes";
import type { DiagramLayer } from "@/data/nodes";

const DIAGRAM_QUERY = `
  query GetDiagramLayers {
    DiagramLayerBlock(orderBy: { sortOrder: ASC }) {
      items {
        label
        sortOrder
        nodes {
          ... on DiagramNodeBlock {
            label
            icon
            colorClass
            bgClass
            description
            responsibilities
            techExamples
            learnMoreUrl
            _metadata { key }
          }
        }
        _metadata { key }
      }
    }
  }
`;

export async function fetchDiagramData(): Promise<DiagramLayer[]> {
  try {
    const result = await graphClient.request(DIAGRAM_QUERY, {});
    const items: any[] = result?.DiagramLayerBlock?.items ?? [];

    if (items.length === 0) return fallback;

    return items.map((layer: any) => ({
      id: layer._metadata?.key ?? layer.label,
      label: layer.label ?? "",
      nodes: (layer.nodes ?? []).map((node: any) => ({
        id: node._metadata?.key ?? node.label,
        label: node.label ?? "",
        icon: node.icon ?? "",
        layerId: layer._metadata?.key ?? "",
        colorClass: node.colorClass ?? "",
        bgClass: node.bgClass ?? "",
        description: node.description ?? "",
        responsibilities: node.responsibilities ?? [],
        techExamples: node.techExamples ?? [],
        learnMoreUrl: node.learnMoreUrl ?? undefined,
      })),
    }));
  } catch (err) {
    console.error("Optimizely Graph fetch failed, using static fallback:", err);
    return fallback;
  }
}
