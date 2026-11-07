"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { markIntroDone } from "@/lib/intro";
import { getLenis } from "./SmoothScroll";

export default function Preloader() {
  const rootRef = useRef<HTMLDivElement>(null);
  const countRef = useRef<HTMLSpanElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const [gone, setGone] = useState(false);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    // Only play the full intro once per tab session.
    let seen = false;
    try {
      seen = sessionStorage.getItem("lr-intro") === "1";
      sessionStorage.setItem("lr-intro", "1");
    } catch {}

    if (reduce || seen) {
      gsap.to(root, {
        opacity: 0,
        duration: reduce ? 0.01 : 0.5,
        onComplete: () => {
          setGone(true);
          markIntroDone();
        },
      });
      markIntroDone();
      return;
    }

    document.documentElement.style.overflow = "hidden";
    getLenis()?.stop();

    const counter = { v: 0 };
    const tl = gsap.timeline({
      onComplete: () => {
        document.documentElement.style.overflow = "";
        getLenis()?.start();
        setGone(true);
      },
    });

    tl.from(".pl-letter", {
      yPercent: 110,
      duration: 0.7,
      stagger: 0.035,
      ease: "power4.out",
    })
      .to(
        counter,
        {
          v: 100,
          duration: 1.5,
          ease: "power2.inOut",
          onUpdate: () => {
            const v = Math.round(counter.v);
            if (countRef.current) countRef.current.textContent = String(v).padStart(3, "0");
            if (barRef.current) barRef.current.style.transform = `scaleX(${v / 100})`;
          },
        },
        0.1
      )
      .to(".pl-letter", { yPercent: -110, duration: 0.5, stagger: 0.02, ease: "power3.in" }, "+=0.1")
      .to(".pl-meta", { opacity: 0, duration: 0.3 }, "<")
      .add(() => markIntroDone(), "-=0.1")
      .to(".pl-panel", {
        yPercent: -100,
        duration: 0.9,
        stagger: 0.08,
        ease: "power4.inOut",
      });

    return () => {
      tl.kill();
      document.documentElement.style.overflow = "";
    };
  }, []);

  if (gone) return null;

  const word = "LOCKRHYTHM";

  return (
    <div ref={rootRef} className="fixed inset-0 z-[10000] pointer-events-auto" aria-hidden>
      <div className="pl-panel absolute inset-0 bg-[#3A9BD5]" />
      <div className="pl-panel absolute inset-0 bg-[#7B4FD4]" />
      <div className="pl-panel absolute inset-0 bg-[#040408] flex flex-col items-center justify-center">
        <div className="flex overflow-hidden font-display font-bold tracking-[-0.04em] text-[#E8EDF5] text-[clamp(40px,9vw,128px)] leading-none">
          {word.split("").map((c, i) => (
            <span key={i} className="pl-letter inline-block" style={i >= 4 ? { color: "#8BAFC8" } : undefined}>
              {c}
            </span>
          ))}
        </div>
        <div className="pl-meta absolute bottom-10 left-6 right-6 md:left-12 md:right-12 flex items-end justify-between font-mono text-[11px] tracking-[0.2em] text-[#5A6880] uppercase">
          <span>Digital studio — Sahiwal, PK</span>
          <span className="text-[#E8EDF5] text-[clamp(28px,4vw,48px)] font-bold tracking-tight leading-none">
            <span ref={countRef}>000</span>
            <span className="text-[#3A9BD5] text-sm align-top ml-1">%</span>
          </span>
        </div>
        <div className="pl-meta absolute bottom-0 left-0 right-0 h-[2px] bg-white/5">
          <div
            ref={barRef}
            className="h-full origin-left bg-gradient-to-r from-[#3A9BD5] to-[#7B4FD4]"
            style={{ transform: "scaleX(0)" }}
          />
        </div>
      </div>
    </div>
  );
}
