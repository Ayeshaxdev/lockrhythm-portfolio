"use client";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// ── Inline SVG icons (no external libs) ──────────────────────────────────────
const IconInstagram = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
    <circle cx="12" cy="12" r="4"/>
    <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" stroke="none"/>
  </svg>
);

const IconLinkedIn = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
    <rect x="2" y="9" width="4" height="12"/>
    <circle cx="4" cy="4" r="2"/>
  </svg>
);

const IconX = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.742l7.727-8.835L1.254 2.25H8.08l4.253 5.622 5.91-5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
  </svg>
);

// ── Social links data ─────────────────────────────────────────────────────────
const SOCIALS = [
  { label: "Instagram", href: "https://www.instagram.com/lockrhythm/",         Icon: IconInstagram },
  { label: "LinkedIn",  href: "https://www.linkedin.com/company/lockrythm",    Icon: IconLinkedIn  },
  { label: "X",         href: "https://x.com/lockrythm",                       Icon: IconX         },
];

// ── Input field component ─────────────────────────────────────────────────────
function TerminalInput({
  label,
  type = "text",
  placeholder,
  isTextarea = false,
  value,
  onChange,
}: {
  label: string;
  type?: string;
  placeholder: string;
  isTextarea?: boolean;
  value: string;
  onChange: (v: string) => void;
}) {
  const [focused, setFocused] = useState(false);

  const sharedStyle: React.CSSProperties = {
    width: "100%",
    background: "transparent",
    border: "none",
    borderBottom: `1px solid ${focused ? "#3A9BD5" : "#1B2A3A"}`,
    boxShadow: focused ? "0 2px 12px rgba(58,155,213,0.18)" : "none",
    outline: "none",
    color: "#E8EDF5",
    fontFamily: "'Inter', sans-serif",
    fontSize: "14px",
    padding: "14px 0",
    resize: "none" as const,
    transition: "border-color 0.3s ease, box-shadow 0.3s ease",
    caretColor: "#3A9BD5",
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
      <label
        style={{
          fontFamily: "monospace",
          fontSize: "9px",
          letterSpacing: "0.22em",
          color: focused ? "#3A9BD5" : "#3A4A5A",
          transition: "color 0.3s",
        }}
      >
        {label}
      </label>

      {isTextarea ? (
        <textarea
          rows={4}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          style={{
            ...sharedStyle,
            fontFamily: "monospace",
            fontSize: "12px",
            letterSpacing: "0.1em",
            color: "#9BAAB8",
          }}
        />
      ) : (
        <input
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          style={{
            ...sharedStyle,
            fontFamily: "monospace",
            fontSize: "12px",
            letterSpacing: "0.1em",
            color: "#9BAAB8",
          }}
        />
      )}

      <style>{`
        input::placeholder, textarea::placeholder {
          color: #2A3A4A;
          font-family: monospace;
          letter-spacing: 0.15em;
          font-size: 11px;
        }
      `}</style>
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────
export default function ContactSection() {
  const sectionRef  = useRef<HTMLElement>(null);
  const headlineRef = useRef<HTMLDivElement>(null);
  const subtextRef  = useRef<HTMLParagraphElement>(null);
  const formRef     = useRef<HTMLFormElement>(null);
  const footerRef   = useRef<HTMLDivElement>(null);

  const [name,    setName]    = useState("");
  const [email,   setEmail]   = useState("");
  const [scope,   setScope]   = useState("");
  const [loading, setLoading] = useState(false);
  const [sent,    setSent]    = useState(false);
  const [btnHover, setBtnHover] = useState(false);

  // ── GSAP scroll reveal ────────────────────────────────────────────────────
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const section  = sectionRef.current;
    const headline = headlineRef.current;
    const subtext  = subtextRef.current;
    const form     = formRef.current;
    const footer   = footerRef.current;

    if (!section || !headline || !subtext || !form || !footer) return;

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: "top 75%",
        toggleActions: "play none none reverse",
      },
    });

    // Lines inside headline stagger
    const lines = headline.querySelectorAll(".lr-line");
    tl.fromTo(
      lines,
      { y: 60, opacity: 0, skewY: 2 },
      { y: 0,  opacity: 1, skewY: 0, duration: 0.8, stagger: 0.12, ease: "power4.out" }
    );

    tl.fromTo(
      subtext,
      { y: 20, opacity: 0 },
      { y: 0,  opacity: 1, duration: 0.6, ease: "power3.out" },
      "-=0.4"
    );

    // Form fields stagger
    const fields = form.querySelectorAll(".lr-field");
    tl.fromTo(
      fields,
      { y: 24, opacity: 0 },
      { y: 0,  opacity: 1, duration: 0.55, stagger: 0.1, ease: "power3.out" },
      "-=0.3"
    );

    tl.fromTo(
      footer,
      { y: 16, opacity: 0 },
      { y: 0,  opacity: 1, duration: 0.5, ease: "power2.out" },
      "-=0.2"
    );

    return () => ScrollTrigger.getAll().forEach((t) => t.kill());
  }, []);

  // ── Form submit ───────────────────────────────────────────────────────────
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) return;

    setLoading(true);
    // Simulate async send (replace with your real API call)
    await new Promise((r) => setTimeout(r, 2200));
    setLoading(false);
    setSent(true);
  };

  return (
    <section
      ref={sectionRef}
      id="contact"
      style={{
        background: "#040408",
        padding: "clamp(80px, 12vh, 140px) clamp(24px, 5vw, 80px)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* ── Faint background grid lines (atmosphere) ── */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage:
            "linear-gradient(rgba(58,155,213,0.03) 1px, transparent 1px), " +
            "linear-gradient(90deg, rgba(58,155,213,0.03) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
          pointerEvents: "none",
        }}
      />

      {/* ── Inner max-width container ── */}
      <div style={{ maxWidth: "1200px", margin: "0 auto", position: "relative" }}>

        {/* ── Two-column grid ── */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "clamp(40px, 6vw, 100px)",
            alignItems: "start",
          }}
        >
          {/* ════════════ LEFT — The Hook ════════════ */}
          <div style={{ position: "sticky", top: "80px" }}>

            {/* Massive headline */}
            <div ref={headlineRef} style={{ marginBottom: "32px" }}>
              <div
                className="lr-line"
                style={{
                  fontFamily: "'Space Grotesk', sans-serif",
                  fontWeight: 800,
                  fontSize: "clamp(64px, 9vw, 120px)",
                  color: "#E8EDF5",
                  letterSpacing: "-0.05em",
                  lineHeight: 0.88,
                  display: "block",
                }}
              >
                INITIATE
              </div>
              <div
                className="lr-line"
                style={{
                  fontFamily: "'Space Grotesk', sans-serif",
                  fontWeight: 800,
                  fontSize: "clamp(64px, 9vw, 120px)",
                  color: "#3A9BD5",
                  letterSpacing: "-0.05em",
                  lineHeight: 0.88,
                  display: "block",
                  marginTop: "4px",
                }}
              >
                SEQUENCE.
              </div>
            </div>

            {/* Subtext */}
            <p
              ref={subtextRef}
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: "clamp(13px, 1.4vw, 15px)",
                color: "#3A4A5A",
                lineHeight: 1.7,
                maxWidth: "340px",
                margin: "0 0 48px",
              }}
            >
              Stop launching generic products.{" "}
              <span style={{ color: "#6A8A9A" }}>
                Architect a digital asset.
              </span>{" "}
              Enter your parameters below.
            </p>

            {/* Decorative terminal line */}
            <div
              style={{
                fontFamily: "monospace",
                fontSize: "11px",
                color: "#1B2A3A",
                letterSpacing: "0.15em",
                marginBottom: "24px",
              }}
            >
              ──────────────────────────
            </div>

            {/* Social links */}
            <div style={{ display: "flex", gap: "20px" }}>
              {SOCIALS.map(({ label, href, Icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  title={label}
                  style={{
                    color: "#3A4A5A",
                    textDecoration: "none",
                    transition: "color 0.2s",
                    display: "flex",
                    alignItems: "center",
                  }}
                  onMouseEnter={(e) =>
                    ((e.currentTarget as HTMLAnchorElement).style.color = "#3A9BD5")
                  }
                  onMouseLeave={(e) =>
                    ((e.currentTarget as HTMLAnchorElement).style.color = "#3A4A5A")
                  }
                >
                  <Icon />
                </a>
              ))}
            </div>
          </div>

          {/* ════════════ RIGHT — The Terminal ════════════ */}
          <div>
            {/* Terminal header bar */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                marginBottom: "36px",
                paddingBottom: "16px",
                borderBottom: "1px solid #0D1A24",
              }}
            >
              {["#FF5F57", "#FFBD2E", "#28CA41"].map((c) => (
                <span
                  key={c}
                  style={{
                    width: "10px",
                    height: "10px",
                    borderRadius: "50%",
                    background: c,
                    opacity: 0.6,
                  }}
                />
              ))}
              <span
                style={{
                  fontFamily: "monospace",
                  fontSize: "10px",
                  color: "#1B2A3A",
                  letterSpacing: "0.15em",
                  marginLeft: "8px",
                }}
              >
                lockrhythm:~/contact — bash
              </span>
            </div>

            {/* Form */}
            <form
              ref={formRef}
              onSubmit={handleSubmit}
              style={{ display: "flex", flexDirection: "column", gap: "32px" }}
            >
              <div className="lr-field">
                <TerminalInput
                  label="IDENTITY"
                  placeholder="YOUR NAME"
                  value={name}
                  onChange={setName}
                />
              </div>

              <div className="lr-field">
                <TerminalInput
                  label="UPLINK ADDRESS"
                  type="email"
                  placeholder="YOUR EMAIL"
                  value={email}
                  onChange={setEmail}
                />
              </div>

              <div className="lr-field">
                <TerminalInput
                  label="MISSION PARAMETERS"
                  placeholder="PROJECT SCOPE — DESCRIBE WHAT YOU WANT BUILT"
                  isTextarea
                  value={scope}
                  onChange={setScope}
                />
              </div>

              {/* Submit button */}
              <div className="lr-field">
                <button
                  type="submit"
                  disabled={loading || sent}
                  onMouseEnter={() => setBtnHover(true)}
                  onMouseLeave={() => setBtnHover(false)}
                  style={{
                    width: "100%",
                    padding: "18px 24px",
                    background: sent
                      ? "rgba(58,155,213,0.12)"
                      : btnHover && !loading
                      ? "#3A9BD5"
                      : "transparent",
                    border: `1px solid ${sent ? "rgba(58,155,213,0.3)" : "#3A9BD5"}`,
                    color: sent
                      ? "#3A9BD5"
                      : btnHover && !loading
                      ? "#040408"
                      : "#3A9BD5",
                    fontFamily: "monospace",
                    fontSize: "12px",
                    letterSpacing: "0.2em",
                    fontWeight: 600,
                    cursor: loading || sent ? "default" : "pointer",
                    transition: "all 0.25s ease",
                    borderRadius: "2px",
                  }}
                >
                  {sent
                    ? "// SEQUENCE INITIATED ✓"
                    : loading
                    ? "// INITIALIZING SEQUENCE..."
                    : "// TRANSMIT →"}
                </button>
              </div>
            </form>

            {/* Footer direct links */}
            <div
              ref={footerRef}
              style={{
                marginTop: "48px",
                paddingTop: "24px",
                borderTop: "1px solid #0D1A24",
              }}
            >
              <p
                style={{
                  fontFamily: "monospace",
                  fontSize: "9px",
                  letterSpacing: "0.2em",
                  color: "#1B2A3A",
                  margin: "0 0 10px",
                }}
              >
                DIRECT UPLINK
              </p>
              <a
                href="mailto:lockrythm@gmail.com"
                style={{
                  fontFamily: "monospace",
                  fontSize: "12px",
                  letterSpacing: "0.08em",
                  color: "#3A4A5A",
                  textDecoration: "none",
                  transition: "color 0.2s",
                }}
                onMouseEnter={(e) =>
                  ((e.currentTarget as HTMLAnchorElement).style.color = "#3A9BD5")
                }
                onMouseLeave={(e) =>
                  ((e.currentTarget as HTMLAnchorElement).style.color = "#3A4A5A")
                }
              >
                lockrythm@gmail.com
              </a>

              {/* Blinking cursor */}
              <span
                style={{
                  display: "inline-block",
                  width: "8px",
                  height: "14px",
                  background: "#3A9BD5",
                  marginLeft: "6px",
                  verticalAlign: "middle",
                  animation: "lr-blink 1.1s step-end infinite",
                }}
              />
            </div>
          </div>
        </div>

        {/* ── Bottom copyright strip ── */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginTop: "clamp(60px, 8vh, 100px)",
            paddingTop: "24px",
            borderTop: "1px solid #0D1A24",
          }}
        >
          <span
            style={{
              fontFamily: "monospace",
              fontSize: "10px",
              color: "#1B2A3A",
              letterSpacing: "0.15em",
            }}
          >
            © 2025 LOCKRHYTHM
          </span>
          <span
            style={{
              fontFamily: "monospace",
              fontSize: "10px",
              color: "#1B2A3A",
              letterSpacing: "0.15em",
            }}
          >
            AVAILABLE FOR NEW PROJECTS — 2025
          </span>
        </div>
      </div>

      {/* ── Keyframes ── */}
      <style>{`
        @keyframes lr-blink {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0; }
        }
        @media (max-width: 768px) {
          #contact > div > div[style*="grid-template-columns"] {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </section>
  );
}
