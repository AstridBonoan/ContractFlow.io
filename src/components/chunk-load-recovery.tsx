"use client";

import { useEffect } from "react";

const RELOAD_KEY = "contractorflow-chunk-reload";

function shouldReload(reason: unknown): boolean {
  if (!reason) return false;
  const name = typeof reason === "object" && reason !== null && "name" in reason
    ? String((reason as { name: string }).name)
    : "";
  const message =
    typeof reason === "object" && reason !== null && "message" in reason
      ? String((reason as { message: string }).message)
      : String(reason);
  return name === "ChunkLoadError" || /loading chunk/i.test(message);
}

/** Reload once when cached HTML points at missing JS chunks after a new deploy. */
export function ChunkLoadRecovery() {
  useEffect(() => {
    const reloadOnce = () => {
      if (sessionStorage.getItem(RELOAD_KEY)) return;
      sessionStorage.setItem(RELOAD_KEY, "1");
      window.location.reload();
    };

    const onError = (event: ErrorEvent) => {
      if (shouldReload(event.error) || /loading chunk/i.test(event.message)) {
        reloadOnce();
      }
    };

    const onRejection = (event: PromiseRejectionEvent) => {
      if (shouldReload(event.reason)) reloadOnce();
    };

    window.addEventListener("error", onError);
    window.addEventListener("unhandledrejection", onRejection);

    const timer = window.setTimeout(() => {
      sessionStorage.removeItem(RELOAD_KEY);
    }, 60_000);

    return () => {
      window.removeEventListener("error", onError);
      window.removeEventListener("unhandledrejection", onRejection);
      window.clearTimeout(timer);
    };
  }, []);

  return null;
}
