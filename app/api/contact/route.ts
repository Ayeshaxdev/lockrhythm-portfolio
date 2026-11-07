import { NextRequest, NextResponse } from "next/server";

/**
 * Contact form endpoint.
 *
 * Sends the enquiry by email through Resend (https://resend.com) when these env vars are set:
 *   RESEND_API_KEY   – required to send
 *   CONTACT_TO       – inbox that receives leads (default: lockrythm@gmail.com)
 *   CONTACT_FROM     – verified sender (default: Resend's test sender)
 *
 * Without RESEND_API_KEY it answers 501 so the browser falls back to opening a pre-filled email.
 */

const esc = (s: string) =>
  s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

export async function POST(req: NextRequest) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const str = (k: string, max: number) => String(body[k] ?? "").trim().slice(0, max);
  const name = str("name", 120);
  const email = str("email", 200);
  const service = str("service", 80);
  const budget = str("budget", 40);
  const message = str("message", 5000);
  const honeypot = str("company_website", 200);

  // Bots fill hidden fields — pretend success.
  if (honeypot) return NextResponse.json({ ok: true });

  if (!name || !message || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: "Please fill in your name, a valid email and a message." }, { status: 400 });
  }

  const key = process.env.RESEND_API_KEY;
  if (!key) {
    return NextResponse.json({ fallback: "mailto" }, { status: 501 });
  }

  const to = process.env.CONTACT_TO || "lockrythm@gmail.com";
  const from = process.env.CONTACT_FROM || "LockRhythm Website <onboarding@resend.dev>";

  const rows = [
    ["Name", name],
    ["Email", email],
    ["Service", service || "—"],
    ["Budget", budget || "—"],
  ]
    .map(([k, v]) => `<tr><td style="padding:4px 12px 4px 0;color:#666">${k}</td><td><b>${esc(v)}</b></td></tr>`)
    .join("");

  const html = `<div style="font-family:system-ui,sans-serif;font-size:15px;color:#111">
    <h2 style="margin:0 0 12px">New project enquiry</h2>
    <table>${rows}</table>
    <p style="white-space:pre-wrap;margin-top:16px;padding:12px;background:#f4f6f8;border-radius:8px">${esc(message)}</p>
  </div>`;

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from,
        to: [to],
        reply_to: email,
        subject: `New enquiry: ${service || "Project"} — ${name}`,
        html,
        text: `Name: ${name}\nEmail: ${email}\nService: ${service}\nBudget: ${budget}\n\n${message}`,
      }),
    });
    if (!res.ok) {
      console.error("Resend error", res.status, await res.text());
      return NextResponse.json({ fallback: "mailto" }, { status: 502 });
    }
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("Contact send failed", e);
    return NextResponse.json({ fallback: "mailto" }, { status: 502 });
  }
}
