"use client";

import type { DiagramLayer as LayerType, DiagramNode } from "@/data/nodes";
import DiagramNodeCard from "./DiagramNode";

interface Props {
  layer: LayerType;
  selectedId: string | null;
  onSelect: (node: DiagramNode) => void;
}

export default function DiagramLayer({ layer, selectedId, onSelect }: Props) {
  return (
    <div className="flex flex-col items-center gap-2 w-full">
      {/* Layer label */}
      <span className="text-[10px] font-semibold uppercase tracking-widest text-gray-500">
        {layer.label}
      </span>

      {/* Nodes row */}
      <div className="flex flex-wrap justify-center gap-3">
        {layer.nodes.map((node) => (
          <DiagramNodeCard
            key={node.id}
            node={node}
            isSelected={selectedId === node.id}
            onSelect={onSelect}
          />
        ))}
      </div>
    </div>
  );
}
