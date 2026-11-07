"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion, useScroll, useTransform } from "framer-motion";
import SectionHeading from "@/components/motion/SectionHeading";
import Magnetic from "@/components/motion/Magnetic";

// ─── Project data ─────────────────────────────────────────────────────────────
type Project = {
  id: number;
  name: string;
  year: string;
  tags: string[];
  description: string;
  href: string;
  localImage?: string;
  color1: string;
  color2: string;
};

const projects: Project[] = [
  {
    id: 1,
    name: "Lumiere Studio Booking",
    year: "2025",
    tags: ["Booking platform", "Web app"],
    description: "A sleek scheduling platform for creative studios to streamline reservations and client management.",
    href: "https://lumiere-studio-booking.vercel.app/",
    color1: "#0d1520",
    color2: "#1B4A7A",
  },
  {
    id: 2,
    name: "Cafe Dreams 3D",
    year: "2025",
    tags: ["3D / WebGL", "Hospitality"],
    description: "An immersive interactive 3D web experience that brings modern café environments to life in the browser.",
    href: "https://cafe-dreams-3d.vercel.app/",
    color1: "#120a00",
    color2: "#4A2800",
  },
  {
    id: 3,
    name: "Crimson Store",
    year: "2025",
    tags: ["E-commerce", "Conversion"],
    description: "A high-performance e-commerce platform engineered for fast conversions with a frictionless checkout flow.",
    href: "https://crimsonstore.lovable.app/",
    localImage: "/screenshots/crimson.png",
    color1: "#1a0008",
    color2: "#6B0020",
  },
  {
    id: 4,
    name: "Real Face Rewind",
    year: "2025",
    tags: ["AI", "Image processing"],
    description: "An AI-powered image processing application delivering seamless facial transformations and visual effects.",
    href: "https://real-face-rewind.lovable.app/",
    color1: "#0a0a1a",
    color2: "#2A1A5E",
  },
  {
    id: 5,
    name: "Zam Connect Chat",
    year: "2025",
    tags: ["Real-time", "Messaging"],
    description: "A robust real-time communication app built for fast, secure, and reliable instant messaging.",
    href: "https://zam-connect-chat.lovable.app/",
    color1: "#001a10",
    color2: "#00522E",
  },
  {
    id: 6,
    name: "Sequence Game",
    year: "2025",
    tags: ["Game", "Multiplayer"],
    description: "A fully digital adaptation of the classic strategy board game with complex state management and interactive gameplay.",
    href: "https://sequence1-9f067z5e.b4a.run",
    localImage: "/screenshots/sequence.png",
    color1: "#1a1000",
    color2: "#4A3800",
  },
  {
    id: 7,
    name: "Clinicare Dashboard",
    year: "2025",
    tags: ["Healthcare", "Dashboard"],
    description: "A comprehensive healthcare management system for patient records, smart scheduling, and clinic operations.",
    href: "https://lockrhythmclinic.lovable.app/",
    localImage: "/screenshots/clinicare.png",
    color1: "#001018",
    color2: "#003A5C",
  },
  {
    id: 8,
    name: "Bakehers Shop",
    year: "2025",
    tags: ["E-commerce", "Brand"],
    description:
      "A warm, inviting storefront for an artisan bakery — built for easy browsing, seamless ordering, and a delightful customer experience.",
    href: "https://bakehers-shop.vercel.app/",
    localImage: "/screenshots/Bakers.png",
    color1: "#1a0a00",
    color2: "#3D1F00",
  },
];

const PX_STEPS = [0.02, 0.05, 0.06, 0.08, 1];

// ─── Single project card: clip reveal + pixel flipbook + scroll parallax ─────
function ProjectCard({ project, index }: { project: Project; index: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const cardRef = useRef<HTMLElement>(null);
  const stepRef = useRef(0);

  const { scrollYProgress } = useScroll({ target: cardRef, offset: ["start end", "end start"] });
  const imgY = useTransform(scrollYProgress, [0, 1], ["-4%", "4%"]);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const canvas = canvasRef.current;
    const card = cardRef.current;
    if (!canvas || !card) return;

    const ctx = canvas.getContext("2d")!;
    const W = canvas.width;
    const H = canvas.height;
    const source = document.createElement("canvas");
    source.width = W;
    source.height = H;
    const sCtx = source.getContext("2d")!;
    const temp = document.createElement("canvas");
    const tCtx = temp.getContext("2d")!;
    const timers: ReturnType<typeof setTimeout>[] = [];
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) stepRef.current = PX_STEPS.length - 1;

    const draw = (pct: number) => {
      if (pct >= 1) {
        ctx.imageSmoothingEnabled = true;
        ctx.clearRect(0, 0, W, H);
        ctx.drawImage(source, 0, 0);
        return;
      }
      const tw = Math.max(1, Math.ceil(W * pct));
      const th = Math.max(1, Math.ceil(H * pct));
      temp.width = tw;
      temp.height = th;
      tCtx.imageSmoothingEnabled = false;
      tCtx.drawImage(source, 0, 0, tw, th);
      ctx.imageSmoothingEnabled = false;
      ctx.clearRect(0, 0, W, H);
      ctx.drawImage(temp, 0, 0, tw, th, 0, 0, W, H);
    };

    const grad = sCtx.createLinearGradient(0, 0, W, H);
    grad.addColorStop(0, project.color1);
    grad.addColorStop(1, project.color2);
    sCtx.fillStyle = grad;
    sCtx.fillRect(0, 0, W, H);
    sCtx.font = `bold ${W / 14}px sans-serif`;
    sCtx.fillStyle = "rgba(255,255,255,0.07)";
    sCtx.textAlign = "center";
    sCtx.textBaseline = "middle";
    sCtx.fillText(project.name, W / 2, H / 2);
    draw(PX_STEPS[stepRef.current]);

    const playFlipbook = () => {
      if (stepRef.current >= PX_STEPS.length - 1) return draw(1);
      timers.push(
        setTimeout(() => {
          stepRef.current++;
          draw(PX_STEPS[stepRef.current]);
          playFlipbook();
        }, stepRef.current === 0 ? 450 : 90)
      );
    };

    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      // object-fit: cover, anchored to the top of the screenshot
      const s = Math.max(W / img.width, H / img.height);
      const dw = img.width * s;
      const dh = img.height * s;
      sCtx.clearRect(0, 0, W, H);
      sCtx.drawImage(img, (W - dw) / 2, 0, dw, dh);
      draw(PX_STEPS[stepRef.current]);
    };
    timers.push(
      setTimeout(() => {
        img.src = project.localImage || `/api/screenshot?url=${encodeURIComponent(project.href)}`;
      }, 150)
    );

    const trigger = ScrollTrigger.create({ trigger: card, start: "top 80%", once: true, onEnter: playFlipbook });

    return () => {
      trigger.kill();
      timers.forEach(clearTimeout);
    };
  }, [project]);

  return (
    <motion.article
      ref={cardRef}
      className="group"
      initial={{ opacity: 0, y: 60 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -10% 0px" }}
      transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
    >
      <Link
        href={project.href}
        target="_blank"
        rel="noopener noreferrer"
        data-cursor="View live"
        aria-label={`${project.name} — open live project`}
        className="block"
      >
        <motion.div
          className="relative overflow-hidden rounded-xl md:rounded-2xl border border-white/[0.06] bg-[#0a0c12]"
          initial={{ clipPath: "inset(18% 8% 18% 8% round 24px)" }}
          whileInView={{ clipPath: "inset(0% 0% 0% 0% round 16px)" }}
          viewport={{ once: true, margin: "0px 0px -10% 0px" }}
          transition={{ duration: 1.3, ease: [0.76, 0, 0.24, 1] }}
        >
          <div className="aspect-[16/10] overflow-hidden">
            <motion.div style={{ y: imgY }} className="h-full w-full scale-[1.09]">
              <canvas
                ref={canvasRef}
                width={960}
                height={600}
                className="block h-full w-full object-cover transition-transform duration-[1.2s] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.06]"
              />
            </motion.div>
          </div>

          {/* Hover veil */}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#040408]/90 via-[#040408]/10 to-transparent opacity-60 transition-opacity duration-500 group-hover:opacity-90" />

          {/* Tags */}
          <div className="absolute left-4 top-4 flex flex-wrap gap-2">
            {project.tags.map((t) => (
              <span
                key={t}
                className="rounded-full border border-white/15 bg-black/40 backdrop-blur-md px-3 py-1 text-[11px] font-medium text-[#E8EDF5]"
              >
                {t}
              </span>
            ))}
          </div>

          {/* Bottom bar inside the image */}
          <div className="absolute inset-x-4 bottom-4 flex items-end justify-between gap-4">
            <span className="font-mono text-[11px] tracking-[0.2em] text-[#8BAFC8]">
              {String(index + 1).padStart(2, "0")} — {project.year}
            </span>
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#E8EDF5] text-[#040408] text-lg translate-y-2 opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100 max-md:translate-y-0 max-md:opacity-100">
              ↗
            </span>
          </div>
        </motion.div>

        <div className="pt-5 px-1">
          <h3 className="font-display font-semibold text-[22px] md:text-[26px] tracking-[-0.03em] text-[#E8EDF5] flex items-center gap-3">
            <span className="link-underline">{project.name}</span>
          </h3>
          <p className="mt-2 max-w-[460px] text-[14px] md:text-[15px] leading-relaxed text-[#7D8BA0]">{project.description}</p>
        </div>
      </Link>
    </motion.article>
  );
}

// ─── Main Work section ────────────────────────────────────────────────────────
export default function WorkSection() {
  const left = projects.filter((_, i) => i % 2 === 0);
  const right = projects.filter((_, i) => i % 2 !== 0);

  return (
    <section id="work" className="relative bg-[#040408] px-5 md:px-12 lg:px-16 pt-24 md:pt-32 pb-24">
      <div className="mx-auto max-w-[1320px]">
        <SectionHeading
          index="01"
          label="Work"
          title="Selected"
          accent="work."
          intro="Real products we've designed, engineered and shipped — live and clickable. Every one started as a conversation like the one you could start today."
          right={
            <span className="font-mono text-[12px] tracking-[0.18em] uppercase text-[#5A6880] md:pb-3">
              ({String(projects.length).padStart(2, "0")}) Projects
            </span>
          }
        />

        {/* Mobile: single column. Desktop: staggered two columns. */}
        <div className="grid grid-cols-1 gap-16 md:grid-cols-2 md:gap-x-10 lg:gap-x-14">
          <div className="flex flex-col gap-16 md:gap-24">
            {left.map((p) => (
              <ProjectCard key={p.id} project={p} index={projects.indexOf(p)} />
            ))}
          </div>
          <div className="flex flex-col gap-16 md:gap-24 md:mt-48">
            {right.map((p) => (
              <ProjectCard key={p.id} project={p} index={projects.indexOf(p)} />
            ))}
          </div>
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="relative mt-28 overflow-hidden rounded-3xl border border-white/[0.07] p-8 md:p-14 flex flex-col md:flex-row md:items-center justify-between gap-8"
          style={{
            background:
              "radial-gradient(ellipse 80% 120% at 0% 0%, rgba(58,155,213,0.14), transparent 60%), radial-gradient(ellipse 60% 100% at 100% 100%, rgba(123,79,212,0.16), transparent 60%), #07080d",
          }}
        >
          <div>
            <p className="font-mono text-[11px] tracking-[0.2em] uppercase text-[#3A9BD5] mb-4">Your turn</p>
            <p className="font-display font-bold text-[clamp(28px,4vw,52px)] leading-[1.02] tracking-[-0.04em] text-[#E8EDF5] max-w-[640px]">
              Your product could be the next one on this page.
            </p>
          </div>
          <Magnetic>
            <Link href="/#contact" className="btn-primary">
              Let&apos;s talk <span className="btn-arrow">→</span>
            </Link>
          </Magnetic>
        </motion.div>
      </div>
    </section>
  );
}
