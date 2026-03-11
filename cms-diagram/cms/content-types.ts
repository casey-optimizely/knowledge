import { contentType, initContentTypeRegistry } from "@optimizely/cms-sdk";

// ─── OptiNode ─────────────────────────────────────────────────────────────────
// Represents a single node in the diagram (e.g. DAM, Headless CMS, CDN).
// Each node drives both its card on the diagram and the flyout panel content.
// OptiNodes are standalone content items — editors create them individually,
// then a LaunchOptiDomain page assembles them into an ordered diagram.
export const OptiNode = contentType({
  key: "optiNode",
  displayName: "Opti Node",
  baseType: "_component",
  properties: {

    // ── Identity ── shown on the diagram card ──────────────────────────────────

    label: {
      type: "string",
      displayName: "Label",
      description: "Short display name shown on the diagram card and as the flyout heading",
      required: true,
      indexingType: "searchable",
      sortOrder: 10,
    },

    icon: {
      type: "string",
      displayName: "Icon",
      description: "Emoji or symbol shown on the diagram card (e.g. 🖼️, ⚡, 🔍)",
      sortOrder: 20,
    },

    layerId: {
      type: "string",
      displayName: "Stack Layer",
      description: "Which layer of the architecture this node belongs to — controls its placement and colour in the diagram",
      required: true,
      indexingType: "queryable",
      sortOrder: 30,
      enum: [
        { value: "client",      displayName: "Client" },
        { value: "edge",        displayName: "Edge / CDN" },
        { value: "frontend",    displayName: "Frontend" },
        { value: "integration", displayName: "Integration / API" },
        { value: "services",    displayName: "Core Services" },
        { value: "foundation",  displayName: "Foundation" },
      ],
    },

    // ── Flyout content ─────────────────────────────────────────────────────────

    summary: {
      type: "string",
      displayName: "Summary",
      description: "One-sentence description shown at the top of the flyout panel",
      indexingType: "searchable",
      sortOrder: 40,
    },

    description: {
      type: "richText",
      displayName: "Description",
      description: "Full description rendered in the flyout body — supports bold, lists, and links",
      indexingType: "searchable",
      sortOrder: 50,
    },

    responsibilities: {
      type: "array",
      items: { type: "string" },
      displayName: "Responsibilities",
      description: "Bullet points shown under 'Responsibilities' in the flyout",
      indexingType: "searchable",
      sortOrder: 60,
    },

    techExamples: {
      type: "array",
      items: { type: "string" },
      displayName: "Common Tools & Vendors",
      description: "Technology pills shown in the flyout (e.g. Cloudinary, Algolia, Vercel)",
      sortOrder: 70,
    },

    // ── Resources ──────────────────────────────────────────────────────────────

    learnMoreLinks: {
      type: "array",
      items: { type: "link" },
      displayName: "Learn More Links",
      description: "Labeled links (display text + URL) shown in the flyout resources section",
      sortOrder: 80,
    },

    documentLinks: {
      type: "array",
      items: { type: "link" },
      displayName: "Document Resources",
      description: "Links to PDFs, guides, or whitepapers relevant to this node",
      sortOrder: 90,
    },

    featuredVideoUrl: {
      type: "url",
      displayName: "Featured Video URL",
      description: "YouTube or Vimeo URL — rendered as an embedded player in the flyout",
      sortOrder: 100,
    },

  },
});

// ─── LaunchOptiDomain ─────────────────────────────────────────────────────────
// Root page for a domain of knowledge (e.g. "Typical Headless DXP Architecture").
// Multiple domains can exist — each assembles its own ordered set of OptiNodes
// into the diagram. The Title field drives the heading above the diagram.
// NOTE: key changed from "LaunchOpti" → "LaunchOptiDomain". When pushed to the
// CMS this creates a new content type. The old "LaunchOpti" type can be retired
// in the CMS admin once existing pages are migrated or recreated.
export const LaunchOptiDomain = contentType({
  key: "LaunchOptiDomain",
  displayName: "Launch Opti Domain",
  baseType: "_page",
  properties: {

    Title: {
      type: "string",
      displayName: "Domain Title",
      description: "Displayed as the heading above the diagram",
      required: true,
      indexingType: "searchable",
      sortOrder: 10,
    },

    description: {
      type: "string",
      displayName: "Domain Description",
      description: "Short description of what this domain of knowledge covers",
      sortOrder: 20,
    },

    // array of contentReference — each item is a pointer to a standalone OptiNode
    // content item. Editors add nodes here; the diagram renders them in this order.
    // Using contentReference (not inline content) so nodes can be created, edited,
    // and reused independently across multiple domains.
    nodes: {
      type: "array",
      items: {
        type: "contentReference",
        allowedTypes: [OptiNode],
      },
      displayName: "Diagram Nodes",
      description: "Ordered list of Opti Nodes that appear in the diagram. Add, remove, and reorder here to control the diagram layout.",
      sortOrder: 30,
    },

  },
});

// Register both types so the SDK can push them to Optimizely SaaS CMS
// and generate the correct GraphQL schema for queries.
initContentTypeRegistry([OptiNode, LaunchOptiDomain]);
