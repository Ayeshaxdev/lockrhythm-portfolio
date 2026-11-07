"use client";

import Marquee from "@/components/motion/Marquee";

const items = ["Web Engineering", "Mobile Apps", "UI/UX Design", "AI Solutions", "E-commerce", "Digital Marketing"];

export default function MarqueeStrip() {
  return (
    <div className="relative bg-[#040408] py-6 md:py-10 border-y border-white/[0.05] overflow-hidden" aria-hidden>
      <Marquee speed={45}>
        {items.map((t) => (
          <span
            key={t}
            className="flex items-center gap-8 md:gap-12 pr-8 md:pr-12 font-display font-bold text-[clamp(36px,6vw,84px)] leading-none tracking-[-0.04em] whitespace-nowrap"
          >
            <span className="text-transparent [-webkit-text-stroke:1px_rgba(232,237,245,0.35)] hover:text-[#E8EDF5] transition-colors duration-500">
              {t}
            </span>
            <span className="inline-block h-3 w-3 md:h-4 md:w-4 rotate-45 bg-gradient-to-br from-[#3A9BD5] to-[#7B4FD4]" />
          </span>
        ))}
      </Marquee>
    </div>
  );
}
