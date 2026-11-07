"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import Magnetic from "@/components/motion/Magnetic";
import { getLenis } from "@/components/motion/SmoothScroll";
import { useIntroDone } from "@/lib/intro";

const navLinks = [
  { label: "Work", href: "/#work", id: "work" },
  { label: "Services", href: "/#services", id: "services" },
  { label: "Process", href: "/#studio", id: "studio" },
  { label: "About", href: "/#about", id: "about" },
  { label: "FAQ", href: "/#faq", id: "faq" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState("");
  const introDone = useIntroDone();

  // Hide on scroll down, reveal on scroll up.
  useEffect(() => {
    let last = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 40);
      if (Math.abs(y - last) > 6) {
        setHidden(y > last && y > window.innerHeight * 0.6);
        last = y;
      }
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Highlight the section currently in view.
  useEffect(() => {
    const ids = [...navLinks.map((l) => l.id), "contact"];
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(e.target.id);
        });
      },
      { rootMargin: "-45% 0px -50% 0px" }
    );
    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) io.observe(el);
    });
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    const lenis = getLenis();
    if (open) {
      document.body.style.overflow = "hidden";
      lenis?.stop();
    } else {
      document.body.style.overflow = "";
      lenis?.start();
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <>
      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={introDone ? { y: hidden && !open ? -110 : 0, opacity: 1 } : undefined}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="fixed top-0 left-0 right-0 z-[100] px-4 md:px-8 pt-4"
      >
        <nav
          className={`mx-auto max-w-[1400px] flex items-center justify-between rounded-full pl-2 pr-2 md:pr-2 h-[64px] transition-all duration-500 ${
            scrolled && !open
              ? "bg-[#07080d]/70 backdrop-blur-xl border border-white/[0.07] shadow-[0_10px_40px_-15px_rgba(0,0,0,0.8)]"
              : "bg-transparent border border-transparent"
          }`}
          aria-label="Main"
        >
          <Link href="/" className="flex items-center group" onClick={() => setOpen(false)} aria-label="LockRhythm home">
            <span className="w-[52px] h-[52px] flex items-center justify-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/transparent-image.png"
                alt=""
                className="w-full h-full object-contain transition-transform duration-700 group-hover:rotate-[360deg]"
              />
            </span>
            <span className="font-display font-bold text-[20px] md:text-[22px] tracking-[-0.03em] text-[#E8EDF5] -ml-1">
              Lock<span className="text-[#8BAFC8]">rhythm</span>
            </span>
          </Link>

          <ul className="hidden lg:flex items-center gap-1 rounded-full border border-white/[0.06] bg-white/[0.02] p-1">
            {navLinks.map((l) => (
              <li key={l.id} className="relative">
                <Link
                  href={l.href}
                  className={`relative z-10 block px-4 py-2 text-[14px] font-medium transition-colors duration-300 ${
                    active === l.id ? "text-[#040408]" : "text-[#A9B6C6] hover:text-white"
                  }`}
                >
                  {l.label}
                </Link>
                {active === l.id && (
                  <motion.span
                    layoutId="nav-pill"
                    className="absolute inset-0 rounded-full bg-[#E8EDF5]"
                    transition={{ type: "spring", stiffness: 380, damping: 32 }}
                  />
                )}
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-2">
            <Magnetic className="hidden sm:inline-block">
              <Link href="/#contact" className="btn-primary !py-3 !px-5 !text-[14px]">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75 animate-ping" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
                </span>
                Start a project
              </Link>
            </Magnetic>

            <button
              onClick={() => setOpen(!open)}
              className="lg:hidden relative w-12 h-12 rounded-full flex flex-col items-center justify-center gap-[5px] border border-white/10"
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
            >
              <motion.span
                animate={open ? { rotate: 45, y: 6.5 } : { rotate: 0, y: 0 }}
                className="block w-5 h-[1.5px] bg-[#E8EDF5]"
              />
              <motion.span animate={open ? { opacity: 0 } : { opacity: 1 }} className="block w-5 h-[1.5px] bg-[#E8EDF5]" />
              <motion.span
                animate={open ? { rotate: -45, y: -6.5 } : { rotate: 0, y: 0 }}
                className="block w-5 h-[1.5px] bg-[#E8EDF5]"
              />
            </button>
          </div>
        </nav>
      </motion.header>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ clipPath: "circle(0% at calc(100% - 48px) 48px)" }}
            animate={{ clipPath: "circle(150% at calc(100% - 48px) 48px)" }}
            exit={{ clipPath: "circle(0% at calc(100% - 48px) 48px)" }}
            transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
            className="fixed inset-0 z-[99] bg-[#040408] flex flex-col justify-center px-8 md:px-16"
          >
            <div
              aria-hidden
              className="absolute inset-0 pointer-events-none"
              style={{
                background:
                  "radial-gradient(ellipse 60% 50% at 80% 10%, rgba(123,79,212,0.18), transparent 70%), radial-gradient(ellipse 50% 50% at 10% 90%, rgba(58,155,213,0.15), transparent 70%)",
              }}
            />
            <ul className="relative">
              {[...navLinks, { label: "Contact", href: "/#contact", id: "contact" }].map((link, i) => (
                <li key={link.id} className="overflow-hidden">
                  <motion.div
                    initial={{ y: "110%" }}
                    animate={{ y: 0 }}
                    exit={{ y: "110%" }}
                    transition={{ duration: 0.7, delay: 0.15 + i * 0.06, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <Link
                      href={link.href}
                      onClick={() => setOpen(false)}
                      className="group flex items-baseline gap-4 py-1 font-display font-bold text-[clamp(40px,10vw,84px)] leading-[1.05] tracking-[-0.04em] text-[#E8EDF5]"
                    >
                      <span className="font-mono text-[12px] tracking-[0.2em] text-[#3A9BD5]">0{i + 1}</span>
                      <span className="transition-transform duration-500 group-hover:translate-x-3 group-hover:text-[#8BAFC8]">
                        {link.label}
                      </span>
                    </Link>
                  </motion.div>
                </li>
              ))}
            </ul>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ delay: 0.6 }}
              className="absolute bottom-10 left-8 right-8 md:left-16 md:right-16 flex flex-col sm:flex-row gap-3 justify-between sm:items-center border-t border-white/10 pt-6 font-mono text-[12px] tracking-[0.12em] text-[#5A6880] uppercase"
            >
              <a href="mailto:lockrythm@gmail.com" className="text-[#E8EDF5] normal-case tracking-normal text-[15px]">
                lockrythm@gmail.com
              </a>
              <span className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-emerald-500" /> Available for new projects
              </span>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
