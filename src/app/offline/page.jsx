import React from "react";
import OfflineClient from "./OfflineClient";

export const metadata = {
  title: "Offline Mode | Bits & Tools",
  description:
    "Offline fallback mode for Bits & Tools. All 55 in-browser utilities operate client-side with zero server dependencies.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function OfflinePage() {
  return <OfflineClient />;
}
