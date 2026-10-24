import React from "react";
import * as Icons from "lucide-react";

/**
 * Renders a Lucide icon by string name with fallback to Wrench.
 */
export default function DynamicIcon({ name, className = "w-5 h-5", ...props }) {
  const IconComponent = Icons[name] || Icons.Wrench;
  return <IconComponent className={className} aria-hidden="true" {...props} />;
}
