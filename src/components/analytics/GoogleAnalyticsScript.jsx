"use client";

import React, { useState, useEffect } from "react";
import Script from "next/script";
import { siteConfig } from "@/config/site";

export default function GoogleAnalyticsScript() {
  const [consentGranted, setConsentGranted] = useState(false);

  const gaId = siteConfig.analytics?.googleAnalyticsId;
  const isEnabled = siteConfig.analytics?.enabled || Boolean(gaId && gaId.trim().length > 0);

  useEffect(() => {
    function checkConsent() {
      try {
        const stored = localStorage.getItem(siteConfig.consent.storageKey);
        if (stored) {
          const parsed = JSON.parse(stored);
          setConsentGranted(parsed.status === "accepted" || parsed.analytics === true);
        } else {
          // If no explicit choice, respect consent configuration
          setConsentGranted(!siteConfig.consent.requiredForAds);
        }
      } catch {
        setConsentGranted(false);
      }
    }

    checkConsent();

    window.addEventListener("bitsandtools-consent-change", checkConsent);
    return () => window.removeEventListener("bitsandtools-consent-change", checkConsent);
  }, []);

  if (!isEnabled || !gaId || !consentGranted) {
    return null;
  }

  return (
    <>
      <Script
        strategy="lazyOnload"
        src={`https://www.googletagmanager.com/gtag/js?id=${gaId.trim()}`}
      />
      <Script
        id="google-analytics-init"
        strategy="lazyOnload"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${gaId.trim()}', {
              page_path: window.location.pathname,
              anonymize_ip: true
            });
          `,
        }}
      />
    </>
  );
}
