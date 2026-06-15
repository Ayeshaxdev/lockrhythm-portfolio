"use client"

import { useState, useEffect } from "react"
import Link from "next/link"

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false)

  // Prevent scrolling when the menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "unset"
    }
  }, [isOpen])

  const menuItems = [
    { name: "Home", href: "/" },
    { name: "Work", href: "/#work" },
    { name: "Services", href: "/#services" },
    { name: "About", href: "/#about" },
    { name: "Studio", href: "/#studio" },
    { name: "Contact", href: "/#contact" },
  ]

  return (
    <>
      {/* The trigger button (Navbar) with the pointer-events fix for your light */}
      <header className="fixed top-0 left-0 right-0 z-40 flex items-center justify-between px-8 py-6 max-w-[100vw] text-white mix-blend-difference pointer-events-none">
        <Link href="/" className="text-xl font-bold tracking-wider uppercase z-50 relative pointer-events-auto">
          Lockrhythm
        </Link>
        
        <button 
          onClick={() => setIsOpen(true)}
          className="text-sm tracking-widest uppercase hover:text-[#3A9BD5] transition-colors z-50 relative pointer-events-auto"
        >
          Menu
        </button>
      </header>

      {/* The Full-Screen Overlay */}
      <div 
        className={`fixed inset-0 bg-[#040408] z-50 transition-transform duration-700 ease-[cubic-bezier(0.76,0,0.24,1)] flex flex-col justify-between px-8 py-6 md:px-16 md:py-12 ${
          isOpen ? "translate-y-0" : "-translate-y-full"
        }`}
      >
        {/* Overlay Header */}
        <div className="flex justify-between items-center text-white">
          <span className="text-xl font-bold tracking-wider uppercase bg-gradient-to-r from-[#3A9BD5] to-[#7B4FD4] bg-clip-text text-transparent">
            Lockrhythm
          </span>
          <button 
            onClick={() => setIsOpen(false)}
            className="text-3xl text-gray-400 hover:text-white transition-colors p-2"
            aria-label="Close menu"
          >
            ✕
          </button>
        </div>

        {/* Menu Links */}
        <nav className="flex flex-col space-y-4 md:space-y-6 mt-12">
          {menuItems.map((item, index) => (
            <Link 
              key={item.name} 
              href={item.href}
              onClick={() => setIsOpen(false)}
              className="text-5xl md:text-8xl font-bold text-[#E8EDF5] hover:text-[#3A9BD5] transition-colors w-fit tracking-tighter"
              style={{
                // Stagger the fade-in slightly for each item when open
                opacity: isOpen ? 1 : 0,
                transform: isOpen ? "translateY(0)" : "translateY(20px)",
                transition: `all 0.5s ease-out ${0.3 + (index * 0.1)}s`
              }}
            >
              {item.name}
            </Link>
          ))}
        </nav>

        {/* Overlay Footer */}
        <div className="flex justify-between items-center text-xs md:text-sm font-mono text-gray-600 tracking-widest uppercase border-t border-gray-800 pt-6 mt-12">
          <p>© 2026 LOCKRHYTHM</p>
          <p className="hidden md:block text-[#3A9BD5]">Available for new projects</p>
        </div>
      </div>
    </>
  )
}