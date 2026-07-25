"use client";

import { useEffect, type RefObject } from "react";

type ScrubTick = (progress: number, scrubbing: boolean) => void;

/**
 * Drives a callback with a section's scroll progress (0→1) on every animation
 * frame while that section is on screen.
 *
 * Progress comes from the element's *rendered* height, never from a media
 * query: a section that is exactly one viewport tall has nowhere to travel, so
 * `scrubbing` reports false and progress pins to 0. That lets CSS alone decide
 * which viewports get the tall pinned treatment (see `.scrub-*` in globals.css)
 * while the markup — and therefore the server HTML — stays identical everywhere.
 *
 * The callback is expected to write to the DOM directly. It runs up to 60×/s,
 * so routing it through React state would re-render the whole section each frame.
 */
export function useScrollScrub(ref: RefObject<HTMLElement | null>, onTick: ScrubTick) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let frame = 0;
    let visible = false;

    // The pinned panel is the section's only child. Its `top` is the scroll
    // position at which it latches, and is read here rather than per frame
    // because getComputedStyle forces style resolution.
    let panel = el.firstElementChild as HTMLElement | null;
    let stickyTop = 0;

    const measure = () => {
      panel = el.firstElementChild as HTMLElement | null;
      stickyTop = panel ? parseFloat(getComputedStyle(panel).top) || 0 : 0;
    };
    measure();

    const tick = () => {
      const panelHeight = panel?.offsetHeight ?? window.innerHeight;
      const travel = el.offsetHeight - panelHeight;

      // A collapsed section is one viewport tall, leaving only the few pixels
      // its panel is inset by. Anything under a quarter-viewport of travel is
      // not a scroll narrative, so consumers fall back to their own pacing.
      if (travel < window.innerHeight * 0.25) {
        onTick(0, false);
      } else {
        const progress = Math.min(
          Math.max((stickyTop - el.getBoundingClientRect().top) / travel, 0),
          1,
        );
        onTick(progress, true);
      }

      frame = requestAnimationFrame(tick);
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting === visible) return;
        visible = entry.isIntersecting;
        if (visible) {
          frame = requestAnimationFrame(tick);
        } else {
          cancelAnimationFrame(frame);
        }
      },
      { rootMargin: "10% 0px" },
    );

    observer.observe(el);
    window.addEventListener("resize", measure);

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", measure);
      cancelAnimationFrame(frame);
    };
  }, [ref, onTick]);
}

/** Progress of `value` through the [start, end] window, clamped to 0→1. */
export function span(value: number, start: number, end: number) {
  if (end <= start) return value >= end ? 1 : 0;
  return Math.min(Math.max((value - start) / (end - start), 0), 1);
}

/** Fades in over `fade`, holds, then fades out before `end`. */
export function window01(value: number, start: number, end: number, fade = 0.06) {
  return Math.min(span(value, start, start + fade), 1 - span(value, end - fade, end));
}
