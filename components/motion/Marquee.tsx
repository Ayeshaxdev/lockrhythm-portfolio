"use client";

import { useEffect, useRef, type ReactNode } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

/**
 * Infinite marquee whose speed and direction react to scroll velocity.
 */
export default function Marquee({
  children,
  speed = 40,
  reverse = false,
  className,
}: {
  children: ReactNode;
  speed?: number; // px per second
  reverse?: boolean;
  className?: string;
}) {
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const track = trackRef.current;
    if (!track) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let x = 0;
    let dir = reverse ? 1 : -1;
    let boost = 0;
    const half = () => track.scrollWidth / 2;

    const st = ScrollTrigger.create({
      onUpdate(self) {
        const v = self.getVelocity();
        boost = Math.min(Math.abs(v) / 120, 12);
        if (v !== 0) dir = (v > 0 ? -1 : 1) * (reverse ? -1 : 1);
      },
    });

    const tick = (_t: number, dt: number) => {
      boost *= 0.94;
      x += dir * (speed * (1 + boost)) * (dt / 1000);
      const w = half();
      if (w > 0) {
        if (x <= -w) x += w;
        if (x > 0) x -= w;
      }
      track.style.transform = `translate3d(${x}px,0,0)`;
    };
    gsap.ticker.add(tick);
    return () => {
      gsap.ticker.remove(tick);
      st.kill();
    };
  }, [speed, reverse]);

  return (
    <div className={`overflow-hidden ${className ?? ""}`}>
      <div ref={trackRef} className="flex w-max will-change-transform">
        <div className="flex shrink-0">{children}</div>
        <div className="flex shrink-0" aria-hidden>
          {children}
        </div>
      </div>
    </div>
  );
}
