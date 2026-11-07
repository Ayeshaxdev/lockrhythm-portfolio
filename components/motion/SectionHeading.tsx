"use client";

import { motion } from "framer-motion";
import RevealText from "./RevealText";
import type { ReactNode } from "react";

/** The shared "01 / Work — gradient rule — big title" header used across sections. */
export default function SectionHeading({
  index,
  label,
  title,
  accent,
  intro,
  right,
}: {
  index: string;
  label: string;
  title: string;
  accent?: string;
  intro?: ReactNode;
  right?: ReactNode;
}) {
  return (
    <div className="mb-12 md:mb-16">
      <motion.span
        className="block font-mono text-[11px] tracking-[0.2em] uppercase text-[#3A9BD5] mb-7"
        initial={{ opacity: 0, x: -16 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      >
        {index} / {label}
      </motion.span>
      <motion.div
        className="h-px mb-10 md:mb-12 origin-left"
        style={{ background: "linear-gradient(90deg, #3A9BD5 0%, #7B4FD4 50%, transparent 100%)" }}
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.4, ease: [0.65, 0, 0.35, 1] }}
      />
      <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div>
          <RevealText
            segments={[title, ...(accent ? [{ text: accent, className: "text-gradient" }] : [])]}
            className="font-display font-bold text-[clamp(44px,7vw,96px)] leading-[0.95] tracking-[-0.045em] text-[#E8EDF5] m-0"
          />
          {intro && (
            <motion.p
              className="mt-6 max-w-xl text-[15px] md:text-[17px] leading-relaxed text-[#8A99AD]"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            >
              {intro}
            </motion.p>
          )}
        </div>
        {right}
      </div>
    </div>
  );
}
