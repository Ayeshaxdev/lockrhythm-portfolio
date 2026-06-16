"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export default function ContactSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  // ── GSAP entrance ──
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      // Section number + rule
      gsap.fromTo(
        ".ct-topline",
        { width: 0, opacity: 0 },
        {
          width: "100%",
          opacity: 1,
          duration: 1.2,
          ease: "power3.inOut",
          scrollTrigger: { trigger: section, start: "top 80%" },
        }
      );

      gsap.fromTo(
        ".ct-label",
        { opacity: 0, x: -20 },
        {
          opacity: 1,
          x: 0,
          duration: 0.6,
          ease: "power3.out",
          scrollTrigger: { trigger: section, start: "top 78%" },
        }
      );

      // Headline words
      gsap.fromTo(
        ".ct-word",
        { y: 120, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.9,
          stagger: 0.08,
          ease: "power4.out",
          scrollTrigger: { trigger: section, start: "top 72%" },
        }
      );

      // Right column content
      gsap.fromTo(
        ".ct-right-item",
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.7,
          stagger: 0.12,
          ease: "power3.out",
          scrollTrigger: { trigger: section, start: "top 65%" },
        }
      );

      // Bottom row
      gsap.fromTo(
        ".ct-bottom-item",
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.6,
          stagger: 0.1,
          ease: "power3.out",
          scrollTrigger: { trigger: section, start: "top 50%" },
        }
      );
    }, section);

    return () => ctx.revert();
  }, []);

  // ── Submit ──
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) return;
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1800));
    setLoading(false);
    setSent(true);
  };

  return (
    <section
      ref={sectionRef}
      id="contact"
      style={{
        background: "#040408",
        padding: "0 clamp(24px, 5vw, 60px)",
        paddingTop: "clamp(80px, 10vh, 120px)",
        paddingBottom: "clamp(60px, 8vh, 100px)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* ── Max-width wrapper ── */}
      <div style={{ maxWidth: "1280px", margin: "0 auto" }}>

        {/* ── Top: Section label + gradient rule ── */}
        <div style={{ marginBottom: "clamp(48px, 6vh, 72px)" }}>
          <span
            className="ct-label"
            style={{
              fontFamily: "monospace",
              fontSize: "11px",
              letterSpacing: "0.2em",
              color: "#3A9BD5",
              textTransform: "uppercase" as const,
              display: "block",
              marginBottom: "28px",
            }}
          >
            04 / Contact
          </span>
          <div
            className="ct-topline"
            style={{
              height: "1px",
              background:
                "linear-gradient(90deg, #3A9BD5 0%, #7B4FD4 50%, transparent 100%)",
            }}
          />
        </div>

        {/* ── Main grid: headline left, form right ── */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1.1fr 1fr",
            gap: "clamp(48px, 7vw, 120px)",
            alignItems: "start",
          }}
        >
          {/* ════ LEFT: Massive headline ════ */}
          <div style={{ position: "sticky", top: "100px" }}>
            <h2
              style={{
                fontFamily: "'Space Grotesk', sans-serif",
                fontWeight: 700,
                fontSize: "clamp(52px, 7.5vw, 100px)",
                color: "#E8EDF5",
                letterSpacing: "-0.04em",
                lineHeight: 0.95,
                margin: "0 0 40px",
                overflow: "hidden",
              }}
            >
              <span className="ct-word" style={{ display: "inline-block" }}>
                Let's&nbsp;
              </span>
              <span className="ct-word" style={{ display: "inline-block" }}>
                build&nbsp;
              </span>
              <br />
              <span
                className="ct-word"
                style={{
                  display: "inline-block",
                  background:
                    "linear-gradient(90deg, #3A9BD5, #7B4FD4)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                something&nbsp;
              </span>
              <br />
              <span className="ct-word" style={{ display: "inline-block" }}>
                real.
              </span>
            </h2>

            {/* Subtitle */}
            <p
              className="ct-word"
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: "clamp(14px, 1.4vw, 16px)",
                color: "#3A4A5A",
                lineHeight: 1.7,
                maxWidth: "380px",
                margin: "0 0 48px",
              }}
            >
              Have a project, an idea, or just want to talk shop? 
              Drop your details and we'll get back within 24 hours.
            </p>

            {/* Direct info */}
            <div className="ct-word" style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <a
                href="mailto:lockrythm@gmail.com"
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: "15px",
                  color: "#5A6880",
                  textDecoration: "none",
                  transition: "color 0.2s",
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                }}
                onMouseEnter={(e) =>
                  ((e.currentTarget as HTMLAnchorElement).style.color = "#E8EDF5")
                }
                onMouseLeave={(e) =>
                  ((e.currentTarget as HTMLAnchorElement).style.color = "#5A6880")
                }
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                  <polyline points="22,6 12,13 2,6" />
                </svg>
                lockrythm@gmail.com
              </a>
              <span
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: "15px",
                  color: "#5A6880",
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
                Sahiwal, Pakistan
              </span>
            </div>

            {/* Socials */}
            <div className="ct-word" style={{ display: "flex", gap: "16px", marginTop: "36px" }}>
              {[
                { label: "Instagram", href: "https://www.instagram.com/lockrhythm/", d: "M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37zM17.5 6.5h.01", rect: true },
                { label: "LinkedIn", href: "https://www.linkedin.com/company/lockrythm", d: "M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6zM2 9h4v12H2zM4 4a2 2 0 1 0 0 .001" },
                { label: "X", href: "https://x.com/lockrythm", d: "M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.742l7.727-8.835L1.254 2.25H8.08l4.253 5.622z", fill: true },
              ].map(({ label, href, d, rect, fill }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  title={label}
                  style={{
                    width: "40px",
                    height: "40px",
                    borderRadius: "50%",
                    border: "1px solid rgba(255,255,255,0.08)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#5A6880",
                    textDecoration: "none",
                    transition: "all 0.3s ease",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLAnchorElement).style.borderColor = "#3A9BD5";
                    (e.currentTarget as HTMLAnchorElement).style.color = "#3A9BD5";
                    (e.currentTarget as HTMLAnchorElement).style.background = "rgba(58,155,213,0.08)";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLAnchorElement).style.borderColor = "rgba(255,255,255,0.08)";
                    (e.currentTarget as HTMLAnchorElement).style.color = "#5A6880";
                    (e.currentTarget as HTMLAnchorElement).style.background = "transparent";
                  }}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill={fill ? "currentColor" : "none"} stroke={fill ? "none" : "currentColor"} strokeWidth="1.5">
                    {rect && <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />}
                    <path d={d} />
                  </svg>
                </a>
              ))}
            </div>
          </div>

          {/* ════ RIGHT: The form ════ */}
          <div>
            {!sent ? (
              <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "0" }}>
                {/* Name */}
                <div className="ct-right-item" style={{ borderBottom: "1px solid #1A2A38", paddingBottom: "32px", marginBottom: "32px" }}>
                  <label
                    style={{
                      fontFamily: "monospace",
                      fontSize: "10px",
                      letterSpacing: "0.2em",
                      color: "#3A4A5A",
                      display: "block",
                      marginBottom: "12px",
                    }}
                  >
                    01 — YOUR NAME
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="John Doe"
                    style={{
                      width: "100%",
                      background: "transparent",
                      border: "none",
                      outline: "none",
                      fontFamily: "'Space Grotesk', sans-serif",
                      fontSize: "clamp(20px, 2.5vw, 28px)",
                      fontWeight: 500,
                      color: "#E8EDF5",
                      letterSpacing: "-0.02em",
                      padding: 0,
                      caretColor: "#3A9BD5",
                    }}
                  />
                </div>

                {/* Email */}
                <div className="ct-right-item" style={{ borderBottom: "1px solid #1A2A38", paddingBottom: "32px", marginBottom: "32px" }}>
                  <label
                    style={{
                      fontFamily: "monospace",
                      fontSize: "10px",
                      letterSpacing: "0.2em",
                      color: "#3A4A5A",
                      display: "block",
                      marginBottom: "12px",
                    }}
                  >
                    02 — YOUR EMAIL
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@company.com"
                    style={{
                      width: "100%",
                      background: "transparent",
                      border: "none",
                      outline: "none",
                      fontFamily: "'Space Grotesk', sans-serif",
                      fontSize: "clamp(20px, 2.5vw, 28px)",
                      fontWeight: 500,
                      color: "#E8EDF5",
                      letterSpacing: "-0.02em",
                      padding: 0,
                      caretColor: "#3A9BD5",
                    }}
                  />
                </div>

                {/* Message */}
                <div className="ct-right-item" style={{ borderBottom: "1px solid #1A2A38", paddingBottom: "32px", marginBottom: "48px" }}>
                  <label
                    style={{
                      fontFamily: "monospace",
                      fontSize: "10px",
                      letterSpacing: "0.2em",
                      color: "#3A4A5A",
                      display: "block",
                      marginBottom: "12px",
                    }}
                  >
                    03 — TELL US ABOUT YOUR PROJECT
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="I need a web app that..."
                    style={{
                      width: "100%",
                      background: "transparent",
                      border: "none",
                      outline: "none",
                      fontFamily: "'Space Grotesk', sans-serif",
                      fontSize: "clamp(18px, 2vw, 24px)",
                      fontWeight: 500,
                      color: "#E8EDF5",
                      letterSpacing: "-0.02em",
                      padding: 0,
                      resize: "none",
                      lineHeight: 1.5,
                      caretColor: "#3A9BD5",
                    }}
                  />
                </div>

                {/* Submit */}
                <div className="ct-right-item">
                  <button
                    type="submit"
                    disabled={loading}
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "16px",
                      background: "transparent",
                      border: "1px solid rgba(139,175,200,0.3)",
                      padding: "18px 40px",
                      borderRadius: "6px",
                      fontFamily: "'Inter', sans-serif",
                      fontSize: "14px",
                      fontWeight: 500,
                      color: "#8BAFC8",
                      cursor: loading ? "wait" : "pointer",
                      transition: "all 0.3s ease",
                      letterSpacing: "0.02em",
                      opacity: loading ? 0.6 : 1,
                    }}
                    onMouseEnter={(e) => {
                      if (loading) return;
                      (e.currentTarget as HTMLButtonElement).style.borderColor = "#8BAFC8";
                      (e.currentTarget as HTMLButtonElement).style.background = "rgba(139,175,200,0.08)";
                      (e.currentTarget as HTMLButtonElement).style.color = "#E8EDF5";
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(139,175,200,0.3)";
                      (e.currentTarget as HTMLButtonElement).style.background = "transparent";
                      (e.currentTarget as HTMLButtonElement).style.color = "#8BAFC8";
                    }}
                  >
                    {loading ? "Sending..." : "Send Message"}{" "}
                    <span style={{ fontSize: "18px", transition: "transform 0.3s" }}>→</span>
                  </button>
                </div>
              </form>
            ) : (
              /* ── Success state ── */
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "24px",
                  padding: "60px 0",
                }}
              >
                <div
                  style={{
                    width: "48px",
                    height: "48px",
                    borderRadius: "50%",
                    border: "1px solid #3A9BD5",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#3A9BD5",
                    fontSize: "20px",
                  }}
                >
                  ✓
                </div>
                <h3
                  style={{
                    fontFamily: "'Space Grotesk', sans-serif",
                    fontWeight: 700,
                    fontSize: "clamp(28px, 3vw, 40px)",
                    color: "#E8EDF5",
                    letterSpacing: "-0.03em",
                    margin: 0,
                  }}
                >
                  Message received.
                </h3>
                <p
                  style={{
                    fontFamily: "'Inter', sans-serif",
                    fontSize: "15px",
                    color: "#5A6880",
                    margin: 0,
                    lineHeight: 1.6,
                  }}
                >
                  We'll review your project details and respond within 24 hours.
                </p>
                <button
                  onClick={() => {
                    setSent(false);
                    setName("");
                    setEmail("");
                    setMessage("");
                  }}
                  style={{
                    background: "none",
                    border: "none",
                    fontFamily: "'Inter', sans-serif",
                    fontSize: "14px",
                    color: "#3A9BD5",
                    cursor: "pointer",
                    padding: 0,
                    marginTop: "8px",
                    textAlign: "left",
                    transition: "color 0.2s",
                  }}
                  onMouseEnter={(e) =>
                    ((e.currentTarget as HTMLButtonElement).style.color = "#E8EDF5")
                  }
                  onMouseLeave={(e) =>
                    ((e.currentTarget as HTMLButtonElement).style.color = "#3A9BD5")
                  }
                >
                  ← Send another message
                </button>
              </div>
            )}
          </div>
        </div>


      </div>

      {/* ── Placeholder styles ── */}
      <style>{`
        #contact input::placeholder,
        #contact textarea::placeholder {
          color: #3A4A5A;
          font-family: 'Space Grotesk', sans-serif;
          font-weight: 400;
          letter-spacing: -0.02em;
        }
        #contact input:focus::placeholder,
        #contact textarea:focus::placeholder {
          color: #4A5A6A;
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
