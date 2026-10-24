import React from "react";
import ToolCard from "./ToolCard";
import DynamicIcon from "./DynamicIcon";

export default function CategorySection({
  category,
  tools,
  id,
  className = "",
}) {
  if (!tools || tools.length === 0) return null;

  return (
    <section id={id} className={`scroll-mt-24 ${className}`}>
      <div className="flex items-center gap-3 mb-2">
        <div className="p-2 rounded-lg bg-brand-50 text-brand-600">
          <DynamicIcon name={category.icon} className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-xl md:text-2xl font-bold text-slate-900 tracking-tight">
            {category.name}
          </h2>
        </div>
      </div>
      <p className="text-sm text-slate-600 max-w-2xl mb-6 ml-1">
        {category.description}
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {tools.map((tool) => (
          <ToolCard key={tool.id} tool={tool} />
        ))}
      </div>
    </section>
  );
}
