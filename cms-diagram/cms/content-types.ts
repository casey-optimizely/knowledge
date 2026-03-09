import { contentType, initContentTypeRegistry } from "@optimizely/cms-sdk";

export const DiagramNodeBlock = contentType({
  key: "DiagramNodeBlock",
  baseType: "_component",
  properties: {
    label:            { type: "string" },
    icon:             { type: "string" },
    colorClass:       { type: "string" },
    bgClass:          { type: "string" },
    description:      { type: "string" },
    responsibilities: { type: "array", items: { type: "string" } },
    techExamples:     { type: "array", items: { type: "string" } },
    learnMoreUrl:     { type: "string" },
  },
});

export const DiagramLayerBlock = contentType({
  key: "DiagramLayerBlock",
  baseType: "_component",
  properties: {
    label:     { type: "string" },
    sortOrder: { type: "integer" },
    nodes:     { type: "content", allowedTypes: [DiagramNodeBlock] },
  },
});

initContentTypeRegistry([DiagramNodeBlock, DiagramLayerBlock]);
