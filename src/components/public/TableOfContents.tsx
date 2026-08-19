import React from 'react';
import { ListFilter, ChevronRight } from 'lucide-react';

interface TableOfContentsProps {
  headings: { id: string; text: string; level: number }[];
}

export const TableOfContents: React.FC<TableOfContentsProps> = ({ headings }) => {
  if (!headings || headings.length === 0) return null;

  const handleScrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="my-6 p-5 rounded-2xl bg-slate-50 border border-slate-200/80">
      <div className="flex items-center gap-2 mb-3 pb-2 border-b border-slate-200/60">
        <ListFilter className="w-4 h-4 text-[#0066CC]" />
        <h4 className="text-xs font-bold uppercase tracking-wider text-[#071A33]">
          Table of Contents
        </h4>
      </div>

      <nav>
        <ul className="space-y-1.5 text-xs text-slate-700">
          {headings.map(h => (
            <li
              key={h.id}
              style={{ paddingLeft: `${(h.level - 2) * 12}px` }}
              className="flex items-center gap-1.5"
            >
              <ChevronRight className="w-3 h-3 text-[#0066CC] shrink-0" />
              <button
                onClick={() => handleScrollTo(h.id)}
                className="text-left hover:text-[#0066CC] hover:underline font-medium leading-relaxed transition-colors cursor-pointer"
              >
                {h.text}
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};
