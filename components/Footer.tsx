"use client";

import { useState } from "react";
import Image from "next/image";
// Yeh stable import method hai
const Tiktok = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5"/><path d="M15 8a4 4 0 1 0 0-8c0 4.5 4 8 8 8v4c-6 0-8-4-8-4Z"/></svg>
); 

const Facebook = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
);
const Instagram = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
);
const Linkedin = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/></svg>
);
const Twitter = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/></svg>
); 

export function Footer() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("");

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("Subscribed.");
    setTimeout(() => setStatus(""), 3000);
  };

  return (
    <footer className="w-full bg-[#040408] py-16 border-t border-[rgba(255,255,255,0.05)]">
      <div className="container mx-auto px-6">
        <div className="flex flex-col items-center">
          
          <div className="mb-10 rounded-full border border-[rgba(255,255,255,0.1)] hover:border-[#3A9BD5] transition-colors duration-500 overflow-hidden w-24 h-24 flex items-center justify-center">
            <Image src="/logo.png" alt="LockRhythm Logo" width={256} height={256} className="w-full h-full object-contain object-center scale-[1.3]" />
          </div>

          <nav className="mb-10 flex flex-wrap justify-center gap-8">
            {["Work", "Services", "About", "Studio", "Contact"].map((item) => (
              <a 
                key={item} 
                href={`#${item.toLowerCase()}`} 
                className="font-mono text-[11px] uppercase tracking-widest text-[#5A6880] hover:text-[#3A9BD5] transition-colors"
              >
                {item}
              </a>
            ))}
          </nav>

          {/* Individual imports use kiye hain, namespaces ki zarurat nahi */}
          <div className="mb-10 flex space-x-6">
            <a href="https://www.instagram.com/lockrhythm/" target="_blank" className="w-10 h-10 flex items-center justify-center rounded-full border border-[rgba(255,255,255,0.1)] text-[#5A6880] hover:border-[#3A9BD5] hover:text-[#3A9BD5] transition-all"><Instagram className="h-4 w-4" /></a>
            <a href="https://www.linkedin.com/company/lockrythm" target="_blank" className="w-10 h-10 flex items-center justify-center rounded-full border border-[rgba(255,255,255,0.1)] text-[#5A6880] hover:border-[#3A9BD5] hover:text-[#3A9BD5] transition-all"><Linkedin className="h-4 w-4" /></a>
            <a href="https://x.com/lockrythm" target="_blank" className="w-10 h-10 flex items-center justify-center rounded-full border border-[rgba(255,255,255,0.1)] text-[#5A6880] hover:border-[#3A9BD5] hover:text-[#3A9BD5] transition-all"><Twitter className="h-4 w-4" /></a>
            <a href="https://www.facebook.com/lockrhythm" target="_blank" rel="noopener noreferrer" className="w-10 h-10 flex items-center justify-center rounded-full border border-[rgba(255,255,255,0.1)] text-[#5A6880] hover:border-[#3A9BD5] hover:text-[#3A9BD5] transition-all"><Facebook className="h-4 w-4" /></a>
            <a href="https://www.tiktok.com/@lockrhythm" target="_blank" rel="noopener noreferrer" className="w-10 h-10 flex items-center justify-center rounded-full border border-[rgba(255,255,255,0.1)] text-[#5A6880] hover:border-[#3A9BD5] hover:text-[#3A9BD5] transition-all"><Tiktok className="h-4 w-4" /></a>
          </div>

          <form onSubmit={handleSubscribe} className="mb-10 flex w-full max-w-sm gap-2">
            <input 
              type="email" 
              placeholder="Newsletter@LockRhythm.com" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1 bg-[#0a0a0d] border border-[rgba(255,255,255,0.1)] px-4 py-2 text-xs text-white rounded-full outline-none focus:border-[#3A9BD5]"
              required
            />
            <button type="submit" className="px-6 py-2 bg-[#3A9BD5] text-[#040408] text-xs font-bold rounded-full hover:bg-white transition-all">
              {status || "Join"}
            </button>
          </form>

          <div className="text-center">
            <p className="font-mono text-[10px] uppercase tracking-widest text-[#3A4A5A]">
              © 2026 LockRhythm. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}