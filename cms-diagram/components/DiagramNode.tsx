"use client";

import type { DiagramNode as DiagramNodeData } from "@/data/nodes";

interface Props {
  node: DiagramNodeData;
  isSelected: boolean;
  onSelect: (node: DiagramNodeData) => void;
}

export default function DiagramNode({ node, isSelected, onSelect }: Props) {
  return (
    <button
      onClick={() => onSelect(node)}
      className={`
        group flex flex-col items-center gap-1.5 px-4 py-3 rounded-xl border-2
        transition-all duration-200 cursor-pointer select-none
        ${node.bgClass} ${node.colorClass}
        ${isSelected
          ? "scale-105 shadow-lg shadow-black/50 ring-2 ring-white/30"
          : "hover:scale-105 hover:shadow-md hover:shadow-black/40 border-opacity-60 hover:border-opacity-100"
        }
        min-w-[120px] max-w-[160px]
      `}
      aria-pressed={isSelected}
      aria-label={`View details for ${node.label}`}
    >
      <span className="text-2xl leading-none">{node.icon}</span>
      <span className="text-xs font-semibold text-center leading-tight text-gray-100">
        {node.label}
      </span>
    </button>
  );
}
