"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import gsap from "gsap";

/**
 * Desktop-only cursor follower. Any element with `data-cursor="Label"` grows the
 * ring and shows the label; `data-cursor=""` just grows it (links, buttons).
 */
export default function Cursor() {
  const ringRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);
  const [label, setLabel] = useState("");
  const enabled = useSyncExternalStore(
    () => () => {},
    () =>
      window.matchMedia("(pointer: fine)").matches &&
      !window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    () => false
  );

  useEffect(() => {
    if (!enabled) return;
    const ring = ringRef.current;
    const dot = dotRef.current;
    if (!ring || !dot) return;

    document.documentElement.classList.add("has-custom-cursor");

    const rx = gsap.quickTo(ring, "x", { duration: 0.45, ease: "power3.out" });
    const ry = gsap.quickTo(ring, "y", { duration: 0.45, ease: "power3.out" });
    const dx = gsap.quickTo(dot, "x", { duration: 0.08, ease: "power2.out" });
    const dy = gsap.quickTo(dot, "y", { duration: 0.08, ease: "power2.out" });

    let visible = false;
    const move = (e: PointerEvent) => {
      if (!visible) {
        visible = true;
        gsap.to([ring, dot], { opacity: 1, duration: 0.3 });
      }
      rx(e.clientX);
      ry(e.clientY);
      dx(e.clientX);
      dy(e.clientY);
    };

    const over = (e: PointerEvent) => {
      const target = (e.target as HTMLElement).closest<HTMLElement>(
        "[data-cursor], a, button, [role='button'], summary, label"
      );
      if (!target) {
        ring.dataset.state = "";
        setLabel("");
        return;
      }
      const l = target.dataset.cursor ?? "";
      ring.dataset.state = l ? "label" : "hover";
      setLabel(l);
    };

    const leave = () => {
      visible = false;
      gsap.to([ring, dot], { opacity: 0, duration: 0.3 });
    };
    const down = () => gsap.to(ring, { scale: 0.85, duration: 0.15 });
    const up = () => gsap.to(ring, { scale: 1, duration: 0.3, ease: "back.out(3)" });

    window.addEventListener("pointermove", move);
    window.addEventListener("pointerover", over);
    document.addEventListener("pointerleave", leave);
    window.addEventListener("pointerdown", down);
    window.addEventListener("pointerup", up);

    return () => {
      document.documentElement.classList.remove("has-custom-cursor");
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerover", over);
      document.removeEventListener("pointerleave", leave);
      window.removeEventListener("pointerdown", down);
      window.removeEventListener("pointerup", up);
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <>
      <div ref={ringRef} className="lr-cursor-ring" aria-hidden>
        <span className="lr-cursor-label">{label}</span>
      </div>
      <div ref={dotRef} className="lr-cursor-dot" aria-hidden />
    </>
  );
}
