"use client";

import React, { useEffect, useRef, useState } from "react";
import { siteConfig } from "@/config/site";

export default function AdSlot({
  slotId,
  placement,
  format = "auto",
  responsive = true,
  enabled = true,
  className = "",
  label = "Advertisement",
}) {
  const adRef = useRef(null);
  const pushedRef = useRef(false);
  const [consentGranted, setConsentGranted] = useState(false);

  const monetization = siteConfig.monetization;
  const isGloballyEnabled = monetization?.enabled;
  const isPlacementEnabled = placement
    ? monetization?.placements?.[placement] ?? true
    : true;
  const isAdActive = isGloballyEnabled && isPlacementEnabled && enabled;

  const clientId = monetization?.adsense?.client;
  // Resolve effective slot ID from explicit prop or central slot registry
  const effectiveSlotId =
    slotId || (placement ? monetization?.adsense?.slots?.[placement] : "");

  const isConfigValid =
    typeof clientId === "string" &&
    clientId.startsWith("ca-pub-") &&
    Boolean(effectiveSlotId);

  // Check consent state
  useEffect(() => {
    function checkConsent() {
      try {
        const stored = localStorage.getItem(siteConfig.consent.storageKey);
        if (stored) {
          const parsed = JSON.parse(stored);
          setConsentGranted(parsed.status === "accepted" || parsed.advertising === true);
        } else {
          setConsentGranted(!siteConfig.consent.requiredForAds);
        }
      } catch {
        setConsentGranted(false);
      }
    }

    checkConsent();

    window.addEventListener("toolora-consent-change", checkConsent);
    return () => window.removeEventListener("toolora-consent-change", checkConsent);
  }, []);

  // Safe push to adsbygoogle on mount only
  useEffect(() => {
    if (isAdActive && isConfigValid && consentGranted && !pushedRef.current) {
      try {
        if (typeof window !== "undefined") {
          window.adsbygoogle = window.adsbygoogle || [];
          window.adsbygoogle.push({});
          pushedRef.current = true;
        }
      } catch (err) {
        // Silently handle if AdSense is blocked by client ad-blocker
        console.debug("AdSlot: adsbygoogle push prevented or unavailable.");
      }
    }
  }, [isAdActive, isConfigValid, consentGranted]);

  // When debug mode is active in development, display layout wireframe
  if (monetization?.debug) {
    return (
      <aside
        aria-label={`${label} wireframe`}
        className={`my-8 flex flex-col items-center justify-center p-4 bg-slate-50 border border-dashed border-slate-300 rounded-xl text-center max-w-4xl mx-auto ${className}`}
      >
        <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 mb-1">
          {label} (Developer Preview)
        </span>
        <div className="text-xs text-slate-500 font-mono">
          Placement: <strong className="text-slate-800">{placement || "unassigned"}</strong> | Slot ID:{" "}
          <strong className="text-slate-800">{effectiveSlotId || "none"}</strong>
        </div>
        <div className="text-[11px] text-slate-400 mt-1">
          Ads are disabled by default. Set NEXT_PUBLIC_ADS_ENABLED=true in production.
        </div>
      </aside>
    );
  }

  // If ads are disabled, configuration is incomplete, or consent denied: render nothing
  if (!isAdActive || !isConfigValid || !consentGranted) {
    return null;
  }

  // Format height reservation to prevent Cumulative Layout Shift (CLS)
  const formatHeightClasses = {
    horizontal: "min-h-[90px]",
    rectangle: "min-h-[250px]",
    responsive: "min-h-[100px]",
    auto: "min-h-[100px]",
  };

  return (
    <aside
      aria-label={label}
      className={`my-8 flex flex-col items-center justify-center w-full max-w-4xl mx-auto overflow-hidden ${className}`}
    >
      <div className="w-full flex items-center justify-center mb-1.5">
        <span className="text-[10px] uppercase font-semibold text-slate-400 tracking-wider">
          {label}
        </span>
      </div>

      <div
        ref={adRef}
        className={`w-full flex items-center justify-center bg-slate-50/50 rounded-lg ${
          formatHeightClasses[format] || formatHeightClasses.auto
        }`}
      >
        <ins
          className="adsbygoogle"
          style={{ display: "block", width: "100%", textAlign: "center" }}
          data-ad-client={clientId}
          data-ad-slot={effectiveSlotId}
          data-ad-format={format}
          data-full-width-responsive={responsive ? "true" : "false"}
        />
      </div>
    </aside>
  );
}
