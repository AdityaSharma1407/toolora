import React from "react";
import AdSlot from "@/components/ads/AdSlot";

/**
 * Reusable AdPlacement component.
 * Proxies to AdSlot with support for placement identifiers.
 */
export default function AdPlacement({
  slotId = "",
  placement = "tool-bottom",
  format = "horizontal",
  className = "",
  label = "Advertisement",
}) {
  return (
    <AdSlot
      slotId={slotId}
      placement={placement}
      format={format}
      className={className}
      label={label}
    />
  );
}
