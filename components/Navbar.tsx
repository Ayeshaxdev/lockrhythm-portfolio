"use client";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

const navLinks = [
  { label: "Home",     href: "/" },
  { label: "Work",     href: "/#work" },
  { label: "Services", href: "/#services" },
  { label: "About",    href: "/#about" },
  { label: "Studio",   href: "/#studio" },
  { label: "Contact",  href: "/#contact" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <>
      {/* Top Bar */}
      <nav style={{
        position: "absolute",
        top: "28px",
        left: 0, right: 0,
        zIndex: 100,
        padding: "0 48px",
        height: "56px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}>
        {/* Brand */}
        <Link href="/" style={{ textDecoration: "none" }}
          onClick={() => setOpen(false)}>
          <span style={{
            fontFamily: "'Space Grotesk', sans-serif",
            fontWeight: 700,
            fontSize: "24px",
            letterSpacing: "-0.03em",
            color: "#E8EDF5",
          }}>
            Lock<span style={{ color: "#8BAFC8" }}>rhythm</span>
          </span>
        </Link>

        {/* Hamburger Button */}
        <button
          onClick={() => setOpen(!open)}
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            padding: "8px",
            display: "flex",
            flexDirection: "column",
            gap: "5px",
            zIndex: 200,
          }}
          aria-label="Toggle menu"
        >
          <motion.span
            animate={open ? { rotate: 45, y: 7 } : { rotate: 0, y: 0 }}
            transition={{ duration: 0.3 }}
            style={{
              display: "block", width: "24px", height: "1.5px",
              background: "#E8EDF5", transformOrigin: "center",
            }}
          />
          <motion.span
            animate={open ? { opacity: 0, scaleX: 0 } : { opacity: 1, scaleX: 1 }}
            transition={{ duration: 0.2 }}
            style={{
              display: "block", width: "24px", height: "1.5px",
              background: "#E8EDF5",
            }}
          />
          <motion.span
            animate={open ? { rotate: -45, y: -7 } : { rotate: 0, y: 0 }}
            transition={{ duration: 0.3 }}
            style={{
              display: "block", width: "24px", height: "1.5px",
              background: "#E8EDF5", transformOrigin: "center",
            }}
          />
        </button>
      </nav>

      {/* Fullscreen Overlay */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            style={{
              position: "fixed",
              inset: 0,
              zIndex: 99,
              background: "#040408",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              padding: "0 64px",
            }}
          >
            {/* Nav Links */}
            <ul style={{ listStyle: "none", margin: 0, padding: 0 }}>
              {navLinks.map((link, i) => (
                <motion.li
                  key={link.href}
                  initial={{ opacity: 0, x: -40 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{
                    duration: 0.4,
                    delay: 0.1 + i * 0.07,
                    ease: [0.22, 1, 0.36, 1]
                  }}
                >
                  <Link
                    href={link.href}
                    onClick={() => setOpen(false)}
                    style={{
                      fontFamily: "'Space Grotesk', sans-serif",
                      fontWeight: 700,
                      fontSize: "clamp(28px, 4vw, 52px)",
                      letterSpacing: "-0.03em",
                      lineHeight: 1.1,
                      textDecoration: "none",
                      color: pathname === link.href ? "#8BAFC8" : "#E8EDF5",
                      display: "block",
                      padding: "6px 0",
                      transition: "color 0.2s",
                    }}
                    onMouseEnter={e =>
                      (e.currentTarget.style.color = "#8BAFC8")
                    }
                    onMouseLeave={e =>
                      (e.currentTarget.style.color =
                        pathname === link.href ? "#8BAFC8" : "#E8EDF5")
                    }
                  >
                    {link.label}
                  </Link>
                </motion.li>
              ))}
            </ul>

            {/* Bottom strip */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              style={{
                position: "absolute",
                bottom: "40px",
                left: "64px", right: "64px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                borderTop: "1px solid rgba(139,175,200,0.1)",
                paddingTop: "24px",
              }}
            >
              <span style={{
                fontFamily: "monospace",
                fontSize: "12px",
                color: "#5A6880",
                letterSpacing: "0.1em",
              }}>
                © 2025 LOCKRHYTHM
              </span>
              <span style={{
                fontFamily: "monospace",
                fontSize: "12px",
                color: "#5A6880",
                letterSpacing: "0.1em",
              }}>
                AVAILABLE FOR NEW PROJECTS
              </span>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}