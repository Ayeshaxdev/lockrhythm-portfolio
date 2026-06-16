"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// ── Scramble characters pool ───────────────────────────────────────────────
const CHARS = "!<>-_\\/[]{}—=+*^?#@$%&█▓▒░│┼╬Ω∆∑≈";

function scrambleTo(
  el: HTMLElement,
  finalText: string,
  duration: number,
  onComplete?: () => void
) {
  const totalFrames = Math.round(duration * 60);
  let frame = 0;
  const chars = finalText.split("");

  const tick = () => {
    const progress = frame / totalFrames;
    const output = chars.map((char, i) => {
      if (char === " ") return " ";
      const threshold = (i / chars.length) * 0.85;
      if (progress >= threshold + 0.08) {
        return `<span style="color:#E8EDF5">${char}</span>`;
      } else if (progress >= threshold) {
        const r = CHARS[Math.floor(Math.random() * CHARS.length)];
        return `<span style="color:#3A9BD5;opacity:0.9">${r}</span>`;
      } else {
        const r = CHARS[Math.floor(Math.random() * CHARS.length)];
        return `<span style="color:#1B3A4A;opacity:0.35">${r}</span>`;
      }
    });

    el.innerHTML = output.join("");
    frame++;

    if (frame <= totalFrames) {
      requestAnimationFrame(tick);
    } else {
      el.innerHTML = `<span style="color:#E8EDF5">${finalText}</span>`;
      onComplete?.();
    }
  };
  requestAnimationFrame(tick);
}

// ── Pillars ────────────────────────────────────────────────────────────────
const pillars = [
  {
    glyph: "◈",
    name: "Precision",
    desc: "Every pixel, every query, every state transition is intentional. We engineer with zero tolerance for technical debt.",
  },
  {
    glyph: "⬡",
    name: "Scale",
    desc: "Systems designed to handle ten users and ten million — with the same architecture from day one.",
  },
  {
    glyph: "△",
    name: "Intent",
    desc: "We don't ship features. We ship outcomes. Strategy informs every line of code we write.",
  },
];

function PillarCard({ pillar }: { pillar: typeof pillars[0] }) {
  const cardRef = useRef<HTMLDivElement>(null);
  
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    cardRef.current.style.setProperty("--mouse-x", `${x}px`);
    cardRef.current.style.setProperty("--mouse-y", `${y}px`);
  };

  return (
    <div data-pillar style={{ opacity: 0, transform: "translateY(24px)" }}>
      <div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        className="pillar-card"
        style={{
          position: "relative",
          background: "linear-gradient(145deg, rgba(15,20,30,0.6) 0%, rgba(5,8,12,0.8) 100%)",
          border: "1px solid rgba(255, 255, 255, 0.05)",
          padding: "clamp(24px, 4vw, 40px) clamp(20px, 3vw, 32px)",
          borderRadius: "16px",
          overflow: "hidden",
          cursor: "default",
          transition: "all 0.5s cubic-bezier(0.2, 0.8, 0.2, 1)",
          boxShadow: "0 10px 30px -10px rgba(0,0,0,0.5)",
          height: "100%",
        }}
      >
        <div 
          className="spotlight"
          style={{
            position: "absolute",
            top: 0, left: 0, right: 0, bottom: 0,
            background: "radial-gradient(600px circle at var(--mouse-x) var(--mouse-y), rgba(58, 155, 213, 0.15), transparent 40%)",
            zIndex: 0,
            pointerEvents: "none",
            opacity: 0,
            transition: "opacity 0.5s",
          }}
        />
        <div style={{ position: "relative", zIndex: 1 }}>
          <div
            className="pillar-icon-wrap"
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              width: "clamp(48px, 6vw, 56px)",
              height: "clamp(48px, 6vw, 56px)",
              background: "rgba(58, 155, 213, 0.05)",
              border: "1px solid rgba(58, 155, 213, 0.15)",
              borderRadius: "12px",
              fontFamily: "monospace",
              fontSize: "26px",
              color: "#3A9BD5",
              marginBottom: "28px",
              lineHeight: 1,
              transition: "all 0.4s ease",
            }}
          >
            {pillar.glyph}
          </div>
          <h3
            style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontWeight: 700,
              fontSize: "clamp(20px, 2.5vw, 24px)",
              color: "#E8EDF5",
              letterSpacing: "-0.03em",
              margin: "0 0 16px",
            }}
          >
            {pillar.name}
          </h3>
          <p
            style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: "clamp(14px, 1.5vw, 15px)",
              color: "#8BAFC8",
              lineHeight: 1.7,
              margin: 0,
              opacity: 0.8,
            }}
          >
            {pillar.desc}
          </p>
        </div>
      </div>
      <style>{`
        .pillar-card:hover {
          transform: translateY(-8px) scale(1.02);
          border-color: rgba(58, 155, 213, 0.3) !important;
          box-shadow: 0 20px 40px -10px rgba(58, 155, 213, 0.2);
        }
        .pillar-card:hover .spotlight {
          opacity: 1 !important;
        }
        .pillar-card:hover .pillar-icon-wrap {
          background: rgba(58, 155, 213, 0.15) !important;
          border-color: rgba(58, 155, 213, 0.4) !important;
          box-shadow: 0 0 20px rgba(58, 155, 213, 0.3) !important;
          transform: scale(1.1) rotate(5deg);
        }
      `}</style>
    </div>
  );
}

export default function AboutSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const bodyRef = useRef<HTMLParagraphElement>(null);
  const pillarsRef = useRef<HTMLDivElement>(null);
  const dividerRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      const headline = headlineRef.current;
      const body = bodyRef.current;
      const pillars = pillarsRef.current;
      const divider = dividerRef.current;
      const label = labelRef.current;

      if (!headline || !body || !pillars || !divider || !label) return;

      gsap.set([body, divider, label], { opacity: 0, y: 24 });
      headline.innerHTML = Array(headline.dataset.text?.length || 1)
        .fill('<span style="color:#1B3A4A;opacity:0.35">█</span>')
        .join("");

      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top 60%",
        once: true,
        onEnter: () => {
          gsap.to(label, { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" });

          gsap.to(divider, {
            opacity: 1,
            y: 0,
            scaleX: 1,
            duration: 0.6,
            delay: 0.2,
            ease: "power2.out",
          });

          setTimeout(() => {
            const finalText = headline.dataset.text || "";
            scrambleTo(headline, finalText, 2.2, () => {
              gsap.to(body, {
                opacity: 1,
                y: 0,
                duration: 0.9,
                ease: "power3.out",
              });

              gsap.to(pillars.querySelectorAll("[data-pillar]"), {
                opacity: 1,
                y: 0,
                duration: 0.6,
                stagger: 0.12,
                delay: 0.2,
                ease: "power3.out",
              });
            });
          }, 400);
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="about"
      ref={sectionRef}
      style={{
        background: "#040408",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        padding: "clamp(40px, 6vh, 80px) clamp(24px, 5vw, 64px)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <span
        aria-hidden
        style={{
          position: "absolute",
          top: "48px",
          right: "64px",
          fontFamily: "monospace",
          fontSize: "11px",
          letterSpacing: "0.18em",
          color: "#1B2A3A",
          userSelect: "none",
        }}
      >
        SYS://IDENTITY.MANIFEST
      </span>

      <div style={{ maxWidth: "1100px", width: "100%", marginBottom: "24px" }}>
        <span
          ref={labelRef}
          style={{
            fontFamily: "monospace",
            fontSize: "11px",
            letterSpacing: "0.2em",
            color: "#3A9BD5",
            textTransform: "uppercase",
            display: "block",
            marginBottom: "28px",
          }}
        >
          03 / About
        </span>

        <div
          ref={dividerRef}
          style={{
            height: "1px",
            background: "linear-gradient(90deg, #3A9BD5 0%, #7B4FD4 50%, transparent 100%)",
            marginBottom: "48px",
            transformOrigin: "left center",
          }}
        />

        <h2
          ref={headlineRef}
          data-text="LOCKRHYTHM: ARCHITECTING DIGITAL IMPACT."
          style={{
            fontFamily: "'Space Grotesk', sans-serif",
            fontWeight: 700,
            fontSize: "clamp(28px, 5.5vw, 72px)",
            letterSpacing: "-0.04em",
            lineHeight: 1.04,
            margin: "0 0 48px",
            color: "#E8EDF5",
            fontVariantNumeric: "tabular-nums",
          }}
          aria-label="LOCKRHYTHM: ARCHITECTING DIGITAL IMPACT."
        />

        <p
          ref={bodyRef}
          style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: "clamp(16px, 1.6vw, 20px)",
            color: "#5A6880",
            lineHeight: 1.75,
            maxWidth: "680px",
            margin: "0 0 40px",
          }}
        >
          We fuse brutalist engineering with cinematic UI/UX. We don't just build
          software; we engineer high-performance systems that define the modern
          web.{" "}
          <span style={{ color: "#8BAFC8" }}>
            Precision, scale, and intent
          </span>
          —the architecture of a superior digital future.
        </p>

        <div
          ref={pillarsRef}
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(clamp(240px, 30vw, 280px), 1fr))",
            gap: "clamp(16px, 3vw, 24px)",
            marginTop: "24px",
          }}
        >
          {pillars.map((p) => (
            <PillarCard key={p.name} pillar={p} />
          ))}
        </div>
      </div>
    </section>
  );
}