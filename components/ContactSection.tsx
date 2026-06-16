"use client";

import { useState, useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export default function ContactSection() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLDivElement>(null);
  const infoRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      if (!headerRef.current || !formRef.current || !infoRef.current) return;
      
      gsap.fromTo(
        headerRef.current.children,
        { opacity: 0, y: 30 },
        {
          opacity: 1, y: 0,
          stagger: 0.1,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: { trigger: sectionRef.current, start: "top 70%" }
        }
      );

      gsap.fromTo(
        [infoRef.current, formRef.current],
        { opacity: 0, y: 40 },
        {
          opacity: 1, y: 0,
          stagger: 0.2,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: { trigger: sectionRef.current, start: "top 60%" }
        }
      );
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => { setLoading(false); setSent(true); }, 1600);
  };

  return (
    <section
      id="contact"
      ref={sectionRef}
      style={{
        background: "#040408",
        borderTop: "1px solid rgba(255,255,255,0.05)",
        padding: "100px 64px",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Background glow */}
      <div 
        style={{
          position: "absolute",
          top: "20%",
          right: "-10%",
          width: "600px",
          height: "600px",
          background: "radial-gradient(circle, rgba(58,155,213,0.05) 0%, transparent 60%)",
          pointerEvents: "none",
          zIndex: 0,
        }}
      />

      <div style={{ maxWidth: "1280px", position: "relative", zIndex: 1 }}>
        {/* ── Header ── */}
        <div ref={headerRef} style={{ marginBottom: "64px" }}>
          <span style={{
            fontFamily: "monospace",
            fontSize: "11px",
            letterSpacing: "0.2em",
            color: "#3A9BD5",
            textTransform: "uppercase",
            display: "block",
            marginBottom: "28px",
          }}>
            04 / Contact
          </span>
          <div
            style={{
              height: "1px",
              background: "linear-gradient(90deg, #3A9BD5 0%, #7B4FD4 50%, transparent 100%)",
              marginBottom: "48px",
              width: "100%",
            }}
          />
          <h2 style={{
            fontFamily: "'Space Grotesk', sans-serif",
            fontWeight: 700,
            fontSize: "clamp(40px, 6vw, 88px)",
            color: "#E8EDF5",
            letterSpacing: "-0.04em",
            lineHeight: 1.05,
            margin: "0",
          }}>
            Let&apos;s build something <br />
            <span style={{
              background: "linear-gradient(90deg, #3A9BD5, #7B4FD4)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}>legendary.</span>
          </h2>
        </div>

        {/* ── Grid ── */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "1fr 1.5fr",
          gap: "clamp(60px, 8vw, 120px)",
          alignItems: "start",
        }}
          className="ct-grid"
        >
          {/* LEFT — Info */}
          <div ref={infoRef} style={{ display: "flex", flexDirection: "column", gap: "48px" }}>
            <p style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: "18px",
              color: "#8BAFC8",
              lineHeight: 1.7,
              margin: 0,
              maxWidth: "400px",
            }}>
              Ready to architect your digital future? Drop us a line. We generally respond within 24 hours to serious inquiries.
            </p>
            
            <div style={{ display: "flex", flexDirection: "column", gap: "32px" }}>
              {[
                { label: "Email",     value: "lockrythm@gmail.com", href: "mailto:lockrythm@gmail.com" },
                { label: "Instagram", value: "@lockrhythm",          href: "https://www.instagram.com/lockrhythm/" },
                { label: "LinkedIn",  value: "LockRhythm",           href: "https://www.linkedin.com/company/lockrythm" },
                { label: "Location",  value: "Sahiwal, Pakistan",     href: undefined },
              ].map(item => (
                <div key={item.label} className="contact-info-item">
                  <p style={{ fontFamily: "monospace", fontSize: "10px", letterSpacing: "0.2em", color: "#3A4858", textTransform: "uppercase", margin: "0 0 8px" }}>{item.label}</p>
                  {item.href ? (
                    <a href={item.href} target={item.href.startsWith("http") ? "_blank" : undefined} rel="noopener noreferrer"
                      style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 600, fontSize: "clamp(16px, 1.5vw, 20px)", color: "#E8EDF5", textDecoration: "none", letterSpacing: "-0.01em", transition: "color 0.3s ease" }}
                    >{item.value}</a>
                  ) : (
                    <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 600, fontSize: "clamp(16px, 1.5vw, 20px)", color: "#E8EDF5", margin: 0, letterSpacing: "-0.01em" }}>{item.value}</p>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT — Form */}
          <div ref={formRef} style={{
            background: "linear-gradient(145deg, rgba(15,20,30,0.4) 0%, rgba(5,8,12,0.6) 100%)",
            border: "1px solid rgba(255, 255, 255, 0.05)",
            padding: "48px",
            borderRadius: "16px",
            boxShadow: "0 20px 40px -20px rgba(0,0,0,0.5)",
            position: "relative",
            overflow: "hidden",
          }}>
            {!sent ? (
              <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "24px", position: "relative", zIndex: 1 }}>
                <div className="input-group">
                  <input
                    type="text"
                    placeholder="Your name"
                    required
                    value={form.name}
                    onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                    className="ct-input"
                  />
                </div>
                <div className="input-group">
                  <input
                    type="email"
                    placeholder="Your email"
                    required
                    value={form.email}
                    onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                    className="ct-input"
                  />
                </div>
                <div className="input-group">
                  <textarea
                    placeholder="Tell us about your project"
                    required
                    rows={5}
                    value={form.message}
                    onChange={e => setForm(p => ({ ...p, message: e.target.value }))}
                    className="ct-input"
                    style={{ resize: "none" }}
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="ct-submit"
                >
                  {loading ? "Sending Sequence..." : "Initialize Contact →"}
                </button>
              </form>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "20px", padding: "60px 0", alignItems: "center", textAlign: "center" }}>
                <div style={{ width: "64px", height: "64px", borderRadius: "50%", border: "2px solid #3A9BD5", display: "flex", alignItems: "center", justifyContent: "center", color: "#3A9BD5", fontSize: "28px", boxShadow: "0 0 20px rgba(58,155,213,0.2)" }}>✓</div>
                <h3 style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: "28px", color: "#E8EDF5", margin: 0, letterSpacing: "-0.03em" }}>Transmission Received</h3>
                <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "16px", color: "#8BAFC8", margin: 0, lineHeight: 1.7, maxWidth: "300px" }}>Your signal reached our servers. We'll be in touch within 24 hours.</p>
                <button onClick={() => setSent(false)} style={{ background: "none", border: "none", fontFamily: "monospace", fontSize: "12px", letterSpacing: "0.2em", color: "#3A9BD5", cursor: "pointer", padding: "10px", marginTop: "10px", transition: "color 0.3s" }} className="reset-btn">← Send another</button>
              </div>
            )}
          </div>
        </div>
      </div>

      <style>{`
        .ct-grid {
          width: 100%;
        }
        .ct-input {
          width: 100%;
          background: rgba(255,255,255,0.02);
          border: 1px solid rgba(255,255,255,0.06);
          border-radius: 8px;
          padding: 18px 20px;
          font-family: 'Space Grotesk', sans-serif;
          font-size: 16px;
          color: #E8EDF5;
          outline: none;
          transition: all 0.3s cubic-bezier(0.2, 0.8, 0.2, 1);
          box-sizing: border-box;
        }
        .ct-input::placeholder { color: rgba(139,175,200,0.4); }
        .ct-input:focus {
          background: rgba(58,155,213,0.05);
          border-color: rgba(58,155,213,0.4);
          box-shadow: 0 0 15px rgba(58,155,213,0.1);
        }
        .ct-submit {
          margin-top: 10px;
          padding: 18px 40px;
          background: linear-gradient(90deg, #3A9BD5, #5A7FD4);
          border: none;
          border-radius: 8px;
          font-family: 'Space Grotesk', sans-serif;
          font-weight: 700;
          font-size: 16px;
          color: #040408;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.2, 0.8, 0.2, 1);
          align-self: flex-start;
          box-shadow: 0 10px 20px -10px rgba(58,155,213,0.5);
        }
        .ct-submit:hover:not(:disabled) {
          transform: translateY(-3px);
          box-shadow: 0 15px 25px -10px rgba(58,155,213,0.7);
          filter: brightness(1.1);
        }
        .ct-submit:disabled {
          opacity: 0.7;
          cursor: wait;
        }
        .contact-info-item a:hover {
          color: #3A9BD5 !important;
          text-shadow: 0 0 10px rgba(58,155,213,0.3);
        }
        .reset-btn:hover {
          color: #E8EDF5 !important;
        }
        @media (max-width: 900px) {
          .ct-grid { grid-template-columns: 1fr !important; gap: 60px !important; }
        }
        @media (max-width: 600px) {
          #contact { padding: 80px 24px !important; }
        }
      `}</style>
    </section>
  );
}
