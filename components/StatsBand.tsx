"use client";

import { useEffect, useRef, useState } from "react";
import { animate, motion, useInView } from "framer-motion";

const stats = [
  { value: 8, suffix: "+", label: "Live products shipped", note: "All clickable above" },
  { value: 5, suffix: "", label: "Disciplines, one team", note: "Strategy → design → code → growth" },
  { value: 24, suffix: "h", label: "Reply time", note: "Real humans, not a ticket queue" },
  { value: 0, suffix: "", label: "Agencies to juggle", note: "One point of contact, start to finish" },
];

function Counter({ to, suffix }: { to: number; suffix: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-15% 0px" });
  const [v, setV] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const c = animate(0, to, { duration: 1.8, ease: [0.16, 1, 0.3, 1], onUpdate: (x) => setV(Math.round(x)) });
    return () => c.stop();
  }, [inView, to]);

  return (
    <span ref={ref} className="tabular-nums">
      {to === 24 && <span className="text-[0.5em] align-top mr-1 text-[#3A9BD5]">&lt;</span>}
      {v}
      <span className="text-gradient">{suffix}</span>
    </span>
  );
}

export default function StatsBand() {
  return (
    <section className="relative bg-[#040408] px-5 md:px-12 lg:px-16 py-16 md:py-24">
      <div className="mx-auto max-w-[1320px] grid grid-cols-2 lg:grid-cols-4 border-t border-l border-white/[0.06]">
        {stats.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="group relative border-r border-b border-white/[0.06] p-6 md:p-10 overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-[#3A9BD5]/0 to-[#7B4FD4]/0 transition-colors duration-700 group-hover:from-[#3A9BD5]/[0.06] group-hover:to-[#7B4FD4]/[0.08]" />
            <div className="relative font-display font-bold text-[clamp(48px,7vw,96px)] leading-none tracking-[-0.05em] text-[#E8EDF5]">
              <Counter to={s.value} suffix={s.suffix} />
            </div>
            <p className="relative mt-4 text-[14px] md:text-[16px] font-semibold text-[#E8EDF5]">{s.label}</p>
            <p className="relative mt-1 text-[12px] md:text-[13px] text-[#7D8BA0]">{s.note}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
