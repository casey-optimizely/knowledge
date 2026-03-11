"use client";

import { useState, useEffect } from "react";
import { Eye } from "lucide-react";
import type { DiagramLayer as DiagramLayerData, DiagramNode } from "@/data/nodes";
import DiagramLayerRow from "@/components/DiagramLayer";
import Connector from "@/components/Connector";
import SidePanel from "@/components/SidePanel";

interface Props {
  layers: DiagramLayerData[];
  title?: string;
  isDraft?: boolean;
}

export default function DiagramApp({ layers, title, isDraft = false }: Props) {
  const [selectedNode, setSelectedNode] = useState<DiagramNode | null>(null);

  // Close panel on Escape key
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setSelectedNode(null);
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  function handleSelect(node: DiagramNode) {
    // Toggle off if clicking the same node again
    setSelectedNode((prev) => (prev?.id === node.id ? null : node));
  }

  return (
    <div className="flex flex-col min-h-screen">

      {/* Draft mode banner — only visible when previewing unpublished content */}
      {isDraft && (
        <div className="flex items-center justify-between px-5 py-2.5 text-xs font-medium
          bg-amber-500/20 border-b border-amber-500/40 text-amber-300">
          <div className="flex items-center gap-2">
            <Eye size={13} />
            DRAFT PREVIEW — showing unpublished content
          </div>
          <a href="/api/preview/disable" className="hover:text-white transition-colors">
            Exit preview →
          </a>
        </div>
      )}

      <div className="flex flex-1">
        {/* Main diagram area — shifts left when panel is open on desktop */}
        <main
          className={`
            flex-1 flex flex-col items-center py-12 px-6
            transition-[margin] duration-300
            ${selectedNode ? "md:mr-96" : ""}
          `}
        >
          {/* Header */}
          <header className="mb-10 text-center">
            <h1 className="text-2xl font-bold text-white tracking-tight">
              {title || "Composable CMS Architecture"}
            </h1>
            <p className="mt-2 text-sm text-gray-400">
              Click any component to explore its role in the stack
            </p>
          </header>

          {/* Diagram */}
          <div className="flex flex-col items-center w-full max-w-2xl">
            {layers.map((layer, i) => (
              <div key={layer.id} className="flex flex-col items-center w-full">
                <DiagramLayerRow
                  layer={layer}
                  selectedId={selectedNode?.id ?? null}
                  onSelect={handleSelect}
                />
                {i < layers.length - 1 && <Connector />}
              </div>
            ))}
          </div>

          {/* Footer hint */}
          <p className="mt-12 text-xs text-gray-600 text-center">
            {selectedNode
              ? `Viewing: ${selectedNode.label} — click again or press Esc to close`
              : "Select a component above to explore its responsibilities and tooling"}
          </p>
        </main>

        {/* Sliding side panel */}
        <SidePanel node={selectedNode} onClose={() => setSelectedNode(null)} />
      </div>
    </div>
  );
}
