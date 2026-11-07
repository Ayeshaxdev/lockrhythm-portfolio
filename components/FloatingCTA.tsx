"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence, useScroll, useSpring } from "framer-motion";
import WhatsAppIcon from "@/components/motion/WhatsAppIcon";
import { whatsappHref } from "@/lib/contact";

/** Scroll progress bar + a WhatsApp button and "Start a project" pill that follow the visitor after the hero. */
export default function FloatingCTA() {
  const [show, setShow] = useState(false);
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.3 });

  useEffect(() => {
    let contactVisible = false;
    const contact = document.getElementById("contact");
    const io = contact
      ? new IntersectionObserver(([e]) => {
          contactVisible = e.isIntersecting;
          update();
        }, { threshold: 0.05 })
      : null;
    if (contact && io) io.observe(contact);

    function update() {
      setShow(window.scrollY > window.innerHeight * 0.9 && !contactVisible);
    }
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => {
      window.removeEventListener("scroll", update);
      io?.disconnect();
    };
  }, []);

  return (
    <>
      <motion.div
        aria-hidden
        className="fixed top-0 left-0 right-0 h-[2px] z-[101] origin-left bg-gradient-to-r from-[#3A9BD5] to-[#7B4FD4]"
        style={{ scaleX }}
      />
      <div className="lr-grain" aria-hidden />
      <AnimatePresence>
        {show && (
          <motion.div
            initial={{ y: 120, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 120, opacity: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="fixed z-[90] bottom-4 left-4 right-4 flex items-center gap-2 sm:left-auto sm:right-6 sm:bottom-6"
          >
            {/* One-tap WhatsApp chat */}
            <a
              href={whatsappHref()}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Chat with us on WhatsApp"
              data-cursor="WhatsApp"
              className="flex h-[60px] w-[60px] shrink-0 items-center justify-center rounded-full bg-[#25D366] text-white shadow-[0_20px_50px_-15px_rgba(37,211,102,0.6)] transition-transform duration-500 hover:scale-105"
            >
              <WhatsAppIcon className="h-7 w-7" />
            </a>
            <Link
              href="/#contact"
              className="group flex flex-1 sm:flex-none items-center justify-between sm:justify-start gap-4 rounded-full border border-white/10 bg-[#0b0d14]/80 backdrop-blur-xl pl-5 pr-2 py-2 shadow-[0_20px_50px_-15px_rgba(58,155,213,0.45)]"
            >
              <span className="flex flex-col leading-tight">
                <span className="text-[14px] font-semibold text-[#E8EDF5]">Have a project in mind?</span>
                <span className="text-[12px] text-[#8A99AD] flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" /> Reply within 24 hours
                </span>
              </span>
              <span className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-[#3A9BD5] to-[#7B4FD4] text-white transition-transform duration-500 group-hover:rotate-[-45deg]">
                →
              </span>
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
