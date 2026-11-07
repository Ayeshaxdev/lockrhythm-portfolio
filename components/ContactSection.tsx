"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import RevealText from "@/components/motion/RevealText";
import WhatsAppIcon from "@/components/motion/WhatsAppIcon";
import { SERVICE_EVENT } from "@/lib/intro";
import { EMAIL, WHATSAPP_DISPLAY, whatsappHref } from "@/lib/contact";

const SERVICES = ["Web Engineering", "Mobile App", "UI/UX Design", "AI Solutions", "Digital Marketing", "Not sure yet"];
const BUDGETS = ["< $1k", "$1k – $5k", "$5k – $15k", "$15k+", "Let's discuss"];

const PROMISES = [
  "Reply within 24 hours",
  "Free project plan & clear quote",
  "No commitment, no spam",
];

const SOCIALS = [
  { label: "Instagram", href: "https://www.instagram.com/lockrhythm/" },
  { label: "LinkedIn", href: "https://www.linkedin.com/company/lockrythm" },
  { label: "X", href: "https://x.com/lockrythm" },
];

function Chip({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`relative rounded-full px-4 py-2.5 text-[13px] md:text-[14px] font-medium border transition-colors duration-300 ${
        active ? "border-transparent text-white" : "border-white/12 text-[#A9B6C6] hover:border-white/35 hover:text-white"
      }`}
    >
      {active && (
        <motion.span
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="absolute inset-0 rounded-full bg-gradient-to-r from-[#3A9BD5] to-[#7B4FD4]"
        />
      )}
      <span className="relative">{children}</span>
    </button>
  );
}

function Field({
  n,
  label,
  children,
}: {
  n: string;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="group relative border-b border-white/[0.09] pb-6 mb-8 focus-within:border-transparent">
      <label className="block font-mono text-[10px] tracking-[0.2em] uppercase text-[#5A6880] mb-3 group-focus-within:text-[#3A9BD5] transition-colors">
        {n} — {label}
      </label>
      {children}
      <span className="pointer-events-none absolute -bottom-px left-0 h-px w-full origin-left scale-x-0 bg-gradient-to-r from-[#3A9BD5] to-[#7B4FD4] transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-focus-within:scale-x-100" />
    </div>
  );
}

const inputCls =
  "w-full bg-transparent border-0 outline-none p-0 font-display font-medium text-[clamp(20px,2.4vw,28px)] tracking-[-0.02em] text-[#E8EDF5] caret-[#3A9BD5] placeholder:text-[#3A4A5A] placeholder:font-normal";

export default function ContactSection() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [service, setService] = useState("");
  const [budget, setBudget] = useState("");
  const [message, setMessage] = useState("");
  const [hp, setHp] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "mailto" | "error">("idle");
  const [error, setError] = useState("");

  // "Discuss this" buttons elsewhere pre-select a service.
  useEffect(() => {
    const h = (e: Event) => {
      const s = (e as CustomEvent<string>).detail;
      if (SERVICES.includes(s)) setService(s);
    };
    window.addEventListener(SERVICE_EVENT, h);
    return () => window.removeEventListener(SERVICE_EVENT, h);
  }, []);

  const mailtoHref = () => {
    const subject = `Project enquiry: ${service || "New project"} — ${name}`;
    const bodyText = `Hi LockRhythm,\n\n${message}\n\n—\nName: ${name}\nEmail: ${email}\nService: ${service || "-"}\nBudget: ${budget || "-"}`;
    return `mailto:${EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(bodyText)}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!name.trim() || !email.trim() || !message.trim()) {
      setError("Please add your name, email and a few words about the project.");
      return;
    }
    setStatus("sending");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, service, budget, message, company_website: hp }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok && data.ok) {
        setStatus("sent");
        return;
      }
      if (data.fallback === "mailto") {
        window.location.href = mailtoHref();
        setStatus("mailto");
        return;
      }
      setError(data.error || "Something went wrong.");
      setStatus("error");
    } catch {
      window.location.href = mailtoHref();
      setStatus("mailto");
    }
  };

  const reset = () => {
    setStatus("idle");
    setName("");
    setEmail("");
    setMessage("");
    setService("");
    setBudget("");
  };

  return (
    <section id="contact" className="relative bg-[#040408] px-5 md:px-12 lg:px-16 py-24 md:py-32 overflow-hidden">
      {/* Ambient glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-40 right-[-20%] h-[700px] w-[700px] rounded-full opacity-60 blur-[120px]"
        style={{ background: "radial-gradient(circle, rgba(123,79,212,0.25), transparent 65%)" }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute bottom-[-20%] left-[-10%] h-[600px] w-[600px] rounded-full opacity-60 blur-[120px]"
        style={{ background: "radial-gradient(circle, rgba(58,155,213,0.18), transparent 65%)" }}
      />

      <div className="relative mx-auto max-w-[1320px]">
        <motion.span
          className="block font-mono text-[11px] tracking-[0.2em] uppercase text-[#3A9BD5] mb-7"
          initial={{ opacity: 0, x: -16 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
        >
          06 / Contact
        </motion.span>
        <motion.div
          className="h-px mb-14 origin-left"
          style={{ background: "linear-gradient(90deg, #3A9BD5 0%, #7B4FD4 50%, transparent 100%)" }}
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.4, ease: [0.65, 0, 0.35, 1] }}
        />

        <div className="grid gap-14 lg:grid-cols-[1fr_1.15fr] lg:gap-24">
          {/* Left */}
          <div className="lg:sticky lg:top-28 lg:self-start">
            <RevealText
              segments={["Let's build", { text: "", br: true }, { text: "something", className: "text-gradient" }, "real."]}
              className="font-display font-bold text-[clamp(52px,7.5vw,108px)] leading-[0.95] tracking-[-0.045em] text-[#E8EDF5]"
            />
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="mt-8 max-w-[420px] text-[16px] leading-relaxed text-[#8A99AD]"
            >
              Tell us what you&apos;re building. We&apos;ll reply with honest advice, a plan and a quote — even if we&apos;re
              not the right fit.
            </motion.p>

            <ul className="mt-8 flex flex-col gap-3">
              {PROMISES.map((p, i) => (
                <motion.li
                  key={p}
                  initial={{ opacity: 0, x: -16 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.4 + i * 0.1 }}
                  className="flex items-center gap-3 text-[15px] text-[#E8EDF5]"
                >
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#3A9BD5]/15 text-[#3A9BD5] text-[12px]">
                    ✓
                  </span>
                  {p}
                </motion.li>
              ))}
            </ul>

            <div className="mt-10 flex flex-col gap-3 text-[15px]">
              <a href={`mailto:${EMAIL}`} className="link-underline self-start text-[#E8EDF5]">
                {EMAIL}
              </a>
              {/* WhatsApp: fastest channel for most clients */}
              <a
                href={whatsappHref()}
                target="_blank"
                rel="noopener noreferrer"
                className="group mt-1 inline-flex self-start items-center gap-3 rounded-full border border-[#25D366]/40 bg-[#25D366]/10 py-2 pl-2 pr-5 text-[#E8EDF5] transition-colors hover:bg-[#25D366]/20"
              >
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#25D366] text-white transition-transform duration-500 group-hover:scale-110">
                  <WhatsAppIcon className="h-[18px] w-[18px]" />
                </span>
                <span className="flex flex-col leading-tight">
                  <span className="text-[14px] font-semibold">Chat on WhatsApp</span>
                  <span className="text-[12px] text-[#8A99AD]">{WHATSAPP_DISPLAY}</span>
                </span>
              </a>
              <span className="text-[#7D8BA0]">Sahiwal, Pakistan — working worldwide</span>
            </div>

            <div className="mt-8 flex gap-3">
              {SOCIALS.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full border border-white/10 px-4 py-2 text-[13px] text-[#A9B6C6] transition-colors hover:border-[#3A9BD5] hover:text-white"
                >
                  {s.label}
                </a>
              ))}
            </div>
          </div>

          {/* Right — form */}
          <div className="relative">
            <AnimatePresence mode="wait">
              {status === "sent" || status === "mailto" ? (
                <motion.div
                  key="done"
                  initial={{ opacity: 0, y: 30, filter: "blur(8px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                  className="flex flex-col gap-6 rounded-3xl border border-white/[0.08] bg-white/[0.02] p-10 md:p-14"
                >
                  <motion.div
                    initial={{ scale: 0, rotate: -90 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: "spring", stiffness: 200, damping: 14, delay: 0.2 }}
                    className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-[#3A9BD5] to-[#7B4FD4] text-2xl text-white"
                  >
                    ✓
                  </motion.div>
                  <h3 className="font-display font-bold text-[clamp(30px,3.4vw,44px)] leading-[1.05] tracking-[-0.035em] text-[#E8EDF5]">
                    {status === "sent" ? `Thanks, ${name.split(" ")[0] || "friend"} — message received.` : "Almost there — hit send in your email app."}
                  </h3>
                  <p className="text-[16px] leading-relaxed text-[#8A99AD]">
                    {status === "sent"
                      ? "We'll review your project and reply within 24 hours with next steps."
                      : "We opened a pre-filled email to our team. If nothing opened, write to us directly:"}
                  </p>
                  {status === "mailto" && (
                    <a href={mailtoHref()} className="link-underline self-start text-[#3A9BD5] text-[16px]">
                      {EMAIL}
                    </a>
                  )}
                  <button type="button" onClick={reset} className="self-start text-[14px] text-[#A9B6C6] hover:text-white">
                    ← Send another message
                  </button>
                </motion.div>
              ) : (
                <motion.form
                  key="form"
                  onSubmit={handleSubmit}
                  noValidate
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
                >
                  {/* Honeypot (hidden from people) */}
                  <input
                    type="text"
                    name="company_website"
                    tabIndex={-1}
                    autoComplete="off"
                    value={hp}
                    onChange={(e) => setHp(e.target.value)}
                    className="absolute -left-[9999px] h-0 w-0 opacity-0"
                    aria-hidden
                  />

                  <Field n="01" label="What do you need?">
                    <div className="flex flex-wrap gap-2 pt-1">
                      {SERVICES.map((s) => (
                        <Chip key={s} active={service === s} onClick={() => setService(service === s ? "" : s)}>
                          {s}
                        </Chip>
                      ))}
                    </div>
                  </Field>

                  <div className="grid md:grid-cols-2 md:gap-8">
                    <Field n="02" label="Your name">
                      <input
                        type="text"
                        name="name"
                        autoComplete="name"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="John Doe"
                        className={inputCls}
                      />
                    </Field>
                    <Field n="03" label="Your email">
                      <input
                        type="email"
                        name="email"
                        autoComplete="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@company.com"
                        className={inputCls}
                      />
                    </Field>
                  </div>

                  <Field n="04" label="Budget range">
                    <div className="flex flex-wrap gap-2 pt-1">
                      {BUDGETS.map((b) => (
                        <Chip key={b} active={budget === b} onClick={() => setBudget(budget === b ? "" : b)}>
                          {b}
                        </Chip>
                      ))}
                    </div>
                  </Field>

                  <Field n="05" label="Tell us about your project">
                    <textarea
                      name="message"
                      required
                      rows={4}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="I need a web app that…"
                      className={`${inputCls} !text-[clamp(18px,2vw,24px)] resize-none leading-[1.5]`}
                    />
                  </Field>

                  {error && (
                    <motion.p
                      initial={{ opacity: 0, y: -6 }}
                      animate={{ opacity: 1, y: 0 }}
                      role="alert"
                      className="mb-6 text-[14px] text-[#F08A8A]"
                    >
                      {error}
                    </motion.p>
                  )}

                  <div className="flex flex-col sm:flex-row sm:items-center gap-5">
                    <button type="submit" disabled={status === "sending"} className="btn-primary disabled:opacity-60 disabled:cursor-wait">
                      {status === "sending" ? (
                        <>
                          <span className="h-4 w-4 rounded-full border-2 border-current border-t-transparent animate-spin" />
                          Sending…
                        </>
                      ) : (
                        <>
                          Send project brief <span className="btn-arrow">→</span>
                        </>
                      )}
                    </button>
                    <span className="text-[13px] text-[#5A6880]">Takes 60 seconds. We reply within 24h.</span>
                  </div>
                </motion.form>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
