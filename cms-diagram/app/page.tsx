"use client";

import { useState, useEffect } from "react";
import { layers } from "@/data/nodes";
import type { DiagramNode } from "@/data/nodes";
import DiagramLayer from "@/components/DiagramLayer";
import Connector from "@/components/Connector";
import SidePanel from "@/components/SidePanel";

export default function Home() {
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
    <div className="flex min-h-screen">
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
            Composable CMS Architecture
          </h1>
          <p className="mt-2 text-sm text-gray-400">
            Click any component to explore its role in the stack
          </p>
        </header>

        {/* Diagram */}
        <div className="flex flex-col items-center w-full max-w-2xl">
          {layers.map((layer, i) => (
            <div key={layer.id} className="flex flex-col items-center w-full">
              <DiagramLayer
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
  );
}
