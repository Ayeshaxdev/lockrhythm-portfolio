"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const services = [
  {
    number: "01",
    title: "Web\nEngineering",
    desc: "End-to-end web systems engineered for performance at scale. From API architecture to pixel-perfect frontends, we ship products that hold up under pressure.",
    accent: "#3A9BD5",
  },
  {
    number: "02",
    title: "Mobile App\nDevelopment",
    desc: "Native mobile applications built for speed, reliability, and the brutally demanding standards of real users. No cross-platform shortcuts.",
    accent: "#5A7FD4",
  },
  {
    number: "03",
    title: "UI/UX\nDesign",
    desc: "Interfaces that feel like art but function like machines. We design for conversion first, aesthetics second — and still make them unforgettable.",
    accent: "#7B4FD4",
  },
  {
    number: "04",
    title: "AI Software\nSolutions",
    desc: "We integrate AI where it earns its place: automation pipelines, predictive analytics, and systems that get smarter with every interaction.",
    accent: "#5A6FD4",
  },
  {
    number: "05",
    title: "Digital\nMarketing",
    desc: "Strategy-first digital campaigns backed by data. We don't guess at what works — we measure it, iterate, and scale what converts.",
    accent: "#3A9BD5",
  },
];

export default function ServicesSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement[]>([]);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const section = sectionRef.current;
    const track = trackRef.current;
    if (!section || !track) return;

    const getScrollAmount = () => {
      const trackWidth = track.scrollWidth;
      const viewportWidth = window.innerWidth;
      return -(trackWidth - viewportWidth);
    };

    const quickSkewers = cardsRef.current.map((card) =>
      gsap.quickTo(card, "skewX", { duration: 0.6, ease: "power3.out" })
    );

    const ctx = gsap.context(() => {
      gsap.to(track, {
        x: getScrollAmount,
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: () => `+=${Math.abs(getScrollAmount())}`,
          pin: true,
          scrub: 1,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate(self) {
            const velocity = self.getVelocity();
            const rawSkew = velocity / 280;
            const clampedSkew = Math.max(-15, Math.min(15, rawSkew));
            quickSkewers.forEach((setSkew) => setSkew(clampedSkew));
          },
        },
      });

      ScrollTrigger.addEventListener("scrollEnd", () => {
        quickSkewers.forEach((setSkew) => setSkew(0));
      });
    }, section);

    const handleResize = () => ScrollTrigger.refresh();
    window.addEventListener("resize", handleResize);

    return () => {
      ctx.revert();
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <section id="services"
      ref={sectionRef}
      style={{
        background: "#040408",
        overflow: "hidden",
        position: "relative",
      }}
    >
      {/* Ghost "EXPERTISE" backdrop - Adjusted for better visibility */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          whiteSpace: "nowrap",
          fontFamily: "'Space Grotesk', sans-serif",
          fontWeight: 900,
          fontSize: "13vw",
          letterSpacing: "-0.02em",
          color: "transparent",
          WebkitTextStroke: "1px rgba(255,255,255,0.08)",
          textShadow: "0 0 30px rgba(255,255,255,0.03)",
          pointerEvents: "none",
          userSelect: "none",
          zIndex: 0,
        }}
      >
        EXPERTISE
      </div>

{/* ── Heading ───────────────────── */}
      <div
        style={{
          position: "absolute",
          top: "40px",
          left: "64px",
          zIndex: 10,
          width: "calc(100vw - 128px)"
        }}
      >
        <span
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
          02 / Services
        </span>
        <div
          style={{
            height: "1px",
            background: "linear-gradient(90deg, #3A9BD5 0%, #7B4FD4 50%, transparent 100%)",
            marginBottom: "48px",
            width: "100%",
          }}
        />
        <h2
          style={{
            fontFamily: "'Space Grotesk', sans-serif",
            fontWeight: 700,
            fontSize: "clamp(36px, 5vw, 60px)",
            color: "#E8EDF5",
            letterSpacing: "-0.04em",
            lineHeight: 1,
            margin: 0,
          }}
        >
          Our Services
        </h2>
      </div>

      <div
        ref={trackRef}
        style={{
          display: "flex",
          alignItems: "flex-start",
          paddingTop: "clamp(180px, 25vh, 280px)", // responsive top gap
          height: "100vh",
          gap: "clamp(24px, 5vw, 40px)",
          paddingLeft: "clamp(24px, 6vw, 64px)",
          paddingRight: "clamp(24px, 10vw, 120px)",
          width: "max-content",
          position: "relative",
          zIndex: 5,
        }}
      >
        {services.map((svc, i) => (
          <div
            key={svc.number}
            ref={(el) => { if (el) cardsRef.current[i] = el; }}
            style={{
              width: "clamp(240px, 80vw, 280px)", 
              height: "auto",
              minHeight: "360px",
              flexShrink: 0,
              background: "rgba(255,255,255,0.02)",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: "6px",
              padding: "clamp(24px, 6vw, 40px)",
              display: "flex",
              flexDirection: "column",
              gap: "24px",
              willChange: "transform",
              transformOrigin: "center center",
            }}
          >
            <div style={{ height: "2px", width: "32px", background: svc.accent, borderRadius: "2px" }} />
            
            <span style={{ fontFamily: "monospace", fontSize: "11px", color: svc.accent }}>{svc.number}</span>
            
            <h3 style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: "24px", color: "#E8EDF5", lineHeight: 1.1, whiteSpace: "pre-line", margin: 0 }}>
              {svc.title}
            </h3>
            
            <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "13px", color: "#708090", lineHeight: 1.8, margin: 0, flexGrow: 1 }}>
              {svc.desc}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}