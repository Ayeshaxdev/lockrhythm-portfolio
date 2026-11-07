"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { motion, useScroll, useTransform, useMotionValue, useSpring } from "framer-motion";
import RevealText from "@/components/motion/RevealText";
import Magnetic from "@/components/motion/Magnetic";
import { useIntroDone } from "@/lib/intro";

type P = { x: number; y: number; vx: number; vy: number; speed: number; opacity: number; fadeAt: number; color: string; size: number };

const COLORS = ["#3A9BD5", "#3A9BD5", "#3A9BD5", "#7B4FD4", "#7B4FD4", "#E8EDF5"];

export function ParticleHero() {
  const sectionRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [altMode, setAltMode] = useState(false);
  const play = useIntroDone();

  // Scroll-out: content drifts up and fades, spotlight stretches.
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start start", "end start"] });
  const contentY = useTransform(scrollYProgress, [0, 1], ["0%", "-35%"]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);
  const contentScale = useTransform(scrollYProgress, [0, 1], [1, 0.92]);
  const beamScale = useTransform(scrollYProgress, [0, 1], [1, 1.5]);

  // Pointer parallax for the spotlight rig.
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 60, damping: 20 });
  const sy = useSpring(my, { stiffness: 60, damping: 20 });
  const rigX = useTransform(sx, (v) => v * 30);
  const rigRotate = useTransform(sx, (v) => v * -4);
  const glowX = useTransform(sx, (v) => `${50 + v * 20}%`);
  const glowY = useTransform(sy, (v) => `${40 + v * 15}%`);

  useEffect(() => {
    const canvas = canvasRef.current;
    const section = sectionRef.current;
    if (!canvas || !section) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let w = 0;
    let h = 0;
    let particles: P[] = [];
    let raf = 0;
    let running = true;
    const mouse = { x: -9999, y: -9999 };

    const spawn = (p: Partial<P> = {}): P => ({
      x: Math.random() * w,
      y: Math.random() * h,
      vx: 0,
      vy: 0,
      speed: Math.random() / 4 + 0.08,
      opacity: 0,
      fadeAt: performance.now() + Math.random() * 6000 + 1500,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      size: Math.random() * 1.4 + 0.6,
      ...p,
    });

    const resize = () => {
      w = section.clientWidth;
      h = section.clientHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = Math.floor((w * h) / 5500);
      particles = Array.from({ length: count }, () => spawn());
    };

    const frame = (now: number) => {
      ctx.clearRect(0, 0, w, h);
      for (const p of particles) {
        // gentle repel from the pointer
        const dx = p.x - mouse.x;
        const dy = p.y - mouse.y;
        const d2 = dx * dx + dy * dy;
        if (d2 < 140 * 140) {
          const d = Math.sqrt(d2) || 1;
          const f = (1 - d / 140) * 0.9;
          p.vx += (dx / d) * f;
          p.vy += (dy / d) * f;
        }
        p.vx *= 0.92;
        p.vy *= 0.92;
        p.x += p.vx;
        p.y += p.vy - p.speed;

        if (now < p.fadeAt) p.opacity = Math.min(1, p.opacity + 0.02);
        else p.opacity -= 0.01;

        if (p.y < -5 || p.opacity <= 0 || p.x < -10 || p.x > w + 10) {
          Object.assign(p, spawn({ y: h * (0.3 + Math.random() * 0.7) }));
        }

        ctx.globalAlpha = Math.max(0, p.opacity);
        ctx.fillStyle = p.color;
        ctx.fillRect(p.x, p.y, p.size, p.size * 1.8);
      }
      ctx.globalAlpha = 1;
      if (running) raf = requestAnimationFrame(frame);
    };

    resize();
    if (reduce) {
      particles.forEach((p) => (p.opacity = 0.7));
      frame(0);
      running = false;
    } else {
      raf = requestAnimationFrame(frame);
    }

    // Pause the loop when the hero is off screen.
    const io = new IntersectionObserver(([e]) => {
      if (reduce) return;
      if (e.isIntersecting && !running) {
        running = true;
        raf = requestAnimationFrame(frame);
      } else if (!e.isIntersecting) {
        running = false;
        cancelAnimationFrame(raf);
      }
    });
    io.observe(section);

    const onMove = (e: PointerEvent) => {
      const r = section.getBoundingClientRect();
      mouse.x = e.clientX - r.left;
      mouse.y = e.clientY - r.top;
      mx.set((e.clientX / window.innerWidth) * 2 - 1);
      my.set((e.clientY / window.innerHeight) * 2 - 1);
    };
    const onLeave = () => {
      mouse.x = -9999;
      mouse.y = -9999;
    };
    section.addEventListener("pointermove", onMove);
    section.addEventListener("pointerleave", onLeave);
    window.addEventListener("resize", resize);

    return () => {
      running = false;
      cancelAnimationFrame(raf);
      io.disconnect();
      section.removeEventListener("pointermove", onMove);
      section.removeEventListener("pointerleave", onLeave);
      window.removeEventListener("resize", resize);
    };
  }, [mx, my]);

  const beam = altMode
    ? "conic-gradient(from 0deg at 50% -5%, transparent 45%, rgba(123,79,212,0.4) 49%, rgba(232,237,245,0.2) 50%, rgba(123,79,212,0.4) 51%, transparent 55%)"
    : "conic-gradient(from 0deg at 50% -5%, transparent 45%, rgba(27,108,168,0.4) 49%, rgba(58,155,213,0.2) 50%, rgba(27,108,168,0.4) 51%, transparent 55%)";

  const ease = [0.16, 1, 0.3, 1] as const;

  return (
    <section
      ref={sectionRef}
      id="home"
      className="relative h-[100svh] min-h-[640px] w-full overflow-hidden bg-[#040408]"
    >
      {/* Pointer-following ambient glow */}
      <motion.div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={
          {
            "--gx": glowX,
            "--gy": glowY,
            background: `radial-gradient(600px circle at var(--gx) var(--gy), ${
              altMode ? "rgba(123,79,212,0.12)" : "rgba(58,155,213,0.09)"
            }, transparent 60%)`,
          } as unknown as React.CSSProperties
        }
      />

      {/* Spotlight rig */}
      <motion.div
        aria-hidden
        className="absolute inset-x-0 top-0 h-full pointer-events-none"
        style={{ x: rigX, rotate: rigRotate, scaleY: beamScale, transformOrigin: "50% 0%" }}
      >
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="absolute left-1/2 top-[1em] -ml-[min(15vw,220px)] w-[min(30vw,440px)] min-w-[260px] h-[86vh] rounded-b-[50%] origin-top"
            style={{ backgroundImage: beam, filter: "blur(15px)", transition: "background-image 0.6s" }}
            initial={{ opacity: 0, scale: 0, rotate: 0 }}
            animate={
              play
                ? {
                    opacity: [0, 0.85, 0.65, 0.9, 0.7],
                    scale: [0, 1.1, 1.25, 1.15, 1.05],
                    rotate: i === 0 ? [20, 18, 22, 19, 20] : i === 1 ? [-20, -22, -18, -21, -20] : [0, 2, -2, 1, 0],
                  }
                : undefined
            }
            transition={{
              duration: [17, 14, 21][i],
              times: [0, 0.12, 0.45, 0.75, 1],
              repeat: Infinity,
              repeatType: "mirror",
              ease: "easeInOut",
            }}
          />
        ))}
      </motion.div>

      {/* The orb — click it to shift the light (kept as an easter egg) */}
      <motion.button
        type="button"
        aria-label="Toggle spotlight colour"
        onClick={() => setAltMode((v) => !v)}
        data-cursor="Flip"
        initial={{ scale: 0, opacity: 0 }}
        animate={play ? { scale: 1, opacity: 1 } : undefined}
        transition={{ duration: 1.2, ease, delay: 0.2 }}
        whileHover={{ scale: 1.15 }}
        className="absolute left-1/2 top-[88px] -ml-6 w-12 h-12 rounded-full bg-[#040408] z-20"
        style={{
          border: `1px solid ${altMode ? "#7B4FD4" : "#1B6CA8"}`,
          boxShadow: altMode ? "0 0 28px #7B4FD4, inset 0 0 12px rgba(123,79,212,0.6)" : "0 0 24px #3A9BD5, inset 0 0 12px rgba(58,155,213,0.4)",
          transition: "box-shadow 0.5s, border-color 0.5s",
        }}
      />

      <canvas ref={canvasRef} aria-hidden className="absolute inset-0 pointer-events-none z-[1]" />

      {/* Content */}
      <motion.div
        style={{ y: contentY, opacity: contentOpacity, scale: contentScale }}
        className="relative z-10 flex flex-col items-center justify-center h-full px-5 pt-28 text-center"
      >
        <motion.div
          initial={{ opacity: 0, y: 16, filter: "blur(6px)" }}
          animate={play ? { opacity: 1, y: 0, filter: "blur(0px)" } : undefined}
          transition={{ duration: 0.9, ease, delay: 0.1 }}
          className="mb-7 inline-flex items-center gap-2.5 rounded-full border border-white/10 bg-white/[0.03] backdrop-blur px-4 py-1.5 text-[12px] md:text-[13px] text-[#A9B6C6]"
        >
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75 animate-ping" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
          </span>
          Now booking new projects
        </motion.div>

        <RevealText
          as="h1"
          play={play}
          delay={0.2}
          stagger={0.07}
          segments={[
            "We Build",
            { text: "", br: true },
            { text: "Digital Experiences", className: "text-gradient" },
            { text: "", br: true },
            "That Win.",
          ]}
          className="font-display font-bold text-[clamp(44px,8.4vw,120px)] leading-[0.98] tracking-[-0.045em] text-[#E8EDF5]"
        />

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={play ? { opacity: 1, y: 0 } : undefined}
          transition={{ duration: 1, ease, delay: 0.75 }}
          className="mt-7 max-w-[620px] text-[16px] md:text-[19px] leading-relaxed text-[#9AA8BA]"
        >
          We design and engineer websites, apps and AI tools that turn visitors into paying customers —
          from first sketch to launch day.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={play ? { opacity: 1, y: 0 } : undefined}
          transition={{ duration: 1, ease, delay: 0.9 }}
          className="mt-10 flex flex-col sm:flex-row items-center gap-3 sm:gap-4"
        >
          <Magnetic>
            <Link href="/#contact" className="btn-primary">
              Start your project <span className="btn-arrow">→</span>
            </Link>
          </Magnetic>
          <Magnetic strength={0.25}>
            <Link href="/#work" className="btn-ghost">
              See our work
            </Link>
          </Magnetic>
        </motion.div>

        <motion.ul
          initial="hidden"
          animate={play ? "show" : "hidden"}
          variants={{ show: { transition: { staggerChildren: 0.08, delayChildren: 1.1 } } }}
          className="mt-12 flex flex-wrap justify-center gap-x-6 gap-y-2 font-mono text-[11px] tracking-[0.18em] uppercase text-[#5A6880]"
        >
          {["Web", "Mobile", "UI/UX", "AI", "Growth"].map((t) => (
            <motion.li
              key={t}
              variants={{ hidden: { opacity: 0, y: 8 }, show: { opacity: 1, y: 0 } }}
              className="flex items-center gap-2"
            >
              <span className="h-1 w-1 rounded-full bg-[#3A9BD5]" />
              {t}
            </motion.li>
          ))}
        </motion.ul>
      </motion.div>

      {/* Scroll cue */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={play ? { opacity: 1 } : undefined}
        transition={{ delay: 1.6, duration: 1 }}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 hidden md:[@media(min-height:820px)]:flex flex-col items-center gap-2"
        aria-hidden
      >
        <span className="font-mono text-[10px] tracking-[0.3em] text-[#5A6880]">SCROLL</span>
        <span className="relative block h-10 w-[1px] overflow-hidden bg-white/10">
          <motion.span
            className="absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-transparent to-[#3A9BD5]"
            animate={{ y: ["-100%", "200%"] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
          />
        </span>
      </motion.div>

      {/* Fade into the next section */}
      <div aria-hidden className="absolute bottom-0 inset-x-0 h-40 bg-gradient-to-b from-transparent to-[#040408] z-[5] pointer-events-none" />
    </section>
  );
}
