"use client";

import React, { useState, useEffect } from "react";
import Script from "next/script";
import { siteConfig } from "@/config/site";

export default function AdSenseScript() {
  const [consentGranted, setConsentGranted] = useState(false);

  const monetization = siteConfig.monetization;
  const isEnabled = monetization?.enabled;
  const provider = monetization?.provider;
  const clientId = monetization?.adsense?.client;

  // Verify client ID format (must start with ca-pub-)
  const isValidClient =
    typeof clientId === "string" &&
    clientId.trim().startsWith("ca-pub-") &&
    clientId.trim().length > 10;

  useEffect(() => {
    function checkConsent() {
      try {
        const stored = localStorage.getItem(siteConfig.consent.storageKey);
        if (stored) {
          const parsed = JSON.parse(stored);
          setConsentGranted(parsed.status === "accepted" || parsed.advertising === true);
        } else {
          // If no choice made yet, respect privacy by default or allow if not strictly required
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

  // Do not load script if monetization is disabled, provider is not AdSense,
  // client ID is missing/invalid, or user has denied advertising consent
  if (!isEnabled || provider !== "adsense" || !isValidClient || !consentGranted) {
    return null;
  }

  return (
    <Script
      id="google-adsense"
      src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${clientId.trim()}`}
      strategy="afterInteractive"
      crossOrigin="anonymous"
    />
  );
}
