"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import Marquee from "@/components/motion/Marquee";
import { scrollToTarget } from "@/components/motion/SmoothScroll";
import WhatsAppIcon from "@/components/motion/WhatsAppIcon";
import { EMAIL, WHATSAPP_DISPLAY, whatsappHref } from "@/lib/contact";

const NAV = [
  { label: "Work", href: "/#work" },
  { label: "Services", href: "/#services" },
  { label: "Process", href: "/#studio" },
  { label: "About", href: "/#about" },
  { label: "FAQ", href: "/#faq" },
  { label: "Contact", href: "/#contact" },
];

const SOCIALS = [
  { label: "Instagram", href: "https://www.instagram.com/lockrhythm/" },
  { label: "LinkedIn", href: "https://www.linkedin.com/company/lockrythm" },
  { label: "X / Twitter", href: "https://x.com/lockrythm" },
  { label: "Facebook", href: "https://www.facebook.com/lockrhythm" },
  { label: "TikTok", href: "https://www.tiktok.com/@lockrhythm" },
];

export function Footer() {
  return (
    <footer className="relative bg-[#040408] border-t border-white/[0.06] overflow-hidden">
      {/* Giant CTA marquee */}
      <Link href="/#contact" className="group block py-10 md:py-16" data-cursor="Let's talk">
        <Marquee speed={60}>
          {Array.from({ length: 3 }).map((_, i) => (
            <span
              key={i}
              className="flex items-center gap-10 pr-10 font-display font-bold text-[clamp(64px,12vw,200px)] leading-none tracking-[-0.05em] whitespace-nowrap"
            >
              <span className="text-[#E8EDF5] transition-colors duration-700 group-hover:text-transparent group-hover:[-webkit-text-stroke:1.5px_#E8EDF5]">
                Start a project
              </span>
              <span className="inline-flex h-[0.7em] w-[0.7em] items-center justify-center rounded-full bg-gradient-to-br from-[#3A9BD5] to-[#7B4FD4] text-[0.45em] text-white transition-transform duration-700 group-hover:rotate-[-45deg]">
                →
              </span>
            </span>
          ))}
        </Marquee>
      </Link>

      <div className="mx-auto max-w-[1320px] px-5 md:px-12 lg:px-16 pb-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="grid gap-12 border-t border-white/[0.06] pt-14 md:grid-cols-[1.4fr_1fr_1fr_1fr]"
        >
          <div>
            <Link href="/" className="flex items-center" aria-label="LockRhythm home">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/transparent-image.png" alt="" className="h-14 w-14 object-contain" />
              <span className="font-display font-bold text-[22px] tracking-[-0.03em] text-[#E8EDF5] -ml-1">
                Lock<span className="text-[#8BAFC8]">rhythm</span>
              </span>
            </Link>
            <p className="mt-4 max-w-[300px] text-[14px] leading-relaxed text-[#7D8BA0]">
              Websites, apps and AI tools engineered to win customers. Built in Sahiwal, shipped worldwide.
            </p>
            <p className="mt-6 inline-flex items-center gap-2 rounded-full border border-white/10 px-3 py-1.5 text-[12px] text-[#A9B6C6]">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" /> Available for new projects
            </p>
          </div>

          <div>
            <p className="mb-5 font-mono text-[11px] tracking-[0.2em] uppercase text-[#5A6880]">Explore</p>
            <ul className="flex flex-col gap-3">
              {NAV.map((n) => (
                <li key={n.label}>
                  <Link href={n.href} className="link-underline text-[15px] text-[#C4CEDA] hover:text-white">
                    {n.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="mb-5 font-mono text-[11px] tracking-[0.2em] uppercase text-[#5A6880]">Follow</p>
            <ul className="flex flex-col gap-3">
              {SOCIALS.map((s) => (
                <li key={s.label}>
                  <a
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="link-underline text-[15px] text-[#C4CEDA] hover:text-white"
                  >
                    {s.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="mb-5 font-mono text-[11px] tracking-[0.2em] uppercase text-[#5A6880]">Say hello</p>
            <a href={`mailto:${EMAIL}`} className="link-underline text-[15px] text-[#E8EDF5]">
              {EMAIL}
            </a>
            <a
              href={whatsappHref()}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 flex items-center gap-2 text-[15px] text-[#C4CEDA] hover:text-white"
            >
              <WhatsAppIcon className="h-4 w-4 text-[#25D366]" />
              <span className="link-underline">{WHATSAPP_DISPLAY}</span>
            </a>
            <p className="mt-3 text-[14px] text-[#7D8BA0]">Sahiwal, Pakistan</p>
          </div>
        </motion.div>

        <div className="mt-14 flex flex-col-reverse gap-4 sm:flex-row sm:items-center sm:justify-between border-t border-white/[0.06] pt-6 font-mono text-[11px] tracking-[0.15em] uppercase text-[#5A6880]">
          <span>© {new Date().getFullYear()} LockRhythm. All rights reserved.</span>
          <button
            type="button"
            onClick={() => scrollToTarget("#home")}
            className="group inline-flex items-center gap-2 self-start hover:text-white"
          >
            Back to top
            <span className="inline-block transition-transform duration-500 group-hover:-translate-y-1">↑</span>
          </button>
        </div>
      </div>
    </footer>
  );
}
