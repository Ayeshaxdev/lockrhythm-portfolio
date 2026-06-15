"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// ─────────────────────────────────────────────────────────────────────────────
// DESIGN PHILOSOPHY
// ViewBox: 0 0 1000 900
// Four overlapping Bézier paths crisscross the canvas to form an organic "web"
// Each path starts from off-canvas edges, weaves through all 5 node points,
// and ends off the other side — creating a genuine tangle effect.
//
// Node positions (anchors for the web):
//   N0 Discovery  → (160, 120)   top-left zone
//   N1 Design     → (780, 260)   top-right zone
//   N2 Development→ (420, 460)   center
//   N3 QA         → (680, 660)   lower-right
//   N4 Deployment → (260, 800)   bottom-left
// ─────────────────────────────────────────────────────────────────────────────

// Five anchor nodes
const NODES = [
  { id: "discovery",   label: "Discovery",    sub: "Strategy & Planning",    cx: 160, cy: 120 },
  { id: "design",      label: "Design",       sub: "Wireframing & UI",        cx: 780, cy: 260 },
  { id: "development", label: "Development",  sub: "Engineering",             cx: 420, cy: 460 },
  { id: "qa",          label: "QA & Testing", sub: "Optimization",            cx: 700, cy: 668 },
  { id: "deployment",  label: "Deployment",   sub: "Ship",                    cx: 240, cy: 810 },
];

// ── Four organic Bézier paths that weave through/around the nodes ─────────────
// Path A — the "spine": meanders left → right → center → right → left
const PATH_A =
  "M -40,220 " +
  "C 80,80 100,60 160,120 " +           // → N0 (Discovery)
  "C 280,200 520,180 780,260 " +         // → N1 (Design)
  "C 900,310 860,380 420,460 " +         // → N2 (Development)
  "C 180,530 560,580 700,668 " +         // → N3 (QA)
  "C 820,750 680,820 240,810 " +         // → N4 (Deployment)
  "C 60,800 -20,860 -40,940";            // exit bottom-left

// Path B — "high arc": crosses above and below opposite to A
const PATH_B =
  "M 1040,60 " +
  "C 820,20 620,60 780,260 " +           // → N1 (Design) from top-right
  "C 880,380 720,420 420,460 " +         // → N2 (Development)
  "C 200,500 80,100 160,120 " +          // crosses back to N0 (Discovery)
  "C 240,140 380,300 240,810 " +         // long diagonal → N4 (Deployment)
  "C 180,920 80,960 -40,1000";           // exit bottom-left

// Path C — "lower braid": starts bottom, loops up through center
const PATH_C =
  "M -40,780 " +
  "C 40,720 80,780 240,810 " +           // → N4 (Deployment)
  "C 380,840 580,760 700,668 " +         // → N3 (QA)
  "C 780,600 820,520 420,460 " +         // → N2 (Development)
  "C 280,420 120,320 160,120 " +         // crosses to N0 (Discovery)
  "C 200,0 600,-20 780,260 " +           // swoops up to N1 (Design)
  "C 900,360 1040,300 1060,180";         // exit top-right

// Path D — "diagonal ghost": thin cross-brace across the full web
const PATH_D =
  "M 1040,900 " +
  "C 880,820 800,740 700,668 " +         // → N3 (QA)
  "C 560,580 500,520 420,460 " +         // → N2 (Development)
  "C 300,380 260,300 160,120 " +         // → N0 (Discovery)
  "C 60,-40 400,-80 780,260 " +          // → N1 (Design) via big arc
  "C 860,320 820,580 700,668 " +         // loop back near N3
  "C 620,720 440,820 240,810 " +         // → N4 (Deployment)
  "C 100,800 -20,820 -40,900";           // exit bottom

// Scroll-progress thresholds at which each node activates (0→1)
const NODE_TRIGGERS = [0.04, 0.22, 0.46, 0.68, 0.88];

// Tip of the "painting cursor" path — we only animate Path A for the draw cursor
// The glow paths each have their own dashoffset driven by progress

export default function StudioSection() {
  const sectionRef   = useRef<HTMLElement>(null);

  // Four path pairs (main + glow) — refs for each
  const pathARefs = useRef<{ main: SVGPathElement | null; glow: SVGPathElement | null }>({ main: null, glow: null });
  const pathBRefs = useRef<{ main: SVGPathElement | null; glow: SVGPathElement | null }>({ main: null, glow: null });
  const pathCRefs = useRef<{ main: SVGPathElement | null; glow: SVGPathElement | null }>({ main: null, glow: null });
  const pathDRefs = useRef<{ main: SVGPathElement | null; glow: SVGPathElement | null }>({ main: null, glow: null });

  const nodeGroupRefs  = useRef<(SVGGElement | null)[]>([]);
  const pulseRingRefs  = useRef<(SVGCircleElement | null)[]>([]);
  const labelRefs      = useRef<(HTMLDivElement | null)[]>([]);
  const triggeredRef   = useRef<boolean[]>(new Array(NODES.length).fill(false));

  const headerRef      = useRef<HTMLDivElement>(null);
  const footerRef      = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const section = sectionRef.current;
    if (!section) return;

    // Collect all path elements
    const allPaths = [
      pathARefs.current,
      pathBRefs.current,
      pathCRefs.current,
      pathDRefs.current,
    ];

    // ── Compute total lengths & set initial dasharray/offset ─────────────────
    const pathLengths = allPaths.map(({ main }) => {
      if (!main) return 0;
      const len = main.getTotalLength();
      gsap.set([main], { strokeDasharray: len, strokeDashoffset: len });
      return len;
    });

    // Glow paths — same treatment
    allPaths.forEach(({ glow }, i) => {
      if (!glow) return;
      const len = pathLengths[i] || glow.getTotalLength();
      gsap.set(glow, { strokeDasharray: len, strokeDashoffset: len });
    });

    // ── Initially hide nodes & labels ─────────────────────────────────────────
    nodeGroupRefs.current.forEach((g) => {
      if (g) gsap.set(g, { scale: 0, opacity: 0, transformOrigin: "center center" });
    });
    pulseRingRefs.current.forEach((c) => {
      if (c) gsap.set(c, { scale: 0, opacity: 0, transformOrigin: "center center" });
    });
    labelRefs.current.forEach((el) => {
      if (el) gsap.set(el, { opacity: 0, y: 16, filter: "blur(4px)" });
    });

    // ── Header / footer fade in on mount ─────────────────────────────────────
    if (headerRef.current) {
      gsap.fromTo(headerRef.current,
        { opacity: 0, y: 24 },
        { opacity: 1, y: 0, duration: 1.2, ease: "power3.out", scrollTrigger: {
          trigger: section, start: "top 80%",
        }}
      );
    }

    // ── Main ScrollTrigger — scrubs all 4 paths in parallel ──────────────────
    const triggered = triggeredRef.current;

    // Stagger the 4 paths so they draw at slightly different offsets
    // giving the "braiding" feel
    const PATH_STAGGER = [0, 0.08, 0.15, 0.22]; // how much each path lags behind

    ScrollTrigger.create({
      trigger: section,
      start: "top top",
      end: "bottom bottom",
      scrub: 1.8,
      onUpdate(self) {
        const p = self.progress;

        // Draw each path with stagger
        allPaths.forEach(({ main, glow }, i) => {
          const lag = PATH_STAGGER[i];
          const localP = Math.max(0, Math.min(1, (p - lag) / (1 - lag)));
          const len = pathLengths[i];
          if (main) gsap.set(main, { strokeDashoffset: len * (1 - localP) });
          if (glow)  gsap.set(glow,  { strokeDashoffset: len * (1 - localP) });
        });

        // ── Activate nodes ──────────────────────────────────────────────────
        NODE_TRIGGERS.forEach((threshold, i) => {
          const nodeEl   = nodeGroupRefs.current[i];
          const pulseEl  = pulseRingRefs.current[i];
          const labelEl  = labelRefs.current[i];

          if (p >= threshold && !triggered[i]) {
            triggered[i] = true;

            // Node pop in
            if (nodeEl) {
              gsap.to(nodeEl, {
                scale: 1, opacity: 1,
                duration: 0.6,
                ease: "elastic.out(1.2, 0.5)",
              });
            }
            // Pulse ring expansion
            if (pulseEl) {
              gsap.fromTo(
                pulseEl,
                { scale: 0.4, opacity: 0 },
                {
                  scale: 2.2, opacity: 0,
                  duration: 1.4,
                  ease: "power2.out",
                  repeat: -1,
                  repeatDelay: 0.6,
                }
              );
            }
            // Label fade up
            if (labelEl) {
              gsap.to(labelEl, {
                opacity: 1, y: 0,
                filter: "blur(0px)",
                duration: 0.7,
                ease: "power3.out",
                delay: 0.18,
              });
            }
          }

          // Reverse on scroll-back
          if (p < threshold - 0.03 && triggered[i]) {
            triggered[i] = false;

            if (nodeEl)  gsap.to(nodeEl,  { scale: 0, opacity: 0, duration: 0.25 });
            if (pulseEl) gsap.killTweensOf(pulseEl);
            if (labelEl) gsap.to(labelEl, { opacity: 0, y: 16, filter: "blur(4px)", duration: 0.25 });
          }
        });
      },
    });

    // ── Footer counter — scroll progress counter ──────────────────────────────
    if (footerRef.current) {
      const counterEl = footerRef.current.querySelector<HTMLSpanElement>("[data-counter]");
      ScrollTrigger.create({
        trigger: section,
        start: "top top",
        end: "bottom bottom",
        scrub: true,
        onUpdate(self) {
          if (counterEl) {
            counterEl.textContent = `${Math.round(self.progress * 100).toString().padStart(3, "0")}`;
          }
        },
      });
    }

    return () => {
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, []);

  // Helper: label anchor position relative to node
  const getLabelStyle = (cx: number, cy: number, i: number): React.CSSProperties => {
    // Position labels to avoid overlapping each other
    const positions: { top?: string; bottom?: string; left?: string; right?: string; transform?: string; textAlign?: "left" | "right" | "center" }[] = [
      // N0 Discovery — top-left node → label below-right
      { top: `${cy + 28}px`, left: `${cx - 10}px`, textAlign: "left" },
      // N1 Design — top-right → label below-left
      { top: `${cy + 28}px`, right: `${1000 - cx - 10}px`, textAlign: "right" },
      // N2 Development — center → label directly below
      { top: `${cy + 28}px`, left: `${cx - 70}px`, textAlign: "center" },
      // N3 QA — lower-right → label to the left
      { top: `${cy - 12}px`, right: `${1000 - cx + 28}px`, textAlign: "right" },
      // N4 Deployment — bottom-left → label above-right
      { bottom: `${900 - cy + 22}px`, left: `${cx - 10}px`, textAlign: "left" },
    ];
    return { position: "absolute", ...positions[i] };
  };
  return (
    <section
      ref={sectionRef}
      id="studio"
      style={{
        background: "#040408",
        minHeight: "480vh",
        position: "relative",
      }}
    >
      {/* ── Sticky viewport container ── */}
      <div
        style={{
          position: "sticky",
          top: 0,
          height: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
        }}
      >
        {/* ── Ambient gradient backdrop ── */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(ellipse 70% 50% at 30% 30%, rgba(58,155,213,0.04) 0%, transparent 70%), " +
              "radial-gradient(ellipse 60% 60% at 75% 70%, rgba(58,155,213,0.03) 0%, transparent 70%)",
            pointerEvents: "none",
          }}
        />

        {/* ── Grain texture overlay ── */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            opacity: 0.025,
            backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
            backgroundSize: "200px 200px",
            pointerEvents: "none",
          }}
        />

        {/* ── Section header ── */}
        <div
          ref={headerRef}
          style={{
            position: "absolute",
            top: "clamp(28px, 4.5vh, 52px)",
            left: "clamp(28px, 4vw, 64px)",
            opacity: 0,
            zIndex: 10,
          }}
        >
          <p
            style={{
              fontFamily: "monospace",
              fontSize: "10px",
              letterSpacing: "0.25em",
              color: "#3A9BD5",
              margin: "0 0 12px",
              textTransform: "uppercase",
            }}
          >
            How We Work
          </p>
          <h2
            style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontWeight: 700,
              fontSize: "clamp(30px, 4.2vw, 58px)",
              color: "#E8EDF5",
              letterSpacing: "-0.045em",
              lineHeight: 0.95,
              margin: 0,
            }}
          >
            The<br />
            <span style={{ color: "#3A9BD5" }}>Pipeline.</span>
          </h2>
        </div>

        {/* ── Progress counter (bottom-right) ── */}
        <div
          ref={footerRef}
          style={{
            position: "absolute",
            bottom: "clamp(20px, 3vh, 36px)",
            right: "clamp(28px, 4vw, 64px)",
            zIndex: 10,
            display: "flex",
            alignItems: "baseline",
            gap: "4px",
          }}
        >
          <span
            data-counter
            style={{
              fontFamily: "monospace",
              fontSize: "clamp(32px, 4vw, 52px)",
              fontWeight: 700,
              color: "rgba(58,155,213,0.18)",
              letterSpacing: "-0.04em",
              lineHeight: 1,
            }}
          >
            000
          </span>
          <span
            style={{
              fontFamily: "monospace",
              fontSize: "10px",
              color: "rgba(90,104,128,0.5)",
              letterSpacing: "0.12em",
            }}
          >
            %
          </span>
        </div>

        {/* ── Scroll nudge ── */}
        <div
          style={{
            position: "absolute",
            bottom: "clamp(20px, 3vh, 36px)",
            left: "50%",
            transform: "translateX(-50%)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "6px",
            opacity: 0.35,
            zIndex: 10,
          }}
        >
          <span
            style={{
              fontFamily: "monospace",
              fontSize: "8px",
              letterSpacing: "0.22em",
              color: "#5A6880",
            }}
          >
            SCROLL
          </span>
          <div
            style={{
              width: "1px",
              height: "36px",
              background: "linear-gradient(to bottom, #3A9BD5, transparent)",
              animation: "lr-scroll-pulse 2s ease-in-out infinite",
            }}
          />
        </div>

        {/* ── SVG Stage ── */}
        <div
          style={{
            position: "relative",
            width: "100%",
            maxWidth: "960px",
            height: "85vh",
            margin: "0 auto",
            padding: "0 clamp(16px, 3vw, 48px)",
          }}
        >
          {/* ── Node Labels (HTML, positioned over SVG) ── */}
          {NODES.map((node, i) => {
            // Convert SVG coords (viewBox 0 0 1000 900) to percentages
            const xPct = (node.cx / 1000) * 100;
            const yPct = (node.cy / 900) * 100;

            // Label offset direction per node
            const offsets: { x: string; y: string; align: "left" | "right" | "center" }[] = [
              { x: "calc(10px)",   y: "calc(28px)",  align: "left"   }, // N0
              { x: "calc(-170px)", y: "calc(28px)",  align: "right"  }, // N1
              { x: "calc(-80px)",  y: "calc(28px)",  align: "center" }, // N2
              { x: "calc(-180px)", y: "calc(-10px)", align: "right"  }, // N3
              { x: "calc(10px)",   y: "calc(-74px)", align: "left"   }, // N4
            ];

            const off = offsets[i];

            return (
              <div
                key={node.id}
                ref={(el) => { labelRefs.current[i] = el; }}
                style={{
                  position: "absolute",
                  left: `${xPct}%`,
                  top: `${yPct}%`,
                  transform: `translate(${off.x}, ${off.y})`,
                  pointerEvents: "none",
                  opacity: 0,
                  zIndex: 10,
                  width: "160px",
                  textAlign: off.align,
                }}
              >
                <p
                  style={{
                    fontFamily: "monospace",
                    fontSize: "9px",
                    letterSpacing: "0.22em",
                    color: "#3A9BD5",
                    margin: "0 0 5px",
                    lineHeight: 1,
                    textTransform: "uppercase",
                  }}
                >
                  {`0${i + 1}`}
                </p>
                <p
                  style={{
                    fontFamily: "'Space Grotesk', sans-serif",
                    fontWeight: 700,
                    fontSize: "clamp(12px, 1.4vw, 16px)",
                    color: "#E8EDF5",
                    letterSpacing: "-0.025em",
                    margin: "0 0 4px",
                    lineHeight: 1.1,
                  }}
                >
                  {node.label}
                </p>
                <p
                  style={{
                    fontFamily: "'Inter', sans-serif",
                    fontSize: "clamp(9px, 0.9vw, 11px)",
                    color: "#4A5568",
                    lineHeight: 1.5,
                    margin: 0,
                  }}
                >
                  {node.sub}
                </p>
              </div>
            );
          })}

          {/* ── SVG Web ── */}
          <svg
            viewBox="0 0 1000 900"
            preserveAspectRatio="xMidYMid meet"
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              overflow: "visible",
            }}
          >
            <defs>
              {/* ── Line glow filter ── */}
              <filter id="lr-line-glow" x="-30%" y="-30%" width="160%" height="160%">
                <feGaussianBlur in="SourceGraphic" stdDeviation="4" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>

              {/* ── Strong node glow ── */}
              <filter id="lr-node-glow" x="-100%" y="-100%" width="300%" height="300%">
                <feGaussianBlur in="SourceGraphic" stdDeviation="8" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>

              {/* ── Soft node glow (outer ring) ── */}
              <filter id="lr-ring-glow" x="-100%" y="-100%" width="300%" height="300%">
                <feGaussianBlur in="SourceGraphic" stdDeviation="12" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>

              {/* ── Node fill gradient ── */}
              <radialGradient id="lr-node-fill" cx="50%" cy="50%" r="50%">
                <stop offset="0%"   stopColor="#1E6FA8" stopOpacity="0.9" />
                <stop offset="60%"  stopColor="#0D3A5C" stopOpacity="0.7" />
                <stop offset="100%" stopColor="#040408" stopOpacity="1"   />
              </radialGradient>

              {/* ── Ghost path gradient — very faint guide ── */}
              <linearGradient id="lr-ghost-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%"   stopColor="#3A9BD5" stopOpacity="0.04" />
                <stop offset="50%"  stopColor="#3A9BD5" stopOpacity="0.07" />
                <stop offset="100%" stopColor="#3A9BD5" stopOpacity="0.04" />
              </linearGradient>
            </defs>

            {/* ════════════════════════════════════════════════════
                GHOST PATHS — always visible, ultra-faint guides
                ════════════════════════════════════════════════════ */}
            {[PATH_A, PATH_B, PATH_C, PATH_D].map((d, i) => (
              <path
                key={`ghost-${i}`}
                d={d}
                fill="none"
                stroke="url(#lr-ghost-grad)"
                strokeWidth={i === 3 ? "1" : "1.5"}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            ))}

            {/* ════════════════════════════════════════════════════
                PATH A — the primary spine (widest glow)
                ════════════════════════════════════════════════════ */}
            {/* Glow layer */}
            <path
              ref={(el) => { pathARefs.current.glow = el; }}
              d={PATH_A}
              fill="none"
              stroke="#3A9BD5"
              strokeWidth="12"
              strokeLinecap="round"
              strokeLinejoin="round"
              filter="url(#lr-line-glow)"
              opacity={0.18}
            />
            {/* Main line */}
            <path
              ref={(el) => { pathARefs.current.main = el; }}
              d={PATH_A}
              fill="none"
              stroke="#3A9BD5"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              opacity={0.7}
            />

            {/* ════════════════════════════════════════════════════
                PATH B — cross arc (slightly thinner)
                ════════════════════════════════════════════════════ */}
            <path
              ref={(el) => { pathBRefs.current.glow = el; }}
              d={PATH_B}
              fill="none"
              stroke="#5BB8E8"
              strokeWidth="9"
              strokeLinecap="round"
              strokeLinejoin="round"
              filter="url(#lr-line-glow)"
              opacity={0.14}
            />
            <path
              ref={(el) => { pathBRefs.current.main = el; }}
              d={PATH_B}
              fill="none"
              stroke="#5BB8E8"
              strokeWidth="1.2"
              strokeLinecap="round"
              strokeLinejoin="round"
              opacity={0.55}
            />

            {/* ════════════════════════════════════════════════════
                PATH C — lower braid (warm tint)
                ════════════════════════════════════════════════════ */}
            <path
              ref={(el) => { pathCRefs.current.glow = el; }}
              d={PATH_C}
              fill="none"
              stroke="#2A7CB5"
              strokeWidth="8"
              strokeLinecap="round"
              strokeLinejoin="round"
              filter="url(#lr-line-glow)"
              opacity={0.16}
            />
            <path
              ref={(el) => { pathCRefs.current.main = el; }}
              d={PATH_C}
              fill="none"
              stroke="#2A7CB5"
              strokeWidth="1"
              strokeLinecap="round"
              strokeLinejoin="round"
              opacity={0.5}
            />

            {/* ════════════════════════════════════════════════════
                PATH D — diagonal ghost brace (thinnest)
                ════════════════════════════════════════════════════ */}
            <path
              ref={(el) => { pathDRefs.current.glow = el; }}
              d={PATH_D}
              fill="none"
              stroke="#3A9BD5"
              strokeWidth="6"
              strokeLinecap="round"
              strokeLinejoin="round"
              filter="url(#lr-line-glow)"
              opacity={0.1}
            />
            <path
              ref={(el) => { pathDRefs.current.main = el; }}
              d={PATH_D}
              fill="none"
              stroke="#3A9BD5"
              strokeWidth="0.8"
              strokeLinecap="round"
              strokeLinejoin="round"
              opacity={0.4}
              strokeDasharray="4 8"
            />

            {/* ════════════════════════════════════════════════════
                NODES — 5 glowing intersections
                ════════════════════════════════════════════════════ */}
            {NODES.map((node, i) => (
              <g key={node.id}>
                {/* Pulse ring (animated outward by GSAP) */}
                <circle
                  ref={(el) => { pulseRingRefs.current[i] = el; }}
                  cx={node.cx}
                  cy={node.cy}
                  r={18}
                  fill="none"
                  stroke="#3A9BD5"
                  strokeWidth="1"
                  opacity={0}
                  filter="url(#lr-ring-glow)"
                  style={{ transformOrigin: `${node.cx}px ${node.cy}px` }}
                />

                {/* Main node group (popped in by GSAP) */}
                <g
                  ref={(el) => { nodeGroupRefs.current[i] = el; }}
                  style={{ transformOrigin: `${node.cx}px ${node.cy}px` }}
                >
                  {/* Outermost halo */}
                  <circle
                    cx={node.cx}
                    cy={node.cy}
                    r={28}
                    fill="none"
                    stroke="#3A9BD5"
                    strokeWidth="0.5"
                    opacity={0.12}
                  />
                  {/* Outer ring */}
                  <circle
                    cx={node.cx}
                    cy={node.cy}
                    r={20}
                    fill="none"
                    stroke="#3A9BD5"
                    strokeWidth="0.8"
                    opacity={0.25}
                  />
                  {/* Filled circle with gradient */}
                  <circle
                    cx={node.cx}
                    cy={node.cy}
                    r={13}
                    fill="url(#lr-node-fill)"
                    stroke="#3A9BD5"
                    strokeWidth="1.2"
                    filter="url(#lr-node-glow)"
                    opacity={0.9}
                  />
                  {/* Core bright dot */}
                  <circle
                    cx={node.cx}
                    cy={node.cy}
                    r={4}
                    fill="#78D0F8"
                    opacity={0.95}
                  />
                  {/* Inner bright core */}
                  <circle
                    cx={node.cx}
                    cy={node.cy}
                    r={1.5}
                    fill="#ffffff"
                    opacity={0.8}
                  />
                </g>
              </g>
            ))}

            {/* ════════════════════════════════════════════════════
                CROSS-HATCH ACCENT — subtle depth lines
                ════════════════════════════════════════════════════ */}
            <line x1="0"    y1="450" x2="1000" y2="450" stroke="#3A9BD5" strokeWidth="0.3" opacity="0.04" />
            <line x1="500"  y1="0"   x2="500"  y2="900" stroke="#3A9BD5" strokeWidth="0.3" opacity="0.04" />
          </svg>
        </div>
      </div>

      {/* ── Inline keyframes ── */}
      <style>{`
        @keyframes lr-scroll-pulse {
          0%, 100% { opacity: 0.25; transform: scaleY(0.6) translateY(-6px); }
          50%       { opacity: 1;   transform: scaleY(1)   translateY(0);    }
        }
      `}</style>
    </section>
  );
}