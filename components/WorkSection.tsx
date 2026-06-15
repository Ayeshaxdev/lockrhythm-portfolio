"use client";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Link from "next/link";

// ─── Project data ─────────────────────────────────────────────────────────────
const projects = [
  {
    id: 1,
    name: "Lumiere Studio Booking",
    year: "2025",
    description:
      "A sleek scheduling platform for creative studios to streamline reservations and client management.",
    href: "https://lumiere-studio-booking.vercel.app/",
    color1: "#0d1520",
    color2: "#1B4A7A",
  },
  {
    id: 2,
    name: "Cafe Dreams 3D",
    year: "2025",
    description:
      "An immersive interactive 3D web experience that brings modern café environments to life in the browser.",
    href: "https://cafe-dreams-3d.vercel.app/",
    color1: "#120a00",
    color2: "#4A2800",
  },
  {
    id: 3,
    name: "Crimson Store",
    year: "2025",
    description:
      "A high-performance e-commerce platform engineered for fast conversions with a frictionless checkout flow.",
    href: "https://crimsonstore.lovable.app/",
    localImage: "/screenshots/crimson.png",
    color1: "#1a0008",
    color2: "#6B0020",
  },
  {
    id: 4,
    name: "Real Face Rewind",
    year: "2025",
    description:
      "An AI-powered image processing application delivering seamless facial transformations and visual effects.",
    href: "https://real-face-rewind.lovable.app/",
    color1: "#0a0a1a",
    color2: "#2A1A5E",
  },
  {
    id: 5,
    name: "Zam Connect Chat",
    year: "2025",
    description:
      "A robust real-time communication app built for fast, secure, and reliable instant messaging.",
    href: "https://zam-connect-chat.lovable.app/",
    color1: "#001a10",
    color2: "#00522E",
  },
  {
    id: 6,
    name: "Sequence Game",
    year: "2025",
    description:
      "A fully digital adaptation of the classic strategy board game with complex state management and interactive gameplay.",
    href: "#", // ← Add link later
    localImage: "/screenshots/sequence.png",
    color1: "#1a1000",
    color2: "#4A3800",
  },
  {
    id: 7,
    name: "Clinicare Dashboard",
    year: "2025",
    description:
      "A comprehensive healthcare management system for patient records, smart scheduling, and clinic operations.",
    href: "https://lockrhythmclinic.lovable.app/",
    localImage: "/screenshots/clinicare.png",
    color1: "#001018",
    color2: "#003A5C",
  },
  {
    id: 8,
    name: "Bakehers Shop",
    year: "2025",
    description:
      "A warm, inviting e-commerce storefront for an artisan bakery — built for easy browsing, seamless ordering, and a delightful customer experience.",
    href: "https://bakehers-shop.vercel.app/",
    localImage: "/screenshots/Bakers.png",
    color1: "#1a0a00",
    color2: "#3D1F00",
  },
];

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}
// ─── Single pixel-reveal card ─────────────────────────────────────────────────
// ─── Single pixel-reveal card ─────────────────────────────────────────────────
function PixelCard({ project }: { project: (typeof projects)[0] }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  
  // 1. VIDEO WALE EXACT PIXEL STEPS (Percentages: 2%, 5%, 6%, 8%, 100%)
  const pxSteps = [0.02, 0.05, 0.06, 0.08, 1];
  const stepIndexRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    const card = cardRef.current;
    if (!canvas || !card) return;

    const ctx = canvas.getContext("2d")!;
    const W = canvas.width;  // 960
    const H = canvas.height; // 540

    const source = document.createElement("canvas");
    source.width = W;
    source.height = H;
    const sCtx = source.getContext("2d")!;

    const temp = document.createElement("canvas");
    const tCtx = temp.getContext("2d")!;

    // ── Core draw: Ab Size nahi, Percentage use hogi ──────────────────────
    const draw = (sizePercentage: number) => {
      // Jab 100% (1) ho jaye to direct clear image dikhao
      if (sizePercentage >= 1) {
        ctx.imageSmoothingEnabled = true; 
        ctx.clearRect(0, 0, W, H);
        ctx.drawImage(source, 0, 0);
        return;
      }
      
      const tw = Math.max(1, Math.ceil(W * sizePercentage));
      const th = Math.max(1, Math.ceil(H * sizePercentage));
      
      temp.width = tw;
      temp.height = th;
      tCtx.imageSmoothingEnabled = false;
      tCtx.clearRect(0, 0, tw, th);
      tCtx.drawImage(source, 0, 0, tw, th);
      
      ctx.imageSmoothingEnabled = false;
      ctx.clearRect(0, 0, W, H);
      ctx.drawImage(temp, 0, 0, tw, th, 0, 0, W, H);
    };

    const paintGradient = () => {
      const grad = sCtx.createLinearGradient(0, 0, W, H);
      grad.addColorStop(0, project.color1);
      grad.addColorStop(1, project.color2);
      sCtx.fillStyle = grad;
      sCtx.fillRect(0, 0, W, H);
      sCtx.font = `bold ${W / 14}px 'Space Grotesk', sans-serif`;
      sCtx.fillStyle = "rgba(255,255,255,0.07)";
      sCtx.textAlign = "center";
      sCtx.textBaseline = "middle";
      sCtx.fillText(project.name, W / 2, H / 2);
    };

    paintGradient();
    draw(pxSteps[0]); // Shuru mein 2% chunk dikhao

    // 2. FLIPBOOK AUTO-PLAY FUNCTION (Video ki tarah)
    const animatePixels = () => {
      if (stepIndexRef.current < pxSteps.length) {
        setTimeout(() => {
          draw(pxSteps[stepIndexRef.current]);
          stepIndexRef.current++;
          animatePixels();
        }, stepIndexRef.current === 0 ? 300 : 80); // Pehla jhatka 300ms baad, baqi 80ms ki speed par
      }
    };

    if (project.localImage || project.href !== "#") {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.onload = () => {
        sCtx.clearRect(0, 0, W, H);
        sCtx.drawImage(img, 0, 0, W, H);
        const currentIndex = stepIndexRef.current < pxSteps.length ? stepIndexRef.current : pxSteps.length - 1;
        draw(pxSteps[currentIndex]);
      };
      img.onerror = () => {};
    setTimeout(() => {
        img.src = project.localImage || `/api/screenshot?url=${encodeURIComponent(project.href)}`;
      }, 200);
    }

    // 3. SCROLL SCRUB HATA DIYA - AB SIRF ONCE TRIGGER HOGA
    const trigger = ScrollTrigger.create({
      trigger: card,
      start: "top 75%", // Jaise hi card screen ke 25% andar aaye, flipbook chala do
      onEnter: animatePixels,
      once: true, // Zindagi mein sirf ek dafa animate hoga (video ki tarah)
    });

    return () => {
      trigger.kill();
    };
  }, [project]);

  const isPlaceholder = project.href === "#";

  return (
    <article ref={cardRef}>
      <div
        style={{
          position: "relative",
          borderRadius: "4px",
          overflow: "hidden",
          lineHeight: 0,
        }}
      >
        <canvas
          ref={canvasRef}
          width={960}
          height={540}
          style={{
            width: "100%",
            aspectRatio: "16/9",
            display: "block",
          }}
        />

        {!isPlaceholder && (
          <Link
            href={project.href}
            target="_blank"
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "rgba(4,4,8,0)",
              transition: "background 0.3s",
              textDecoration: "none",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.background =
                "rgba(4,4,8,0.55)";
              const span = e.currentTarget.querySelector("span");
              if (span) (span as HTMLSpanElement).style.opacity = "1";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.background =
                "rgba(4,4,8,0)";
              const span = e.currentTarget.querySelector("span");
              if (span) (span as HTMLSpanElement).style.opacity = "0";
            }}
          >
            <span
              style={{
                opacity: 0,
                transition: "opacity 0.3s",
                fontFamily: "'Inter', sans-serif",
                fontSize: "13px",
                fontWeight: 500,
                color: "#E8EDF5",
                border: "1px solid rgba(232,237,245,0.4)",
                padding: "10px 20px",
                borderRadius: "4px",
                letterSpacing: "0.05em",
              }}
            >
              VIEW PROJECT →
            </span>
          </Link>
        )}
      </div>

      <div style={{ padding: "14px 2px 0" }}>
        <p
          style={{
            fontFamily: "'Space Grotesk', sans-serif",
            fontWeight: 500,
            fontSize: "14px",
            color: "#9BAAB8",
            letterSpacing: "-0.01em",
            margin: "0 0 6px",
          }}
        >
          {project.name}
        </p>
        <p
          style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: "13px",
            color: "#3A4A5A",
            lineHeight: 1.6,
            margin: 0,
            maxWidth: "420px",
          }}
        >
          {project.description}
        </p>
      </div>
    </article>
  );
}

// ─── Main Work Page ───────────────────────────────────────────────────────────
export default function WorkSection() {
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    return () => ScrollTrigger.getAll().forEach((t) => t.kill());
  }, []);

  // Split into two columns for the staggered look
  const leftCol = projects.filter((_, i) => i % 2 === 0);  // 0,2,4,6
  const rightCol = projects.filter((_, i) => i % 2 !== 0); // 1,3,5,7

  return (
    <main id="work"
      style={{
        background: "#040408",
        minHeight: "100vh",
        padding: "60px 60px 80px",
      }}
    >
      {/* ── Section header ── */}
      <div style={{ marginBottom: "48px", maxWidth: "1280px" }}>
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
          01 / Work
        </span>
        <div
          style={{
            height: "1px",
            background: "linear-gradient(90deg, #3A9BD5 0%, #7B4FD4 50%, transparent 100%)",
            marginBottom: "48px",
          }}
        />
        <h1
          style={{
            fontFamily: "'Space Grotesk', sans-serif",
            fontWeight: 700,
            fontSize: "clamp(48px, 7vw, 88px)",
            color: "#E8EDF5",
            letterSpacing: "-0.04em",
            lineHeight: 1,
            margin: 0,
          }}
        >
          Our Work
        </h1>
      </div>

      {/* ── Two-column staggered grid ── */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "32px",
          maxWidth: "1280px",
          alignItems: "start",
        }}
      >
        {/* Left column — starts at top */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "64px",
          }}
        >
          {leftCol.map((p) => (
            <PixelCard key={p.id} project={p} />
          ))}
        </div>

        {/* Right column — offset down to create stagger like in the video */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "64px",
            marginTop: "180px", // ← this is the stagger offset
          }}
        >
          {rightCol.map((p) => (
            <PixelCard key={p.id} project={p} />
          ))}
        </div>
      </div>

      {/* ── Bottom CTA ── */}
      <div
        style={{
          marginTop: "120px",
          paddingTop: "48px",
          borderTop: "1px solid rgba(58,155,213,0.1)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <p
          style={{
            fontFamily: "'Space Grotesk', sans-serif",
            fontSize: "clamp(24px, 3vw, 36px)",
            fontWeight: 600,
            color: "#E8EDF5",
            margin: 0,
            letterSpacing: "-0.02em",
          }}
        >
          Got a project in mind?
        </p>
        <Link
          href="/#contact"
          style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: "14px",
            fontWeight: 500,
            color: "#8BAFC8",
            textDecoration: "none",
            border: "1px solid rgba(139,175,200,0.3)",
            padding: "14px 28px",
            borderRadius: "6px",
            transition: "all 0.2s",
            whiteSpace: "nowrap",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLAnchorElement).style.borderColor = "#8BAFC8";
            (e.currentTarget as HTMLAnchorElement).style.background =
              "rgba(139,175,200,0.08)";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLAnchorElement).style.borderColor =
              "rgba(139,175,200,0.3)";
            (e.currentTarget as HTMLAnchorElement).style.background = "transparent";
          }}
        >
          Let's Talk →
        </Link>
      </div>
    </main>
  );
}