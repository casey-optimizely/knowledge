"use client";

import { X, ExternalLink } from "lucide-react";
import type { DiagramNode } from "@/data/nodes";

interface Props {
  node: DiagramNode | null;
  onClose: () => void;
}

export default function SidePanel({ node, onClose }: Props) {
  const isOpen = node !== null;

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
            {/* Header */}
            <div className={`flex items-start justify-between gap-3 p-5 border-b border-gray-700 ${node.bgClass}`}>
              <div className="flex items-center gap-3">
                <span className="text-3xl">{node.icon}</span>
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-400">
                    Component
                  </p>
                  <h2 className={`text-lg font-bold ${node.colorClass.split(" ")[1]}`}>
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

            {/* Body */}
            <div className="flex-1 overflow-y-auto p-5 space-y-6">
              {/* Description */}
              <section>
                <p className="text-sm text-gray-300 leading-relaxed">{node.description}</p>
              </section>

              {/* Responsibilities */}
              <section>
                <h3 className="text-xs font-semibold uppercase tracking-widest text-gray-500 mb-3">
                  Responsibilities
                </h3>
                <ul className="space-y-2">
                  {node.responsibilities.map((r, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-gray-300">
                      <span className={`mt-1.5 w-1.5 h-1.5 rounded-full shrink-0 ${node.colorClass.split(" ")[1].replace("text-", "bg-")}`} />
                      {r}
                    </li>
                  ))}
                </ul>
              </section>

              {/* Tech Examples */}
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

              {/* Learn More */}
              {node.learnMoreUrl && (
                <section>
                  <a
                    href={node.learnMoreUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`
                      inline-flex items-center gap-2 text-sm font-medium
                      ${node.colorClass.split(" ")[1]}
                      hover:underline
                    `}
                  >
                    Learn more
                    <ExternalLink size={13} />
                  </a>
                </section>
              )}
            </div>
          </>
        )}
      </aside>
    </>
  );
}
