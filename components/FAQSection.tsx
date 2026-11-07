"use client";

import { useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import SectionHeading from "@/components/motion/SectionHeading";

// Edit these answers to match how LockRhythm actually quotes and works.
const faqs = [
  {
    q: "How much does a project cost?",
    a: "Every project is quoted on scope, not hours. After a short discovery call you get a fixed, itemised quote — no surprise invoices. Tell us your budget range in the form below and we'll shape the plan around it.",
  },
  {
    q: "How long until my site or app is live?",
    a: "It depends on scope. A focused marketing site or landing page usually takes a few weeks; full web or mobile apps take longer. You get a dated timeline with milestones before any work starts.",
  },
  {
    q: "Do you work with clients outside Pakistan?",
    a: "Yes. We're based in Sahiwal and work remotely with clients anywhere — async updates, shared progress links and calls in your time zone.",
  },
  {
    q: "Who owns the code and design?",
    a: "You do. On final payment, the source code, design files and accounts are handed over to you.",
  },
  {
    q: "What happens after launch?",
    a: "We don't disappear. We can stay on for maintenance, improvements, SEO and growth — or hand everything over cleanly with documentation so your team can run it.",
  },
  {
    q: "What do you need from me to get started?",
    a: "Just the problem you want solved. A rough idea, a reference site or a voice note is enough — we'll turn it into a plan together.",
  },
];

export default function FAQSection() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="faq" className="relative bg-[#040408] px-5 md:px-12 lg:px-16 py-24 md:py-32">
      <div className="mx-auto max-w-[1320px] grid gap-12 lg:grid-cols-[1fr_1.4fr] lg:gap-20">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <SectionHeading
            index="05"
            label="FAQ"
            title="Questions,"
            accent="answered."
            intro="Everything clients usually ask before working with us. Still unsure? Ask us directly — it costs nothing."
          />
          <Link href="/#contact" className="btn-ghost -mt-4">
            Ask your own question →
          </Link>
        </div>

        <ul className="border-t border-white/[0.08]">
          {faqs.map((f, i) => {
            const isOpen = open === i;
            return (
              <motion.li
                key={f.q}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: i * 0.06, ease: [0.16, 1, 0.3, 1] }}
                className="border-b border-white/[0.08]"
              >
                <button
                  type="button"
                  onClick={() => setOpen(isOpen ? null : i)}
                  aria-expanded={isOpen}
                  className="group flex w-full items-center justify-between gap-6 py-6 md:py-7 text-left"
                >
                  <span className="flex items-baseline gap-4 md:gap-6">
                    <span className="font-mono text-[11px] tracking-[0.2em] text-[#3A9BD5]">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span
                      className={`font-display font-semibold text-[19px] md:text-[24px] tracking-[-0.025em] transition-colors duration-300 ${
                        isOpen ? "text-[#E8EDF5]" : "text-[#A9B6C6] group-hover:text-[#E8EDF5]"
                      }`}
                    >
                      {f.q}
                    </span>
                  </span>
                  <span
                    className={`relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full border transition-all duration-500 ${
                      isOpen ? "border-transparent bg-gradient-to-br from-[#3A9BD5] to-[#7B4FD4] rotate-180" : "border-white/15"
                    }`}
                  >
                    <span className="absolute h-[1.5px] w-3.5 bg-[#E8EDF5]" />
                    <span
                      className={`absolute h-3.5 w-[1.5px] bg-[#E8EDF5] transition-transform duration-500 ${isOpen ? "scale-y-0" : ""}`}
                    />
                  </span>
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                      className="overflow-hidden"
                    >
                      <p className="pb-7 pl-9 md:pl-12 pr-12 text-[15px] md:text-[16px] leading-[1.75] text-[#8A99AD] max-w-[640px]">
                        {f.a}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
