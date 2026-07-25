"use client";

import { useSyncExternalStore } from "react";

function subscribeScenePreference(callback: () => void) {
  const mqDesktop = window.matchMedia("(min-width: 1024px)");
  const mqMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  mqDesktop.addEventListener("change", callback);
  mqMotion.addEventListener("change", callback);
  return () => {
    mqDesktop.removeEventListener("change", callback);
    mqMotion.removeEventListener("change", callback);
  };
}

function getScenePreferenceSnapshot() {
  return (
    window.matchMedia("(min-width: 1024px)").matches &&
    !window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

function getScenePreferenceServerSnapshot() {
  return false;
}

export function use3DSceneEnabled() {
  return useSyncExternalStore(
    subscribeScenePreference,
    getScenePreferenceSnapshot,
    getScenePreferenceServerSnapshot,
  );
}
