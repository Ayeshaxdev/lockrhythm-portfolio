"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

let lenisInstance: Lenis | null = null;

/** Access the shared Lenis instance (null when reduced motion / not mounted). */
export const getLenis = () => lenisInstance;

/** Smoothly scroll to a selector / element, falling back to native scroll. */
export function scrollToTarget(target: string | HTMLElement, offset = 0) {
  const el = typeof target === "string" ? document.querySelector<HTMLElement>(target) : target;
  if (!el) return;
  if (lenisInstance) {
    lenisInstance.scrollTo(el, { offset, duration: 1.4 });
  } else {
    const top = el.getBoundingClientRect().top + window.scrollY + offset;
    window.scrollTo({ top, behavior: "smooth" });
  }
}

export default function SmoothScroll() {
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // Same-page anchor links ("#id" or "/#id") get smooth-scrolled.
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey) return;
      const a = (e.target as HTMLElement).closest("a");
      if (!a) return;
      const href = a.getAttribute("href") || "";
      const match = href.match(/^\/?#([\w-]+)$/);
      if (!match || window.location.pathname !== "/") return;
      const el = document.getElementById(match[1]);
      if (!el) return;
      e.preventDefault();
      scrollToTarget(el);
      history.replaceState(null, "", `#${match[1]}`);
    };
    document.addEventListener("click", onClick);

    if (reduce) {
      return () => document.removeEventListener("click", onClick);
    }

    const lenis = new Lenis({
      duration: 1.15,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });
    lenisInstance = lenis;

    lenis.on("scroll", ScrollTrigger.update);
    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    // Honour an initial hash once layout (and pins) have settled.
    if (window.location.hash) {
      const id = window.location.hash.slice(1);
      setTimeout(() => {
        const el = document.getElementById(id);
        if (el) lenis.scrollTo(el, { immediate: true });
      }, 400);
    }

    return () => {
      document.removeEventListener("click", onClick);
      gsap.ticker.remove(tick);
      lenis.destroy();
      lenisInstance = null;
    };
  }, []);

  return null;
}
