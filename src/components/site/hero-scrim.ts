"use client";

/**
 * Tracks whether the hero film is still the thing painted behind the header.
 *
 * The header can't answer that from `scrollY` alone: the film section is
 * several viewports tall, so "scrolled past 32px" is nowhere near "off the
 * film". A one-value external store keeps the two components decoupled — the
 * hero publishes, the header subscribes via useSyncExternalStore — without
 * either reaching into the other's DOM.
 */
let covering = false;
const listeners = new Set<() => void>();

export function setHeroCovering(next: boolean) {
  if (next === covering) return;
  covering = next;
  for (const listener of listeners) listener();
}

export function subscribeHeroCovering(callback: () => void) {
  listeners.add(callback);
  return () => {
    listeners.delete(callback);
  };
}

export function getHeroCovering() {
  return covering;
}

/** Pages without a hero film never publish, so the server assumes "no film". */
export function getHeroCoveringServerSnapshot() {
  return false;
}
