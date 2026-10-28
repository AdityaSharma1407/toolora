"use client";

import { useEffect, useState } from "react";
import { WifiOff, Wifi, RefreshCw } from "lucide-react";

export default function PwaRegister() {
  const [offlineNotice, setOfflineNotice] = useState(false);
  const [backOnlineNotice, setBackOnlineNotice] = useState(false);
  const [updateAvailable, setUpdateAvailable] = useState(false);
  const [waitingWorker, setWaitingWorker] = useState(null);

  useEffect(() => {
    // 1. Service Worker Registration
    if (typeof window !== "undefined" && "serviceWorker" in navigator) {
      window.addEventListener("load", () => {
        navigator.serviceWorker
          .register("/sw.js")
          .then((registration) => {
            // Check if an update is waiting
            if (registration.waiting) {
              setWaitingWorker(registration.waiting);
              setUpdateAvailable(true);
            }

            // Listen for new waiting workers
            registration.addEventListener("updatefound", () => {
              const newWorker = registration.installing;
              if (newWorker) {
                newWorker.addEventListener("statechange", () => {
                  if (
                    newWorker.state === "installed" &&
                    navigator.serviceWorker.controller
                  ) {
                    setWaitingWorker(newWorker);
                    setUpdateAvailable(true);
                  }
                });
              }
            });
          })
          .catch(() => {
            // Service worker registration error silently handled
          });
      });
    }

    // 2. Online / Offline Network Listeners
    function handleOffline() {
      setOfflineNotice(true);
      setBackOnlineNotice(false);
    }

    function handleOnline() {
      setOfflineNotice(false);
      setBackOnlineNotice(true);
      const timer = setTimeout(() => {
        setBackOnlineNotice(false);
      }, 4000);
      return () => clearTimeout(timer);
    }

    window.addEventListener("offline", handleOffline);
    window.addEventListener("online", handleOnline);

    return () => {
      window.removeEventListener("offline", handleOffline);
      window.removeEventListener("online", handleOnline);
    };
  }, []);

  const handleUpdate = () => {
    if (waitingWorker) {
      waitingWorker.postMessage({ type: "SKIP_WAITING" });
    }
    window.location.reload();
  };

  return (
    <>
      {/* Offline Toast */}
      {offlineNotice && (
        <div className="fixed bottom-5 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2.5 px-4 py-2.5 bg-slate-900 text-white text-xs font-semibold rounded-2xl shadow-floating border border-white/10 animate-in fade-in slide-in-from-bottom-2">
          <WifiOff className="w-4 h-4 text-amber-400 shrink-0" />
          <span>You are offline. Cached tools will continue working!</span>
          <button
            type="button"
            onClick={() => setOfflineNotice(false)}
            className="ml-1 text-slate-400 hover:text-white text-sm leading-none"
            aria-label="Dismiss offline notice"
          >
            &times;
          </button>
        </div>
      )}

      {/* Back Online Toast */}
      {backOnlineNotice && (
        <div className="fixed bottom-5 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2.5 px-4 py-2.5 bg-emerald-700 text-white text-xs font-semibold rounded-2xl shadow-floating border border-white/10 animate-in fade-in slide-in-from-bottom-2">
          <Wifi className="w-4 h-4 text-emerald-200 shrink-0" />
          <span>Internet connection restored.</span>
        </div>
      )}

      {/* App Update Available Toast */}
      {updateAvailable && (
        <div className="fixed top-20 right-5 z-50 flex items-center gap-3 p-3.5 bg-white text-slate-900 text-xs font-medium rounded-2xl shadow-modal border border-black/[0.08] animate-in fade-in slide-in-from-top-2">
          <RefreshCw className="w-4 h-4 text-brand-600 animate-spin" />
          <div>
            <div className="font-semibold text-slate-900">New version available</div>
            <div className="text-[11px] text-slate-500">Update now for the latest features</div>
          </div>
          <button
            type="button"
            onClick={handleUpdate}
            className="px-3 py-1.5 bg-brand-600 hover:bg-brand-700 text-white rounded-lg font-semibold text-xs transition-colors shrink-0"
          >
            Update
          </button>
        </div>
      )}
    </>
  );
}
