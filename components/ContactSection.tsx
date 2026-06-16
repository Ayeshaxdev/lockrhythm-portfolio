"use client";

import { useState, useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Icons
const MapIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
    <circle cx="12" cy="10" r="3"></circle>
  </svg>
);

const MailIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
    <polyline points="22,6 12,13 2,6"></polyline>
  </svg>
);

const LinkIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
    <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
  </svg>
);

export default function ContactSection() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const sectionRef = useRef<HTMLElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      if (!cardRef.current) return;
      
      gsap.fromTo(
        cardRef.current,
        { opacity: 0, y: 50, scale: 0.98 },
        {
          opacity: 1, y: 0, scale: 1,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: { trigger: sectionRef.current, start: "top 75%" }
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
        padding: "120px 24px",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        position: "relative",
      }}
    >
      <div className="contact-card" ref={cardRef}>
        
        {/* LEFT SIDE: FORM */}
        <div className="form-side">
          <span style={{
            fontFamily: "monospace",
            fontSize: "12px",
            letterSpacing: "0.2em",
            color: "#3A9BD5",
            textTransform: "uppercase",
            display: "block",
            marginBottom: "16px",
          }}>
            04 / Contact
          </span>
          <h2 style={{
            fontFamily: "'Space Grotesk', sans-serif",
            fontWeight: 700,
            fontSize: "clamp(32px, 4vw, 48px)",
            color: "#E8EDF5",
            letterSpacing: "-0.03em",
            margin: "0 0 12px",
          }}>
            Get In Touch
          </h2>
          <p style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: "15px",
            color: "#8BAFC8",
            margin: "0 0 40px",
          }}>
            We are here for you! How can we help?
          </p>

          {!sent ? (
            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
              <input
                type="text"
                placeholder="Enter your name"
                required
                value={form.name}
                onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                className="ct-input"
              />
              <input
                type="email"
                placeholder="Enter your email address"
                required
                value={form.email}
                onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                className="ct-input"
              />
              <textarea
                placeholder="Go ahead, we are listening..."
                required
                rows={5}
                value={form.message}
                onChange={e => setForm(p => ({ ...p, message: e.target.value }))}
                className="ct-input"
                style={{ resize: "none" }}
              />
              <button
                type="submit"
                disabled={loading}
                className="ct-submit"
              >
                {loading ? "Sending..." : "Submit"}
              </button>
            </form>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "20px", padding: "40px 0", alignItems: "center", textAlign: "center", flex: 1, justifyContent: "center" }}>
              <div style={{ width: "64px", height: "64px", borderRadius: "50%", border: "2px solid #3A9BD5", display: "flex", alignItems: "center", justifyContent: "center", color: "#3A9BD5", fontSize: "28px", boxShadow: "0 0 20px rgba(58,155,213,0.2)" }}>✓</div>
              <h3 style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: "24px", color: "#E8EDF5", margin: 0, letterSpacing: "-0.02em" }}>Message Sent</h3>
              <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "15px", color: "#8BAFC8", margin: 0 }}>We'll get back to you within 24 hours.</p>
              <button onClick={() => setSent(false)} style={{ background: "none", border: "none", fontFamily: "monospace", fontSize: "12px", letterSpacing: "0.1em", color: "#3A9BD5", cursor: "pointer", marginTop: "16px" }} className="reset-btn">← Send another</button>
            </div>
          )}
        </div>

        {/* RIGHT SIDE: INFO & GRAPHICS */}
        <div className="info-side">
          {/* Abstract graphic replacing the illustration */}
          <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", minHeight: "220px", position: "relative" }}>
            <div className="orb-blur" />
            <div className="orb-solid" />
            <div className="orb-ring" />
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "24px", marginTop: "40px" }}>
            {[
              { icon: <MapIcon />, text: "Sahiwal, Pakistan", href: null },
              { icon: <MailIcon />, text: "lockrythm@gmail.com", href: "mailto:lockrythm@gmail.com" },
              { icon: <LinkIcon />, text: "LinkedIn / Instagram", href: "https://www.instagram.com/lockrhythm/" },
            ].map((item, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: "20px" }}>
                <div style={{
                  width: "48px",
                  height: "48px",
                  borderRadius: "50%",
                  border: "1px solid rgba(58, 155, 213, 0.3)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#3A9BD5",
                  background: "rgba(58, 155, 213, 0.05)"
                }}>
                  {item.icon}
                </div>
                {item.href ? (
                  <a href={item.href} target="_blank" rel="noopener noreferrer" style={{ fontFamily: "'Inter', sans-serif", fontSize: "16px", color: "#E8EDF5", textDecoration: "none", transition: "color 0.2s" }} className="info-link">
                    {item.text}
                  </a>
                ) : (
                  <span style={{ fontFamily: "'Inter', sans-serif", fontSize: "16px", color: "#E8EDF5" }}>
                    {item.text}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        .contact-card {
          max-width: 1080px;
          width: 100%;
          background: linear-gradient(145deg, rgba(15,20,30,0.8) 0%, rgba(5,8,12,0.9) 100%);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 24px;
          box-shadow: 0 40px 80px -20px rgba(0,0,0,0.8);
          display: grid;
          grid-template-columns: 1fr 1fr;
          overflow: hidden;
        }
        .form-side {
          padding: 64px;
          display: flex;
          flex-direction: column;
        }
        .info-side {
          padding: 64px;
          background: rgba(255,255,255,0.02);
          border-left: 1px solid rgba(255,255,255,0.05);
          display: flex;
          flex-direction: column;
          position: relative;
          overflow: hidden;
        }

        /* Form Inputs */
        .ct-input {
          width: 100%;
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.06);
          border-radius: 8px;
          padding: 16px 20px;
          font-family: 'Inter', sans-serif;
          font-size: 15px;
          color: #E8EDF5;
          outline: none;
          transition: all 0.3s ease;
          box-sizing: border-box;
        }
        .ct-input::placeholder { color: rgba(139,175,200,0.4); }
        .ct-input:focus {
          background: rgba(58,155,213,0.05);
          border-color: rgba(58,155,213,0.4);
          box-shadow: 0 0 15px rgba(58,155,213,0.1);
        }

        /* Submit Button */
        .ct-submit {
          width: 100%;
          padding: 18px;
          margin-top: 10px;
          background: linear-gradient(90deg, #3A9BD5, #5A7FD4);
          border: none;
          border-radius: 8px;
          font-family: 'Space Grotesk', sans-serif;
          font-weight: 700;
          font-size: 16px;
          color: #fff;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 10px 20px -10px rgba(58,155,213,0.5);
        }
        .ct-submit:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 15px 25px -10px rgba(58,155,213,0.7);
          filter: brightness(1.1);
        }
        .ct-submit:disabled {
          opacity: 0.7;
          cursor: wait;
        }

        /* Links */
        .info-link:hover {
          color: #3A9BD5 !important;
        }
        .reset-btn:hover {
          color: #E8EDF5 !important;
        }

        /* Orb Animation */
        @keyframes float {
          0%, 100% { transform: translateY(0) scale(1); }
          50% { transform: translateY(-20px) scale(1.05); }
        }
        .orb-blur {
          position: absolute;
          width: 160px;
          height: 160px;
          border-radius: 50%;
          background: linear-gradient(135deg, #3A9BD5, #7B4FD4);
          filter: blur(40px);
          opacity: 0.4;
          animation: float 8s ease-in-out infinite;
        }
        .orb-solid {
          position: absolute;
          width: 100px;
          height: 100px;
          border-radius: 50%;
          background: linear-gradient(135deg, #3A9BD5, #7B4FD4);
          box-shadow: inset 0 0 20px rgba(255,255,255,0.2);
          animation: float 6s ease-in-out infinite alternate;
        }
        .orb-ring {
          position: absolute;
          width: 140px;
          height: 140px;
          border-radius: 50%;
          border: 1px solid rgba(255,255,255,0.2);
          animation: float 7s ease-in-out infinite;
        }

        /* Responsive */
        @media (max-width: 900px) {
          .contact-card {
            grid-template-columns: 1fr;
          }
          .info-side {
            border-left: none;
            border-top: 1px solid rgba(255,255,255,0.05);
          }
        }
        @media (max-width: 600px) {
          .form-side, .info-side {
            padding: 40px 24px;
          }
        }
      `}</style>
    </section>
  );
}
