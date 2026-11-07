"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { CSSProperties } from "react";

type Segment = string | { text: string; className?: string; style?: CSSProperties; br?: boolean };
type Tag = "h1" | "h2" | "h3" | "p" | "div" | "span";

const word = {
  hidden: { y: "115%", rotate: 4 },
  show: (i: number) => ({
    y: "0%",
    rotate: 0,
    transition: { duration: 1, ease: [0.16, 1, 0.3, 1] as const, delay: i },
  }),
};

/**
 * Word-by-word masked reveal. Each word slides up out of an overflow-hidden slot.
 * `play` lets a parent drive it (e.g. wait for the preloader); otherwise it plays when
 * the whole heading scrolls into view (observed on the heading, not the clipped words).
 */
export default function RevealText({
  segments,
  as = "h2",
  className,
  style,
  delay = 0,
  stagger = 0.06,
  play,
}: {
  segments: Segment[];
  as?: Tag;
  className?: string;
  style?: CSSProperties;
  delay?: number;
  stagger?: number;
  play?: boolean;
}) {
  const reduce = useReducedMotion();
  const MotionTag = motion[as];
  const ariaLabel = segments
    .map((s) => (typeof s === "string" ? s : s.text))
    .filter(Boolean)
    .join(" ");

  const trigger =
    typeof play === "boolean"
      ? { animate: play ? "show" : "hidden" }
      : { whileInView: "show", viewport: { once: true, margin: "0px 0px -10% 0px" } };

  let index = 0;

  return (
    <MotionTag
      className={className}
      style={style}
      aria-label={ariaLabel}
      initial={reduce ? false : "hidden"}
      {...trigger}
    >
      {segments.map((seg, si) => {
        const s = typeof seg === "string" ? { text: seg } : seg;
        if (s.br) return <br key={`br-${si}`} />;
        return s.text
          .split(" ")
          .filter(Boolean)
          .map((w, wi) => {
            const i = index++;
            return (
              <span
                key={`${si}-${wi}`}
                aria-hidden
                style={{
                  display: "inline-block",
                  overflow: "hidden",
                  verticalAlign: "top",
                  paddingBottom: "0.08em",
                  marginBottom: "-0.08em",
                }}
              >
                <motion.span
                  className={s.className}
                  style={{ display: "inline-block", transformOrigin: "0 100%", ...s.style }}
                  variants={word}
                  custom={delay + i * stagger}
                >
                  {w}
                  {" "}
                </motion.span>
              </span>
            );
          });
      })}
    </MotionTag>
  );
}
