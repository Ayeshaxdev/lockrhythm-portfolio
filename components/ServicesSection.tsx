"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion } from "framer-motion";
import { selectService } from "@/lib/intro";
import { scrollToTarget } from "@/components/motion/SmoothScroll";

export const services = [
  {
    number: "01",
    key: "Web Engineering",
    title: "Web\nEngineering",
    desc: "End-to-end web systems engineered for performance at scale. From API architecture to pixel-perfect frontends, we ship products that hold up under pressure.",
    deliverables: ["Marketing sites & landing pages", "Web apps & dashboards", "E-commerce stores", "APIs & integrations"],
    accent: "#3A9BD5",
  },
  {
    number: "02",
    key: "Mobile App",
    title: "Mobile App\nDevelopment",
    desc: "Native mobile applications built for speed, reliability, and the brutally demanding standards of real users. No cross-platform shortcuts.",
    deliverables: ["iOS & Android apps", "App Store & Play launch", "Offline & push notifications", "Admin panels & backends"],
    accent: "#5A7FD4",
  },
  {
    number: "03",
    key: "UI/UX Design",
    title: "UI/UX\nDesign",
    desc: "Interfaces that feel like art but function like machines. We design for conversion first, aesthetics second — and still make them unforgettable.",
    deliverables: ["UX strategy & research", "Wireframes & prototypes", "Design systems", "Brand identity"],
    accent: "#7B4FD4",
  },
  {
    number: "04",
    key: "AI Solutions",
    title: "AI Software\nSolutions",
    desc: "We integrate AI where it earns its place: automation pipelines, predictive analytics, and systems that get smarter with every interaction.",
    deliverables: ["Chatbots & assistants", "Workflow automation", "LLM integrations", "Predictive analytics"],
    accent: "#5A6FD4",
  },
  {
    number: "05",
    key: "Digital Marketing",
    title: "Digital\nMarketing",
    desc: "Strategy-first digital campaigns backed by data. We don't guess at what works — we measure it, iterate, and scale what converts.",
    deliverables: ["SEO & content", "Paid social & ads", "Analytics & CRO", "Launch campaigns"],
    accent: "#3A9BD5",
  },
];

function discuss(service: string) {
  selectService(service);
  scrollToTarget("#contact");
}

function ServiceCard({ svc }: { svc: (typeof services)[number] }) {
  const ref = useRef<HTMLDivElement>(null);
  const onMove = (e: React.PointerEvent) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    el.style.setProperty("--mx", `${e.clientX - r.left}px`);
    el.style.setProperty("--my", `${e.clientY - r.top}px`);
  };

  return (
    <div
      ref={ref}
      onPointerMove={onMove}
      data-svc-card
      className="svc-card group relative flex flex-col gap-6 shrink-0 w-full lg:w-[400px] min-h-[460px] rounded-2xl border border-white/[0.08] bg-white/[0.02] p-8 md:p-10 overflow-hidden will-change-transform"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{ background: `radial-gradient(420px circle at var(--mx) var(--my), ${svc.accent}22, transparent 60%)` }}
      />
      <div className="relative flex items-center justify-between">
        <span className="font-mono text-[12px] tracking-[0.2em]" style={{ color: svc.accent }}>
          {svc.number}
        </span>
        <span
          className="h-[2px] w-8 rounded transition-all duration-700 group-hover:w-24"
          style={{ background: svc.accent }}
        />
      </div>
      <h3 className="relative font-display font-bold text-[30px] md:text-[34px] leading-[1.02] tracking-[-0.035em] text-[#E8EDF5] whitespace-pre-line">
        {svc.title}
      </h3>
      <p className="relative text-[14px] leading-[1.75] text-[#8A99AD]">{svc.desc}</p>
      <ul className="relative mt-auto flex flex-col gap-2.5 border-t border-white/[0.06] pt-5">
        {svc.deliverables.map((d) => (
          <li key={d} className="flex items-center gap-3 text-[13px] text-[#B4C0CE]">
            <span className="h-1 w-1 rounded-full" style={{ background: svc.accent }} />
            {d}
          </li>
        ))}
      </ul>
      <button
        type="button"
        onClick={() => discuss(svc.key)}
        className="relative inline-flex items-center gap-2 self-start text-[14px] font-semibold text-[#E8EDF5]"
      >
        <span className="link-underline">Discuss this</span>
        <span className="transition-transform duration-500 group-hover:translate-x-1">→</span>
      </button>
    </div>
  );
}

export default function ServicesSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const section = sectionRef.current;
    const track = trackRef.current;
    if (!section || !track) return;

    const mm = gsap.matchMedia();
    mm.add("(min-width: 1024px) and (prefers-reduced-motion: no-preference)", () => {
      const cards = gsap.utils.toArray<HTMLElement>("[data-svc-card]", track);
      const skew = cards.map((c) => gsap.quickTo(c, "skewX", { duration: 0.6, ease: "power3.out" }));
      const amount = () => -(track.scrollWidth - window.innerWidth);

      const tween = gsap.to(track, {
        x: amount,
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: () => `+=${Math.abs(amount())}`,
          pin: true,
          scrub: 1,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate(self) {
            const s = gsap.utils.clamp(-10, 10, self.getVelocity() / 300);
            skew.forEach((fn) => fn(s));
            if (barRef.current) barRef.current.style.transform = `scaleX(${self.progress})`;
          },
          onScrubComplete: () => skew.forEach((fn) => fn(0)),
        },
      });

      // Cards rise in as they enter from the right
      cards.forEach((card) => {
        gsap.from(card, {
          y: 80,
          rotate: 3,
          opacity: 0.2,
          ease: "power2.out",
          scrollTrigger: {
            trigger: card,
            containerAnimation: tween,
            start: "left 95%",
            end: "left 60%",
            scrub: true,
          },
        });
      });
    });

    return () => mm.revert();
  }, []);

  return (
    <section id="services" ref={sectionRef} className="relative bg-[#040408] overflow-hidden lg:h-screen">
      {/* Ghost backdrop */}
      <div
        aria-hidden
        className="pointer-events-none select-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 whitespace-nowrap font-display font-bold text-[14.5vw] tracking-[-0.02em] text-transparent [-webkit-text-stroke:1px_rgba(255,255,255,0.06)] hidden lg:block"
      >
        EXPERTISE
      </div>

      <div className="lg:flex lg:h-full lg:flex-col">
        {/* Heading */}
        <div className="relative z-10 px-5 md:px-12 lg:px-16 pt-20 lg:pt-12">
          <motion.span
            className="block font-mono text-[11px] tracking-[0.2em] uppercase text-[#3A9BD5] mb-6"
            initial={{ opacity: 0, x: -16 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            02 / Services
          </motion.span>
          <motion.div
            className="h-px mb-8 origin-left"
            style={{ background: "linear-gradient(90deg, #3A9BD5 0%, #7B4FD4 50%, transparent 100%)" }}
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.4, ease: [0.65, 0, 0.35, 1] }}
          />
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
            <h2 className="font-display font-bold text-[clamp(40px,5vw,72px)] leading-[0.95] tracking-[-0.045em] text-[#E8EDF5]">
              What we <span className="text-gradient">do best.</span>
            </h2>
            <p className="max-w-md text-[15px] leading-relaxed text-[#8A99AD]">
              One team for strategy, design, engineering and growth — so nothing gets lost between agencies.
            </p>
          </div>
        </div>

        {/* Track */}
        <div className="relative z-[5] flex-1 flex items-center">
          <div
            ref={trackRef}
            className="flex flex-col lg:flex-row gap-5 lg:gap-8 px-5 md:px-12 lg:px-16 py-12 lg:py-0 lg:w-max"
          >
            {services.map((svc) => (
              <ServiceCard key={svc.number} svc={svc} />
            ))}

            {/* Closing card */}
            <div
              data-svc-card
              className="relative flex flex-col justify-between shrink-0 w-full lg:w-[400px] min-h-[300px] lg:min-h-[460px] rounded-2xl p-8 md:p-10 overflow-hidden"
              style={{ background: "linear-gradient(145deg, #3A9BD5 0%, #7B4FD4 100%)" }}
            >
              <span className="font-mono text-[12px] tracking-[0.2em] text-white/70">06</span>
              <div>
                <h3 className="font-display font-bold text-[32px] md:text-[38px] leading-[1] tracking-[-0.04em] text-white">
                  Not sure what you need?
                </h3>
                <p className="mt-4 text-[15px] leading-relaxed text-white/80">
                  Tell us the problem. We&apos;ll come back with a plan, a timeline and a clear quote — free.
                </p>
              </div>
              <button
                type="button"
                onClick={() => discuss("Not sure yet")}
                className="mt-8 inline-flex items-center gap-3 self-start rounded-full bg-[#040408] px-6 py-3.5 text-[14px] font-semibold text-white transition-transform duration-300 hover:scale-[1.04]"
              >
                Get a free plan <span>→</span>
              </button>
            </div>
          </div>
        </div>

        {/* Horizontal progress */}
        <div className="hidden lg:block relative z-10 mx-16 mb-10 h-px bg-white/[0.08]">
          <div
            ref={barRef}
            className="h-full origin-left bg-gradient-to-r from-[#3A9BD5] to-[#7B4FD4]"
            style={{ transform: "scaleX(0)" }}
          />
        </div>
      </div>
    </section>
  );
}
