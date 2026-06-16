"use client";

import { useState } from "react";

export default function ContactSection() {
  const [form, setForm]     = useState({ name: "", email: "", message: "" });
  const [loading, setLoading] = useState(false);
  const [sent, setSent]       = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => { setLoading(false); setSent(true); }, 1600);
  };

  return (
    <section
      id="contact"
      style={{
        background: "#040408",
        borderTop: "1px solid rgba(255,255,255,0.05)",
        padding: "clamp(60px, 7vw, 90px) clamp(24px, 6vw, 100px)",
      }}
    >
      <div style={{ maxWidth: "960px", margin: "0 auto" }}>

        {/* ── Label ── */}
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
          }}
        />

        {/* ── Heading ── */}
        <h2 style={{
          fontFamily: "'Space Grotesk', sans-serif",
          fontWeight: 700,
          fontSize: "clamp(36px, 5.5vw, 70px)",
          color: "#E8EDF5",
          letterSpacing: "-0.04em",
          lineHeight: 1,
          margin: "0 0 clamp(48px, 6vw, 80px)",
        }}>
          Let&apos;s work<br />
          <span style={{
            background: "linear-gradient(90deg, #3A9BD5, #7B4FD4)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}>together.</span>
        </h2>

        {/* ── Two columns ── */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "clamp(40px, 6vw, 100px)",
          alignItems: "start",
        }}
          className="ct-grid"
        >

          {/* LEFT — Form */}
          <div>
            {!sent ? (
              <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                <input
                  type="text"
                  placeholder="Your name"
                  required
                  value={form.name}
                  onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                  style={inputStyle}
                  onFocus={e => (e.target as HTMLInputElement).style.borderColor = "#3A9BD5"}
                  onBlur={e  => (e.target as HTMLInputElement).style.borderColor = "rgba(255,255,255,0.08)"}
                />
                <input
                  type="email"
                  placeholder="Your email"
                  required
                  value={form.email}
                  onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                  style={inputStyle}
                  onFocus={e => (e.target as HTMLInputElement).style.borderColor = "#3A9BD5"}
                  onBlur={e  => (e.target as HTMLInputElement).style.borderColor = "rgba(255,255,255,0.08)"}
                />
                <textarea
                  placeholder="Tell us about your project"
                  required
                  rows={5}
                  value={form.message}
                  onChange={e => setForm(p => ({ ...p, message: e.target.value }))}
                  style={{ ...inputStyle, resize: "none" } as React.CSSProperties}
                  onFocus={e => (e.target as HTMLTextAreaElement).style.borderColor = "#3A9BD5"}
                  onBlur={e  => (e.target as HTMLTextAreaElement).style.borderColor = "rgba(255,255,255,0.08)"}
                />
                <button
                  type="submit"
                  disabled={loading}
                  style={{
                    marginTop: "4px",
                    padding: "16px 36px",
                    background: "#3A9BD5",
                    border: "none",
                    borderRadius: "8px",
                    fontFamily: "'Space Grotesk', sans-serif",
                    fontWeight: 700,
                    fontSize: "15px",
                    color: "#040408",
                    cursor: loading ? "wait" : "pointer",
                    transition: "background 0.3s, transform 0.2s",
                    alignSelf: "flex-start",
                  }}
                  onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = "#5AB8E8"; (e.currentTarget as HTMLButtonElement).style.transform = "translateY(-2px)"; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = "#3A9BD5"; (e.currentTarget as HTMLButtonElement).style.transform = "translateY(0)"; }}
                >
                  {loading ? "Sending…" : "Send Message →"}
                </button>
              </form>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "16px", padding: "40px 0" }}>
                <div style={{ width: "52px", height: "52px", borderRadius: "50%", border: "1.5px solid #3A9BD5", display: "flex", alignItems: "center", justifyContent: "center", color: "#3A9BD5", fontSize: "22px" }}>✓</div>
                <h3 style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: "24px", color: "#E8EDF5", margin: 0, letterSpacing: "-0.03em" }}>Message sent!</h3>
                <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "14px", color: "#5A6880", margin: 0, lineHeight: 1.7 }}>We&apos;ll get back to you within 24 hours.</p>
                <button onClick={() => setSent(false)} style={{ background: "none", border: "none", fontFamily: "monospace", fontSize: "10px", letterSpacing: "0.2em", color: "#3A9BD5", cursor: "pointer", padding: 0, textAlign: "left" }}>← Send another</button>
              </div>
            )}
          </div>

          {/* RIGHT — Info */}
          <div style={{ display: "flex", flexDirection: "column", gap: "32px", paddingTop: "4px" }}>

            {/* Quick info */}
            <div style={{ display: "flex", flexDirection: "column", gap: "28px" }}>
              {[
                { label: "Email",     value: "lockrythm@gmail.com", href: "mailto:lockrythm@gmail.com" },
                { label: "Instagram", value: "@lockrhythm",          href: "https://www.instagram.com/lockrhythm/" },
                { label: "LinkedIn",  value: "LockRhythm",           href: "https://www.linkedin.com/company/lockrythm" },
                { label: "Location",  value: "Sahiwal, Pakistan",     href: undefined },
              ].map(item => (
                <div key={item.label}>
                  <p style={{ fontFamily: "monospace", fontSize: "9px", letterSpacing: "0.2em", color: "#3A4858", textTransform: "uppercase", margin: "0 0 4px" }}>{item.label}</p>
                  {item.href ? (
                    <a href={item.href} target={item.href.startsWith("http") ? "_blank" : undefined} rel="noopener noreferrer"
                      style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 600, fontSize: "clamp(14px, 1.3vw, 17px)", color: "#E8EDF5", textDecoration: "none", letterSpacing: "-0.01em", transition: "color 0.2s" }}
                      onMouseEnter={e => (e.currentTarget as HTMLAnchorElement).style.color = "#3A9BD5"}
                      onMouseLeave={e => (e.currentTarget as HTMLAnchorElement).style.color = "#E8EDF5"}
                    >{item.value}</a>
                  ) : (
                    <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 600, fontSize: "clamp(14px, 1.3vw, 17px)", color: "#E8EDF5", margin: 0, letterSpacing: "-0.01em" }}>{item.value}</p>
                  )}
                </div>
              ))}
            </div>


          </div>
        </div>
      </div>

      <style>{`
        .ct-grid input::placeholder,
        .ct-grid textarea::placeholder,
        #contact input::placeholder,
        #contact textarea::placeholder { color: rgba(90,104,128,0.35); }
        @keyframes ct-pulse {
          0%, 100% { box-shadow: 0 0 6px #4ADE80; }
          50%       { box-shadow: 0 0 14px #4ADE80; }
        }
        @media (max-width: 700px) {
          .ct-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}

const inputStyle: React.CSSProperties = {
  width: "100%",
  background: "rgba(255,255,255,0.03)",
  border: "1px solid rgba(255,255,255,0.08)",
  borderRadius: "8px",
  padding: "14px 16px",
  fontFamily: "'Space Grotesk', sans-serif",
  fontSize: "15px",
  color: "#E8EDF5",
  outline: "none",
  transition: "border-color 0.3s",
  boxSizing: "border-box",
};
