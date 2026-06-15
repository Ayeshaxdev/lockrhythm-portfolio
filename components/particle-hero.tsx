"use client"

import { useEffect, useRef, useState } from "react"

interface Particle {
  x: number
  y: number
  speed: number
  opacity: number
  fadeDelay: number
  fadeStart: number
  fadingOut: boolean
  color: string
  reset: () => void
  update: () => void
  draw: (ctx: CanvasRenderingContext2D) => void
}

export function ParticleHero() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isAltMode, setIsAltMode] = useState(false) // Renamed from GoldMode for clarity
  const particlesRef = useRef<Particle[]>([])
  const animationRef = useRef<number>(0)

  const createParticle = (canvas: HTMLCanvasElement): Particle => {
    const particle: Particle = {
      x: 0,
      y: 0,
      speed: 0,
      opacity: 1,
      fadeDelay: 0,
      fadeStart: 0,
      fadingOut: false,
      color: '#3A9BD5',
      reset() {
        this.x = Math.random() * canvas.width
        this.y = Math.random() * canvas.height
        this.speed = Math.random() / 5 + 0.1
        this.opacity = 1
        this.fadeDelay = Math.random() * 600 + 100
        this.fadeStart = Date.now() + this.fadeDelay
        this.fadingOut = false
        
        // LockRhythm Brand Mix
        const rand = Math.random()
        if (rand < 0.60) {
          this.color = '#3A9BD5' // 60% Blue
        } else if (rand < 0.85) {
          this.color = '#7B4FD4' // 25% Purple
        } else {
          this.color = '#E8EDF5' // 15% White
        }
      },
      update() {
        this.y -= this.speed
        if (this.y < 0) {
          this.reset()
        }

        if (!this.fadingOut && Date.now() > this.fadeStart) {
          this.fadingOut = true
        }

        if (this.fadingOut) {
          this.opacity -= 0.008
          if (this.opacity <= 0) {
            this.reset()
          }
        }
      },
      draw(ctx: CanvasRenderingContext2D) {
        ctx.fillStyle = this.color
        ctx.globalAlpha = this.opacity
        ctx.fillRect(this.x, this.y, 1.5, Math.random() * 2 + 1)
        ctx.globalAlpha = 1.0 // Reset alpha
      },
    }

    particle.reset()
    particle.y = Math.random() * canvas.height
    particle.fadeDelay = Math.random() * 600 + 100
    particle.fadeStart = Date.now() + particle.fadeDelay
    particle.fadingOut = false

    return particle
  }

  const calculateParticleCount = (canvas: HTMLCanvasElement) => {
    return Math.floor((canvas.width * canvas.height) / 6000)
  }

  const initParticles = (canvas: HTMLCanvasElement) => {
    const particleCount = calculateParticleCount(canvas)
    particlesRef.current = []
    for (let i = 0; i < particleCount; i++) {
      particlesRef.current.push(createParticle(canvas))
    }
  }

  const animate = (canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) => {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    particlesRef.current.forEach((particle) => {
      particle.update()
      particle.draw(ctx)
    })
    animationRef.current = requestAnimationFrame(() => animate(canvas, ctx))
  }

  const handleResize = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
    initParticles(canvas)
  }

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    initParticles(canvas)
    animate(canvas, ctx)

    window.addEventListener("resize", handleResize)

    return () => {
      window.removeEventListener("resize", handleResize)
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [])

  const toggleAltMode = () => {
    setIsAltMode(!isAltMode)
  }

  return (
    <div
      className={`relative h-[800px] w-full overflow-hidden bg-[#040408] ${isAltMode ? "alt-mode" : ""}`}
      style={{ 
        fontSize: "max(calc(min(600px, 80vh) * 0.03), 10px)",
        WebkitFontSmoothing: "antialiased",
        textRendering: "optimizeLegibility",
        scrollBehavior: "smooth",
      }}
    >
      <style jsx>{`
        /* Removed the destructive invert() filter */
        
        /* New Alt Mode (Purple Shift) */
        .alt-mode .spotlight-beam {
          background-image: conic-gradient(from 0deg at 50% -5%, transparent 45%, rgba(123, 79, 212, 0.35) 49%, rgba(232, 237, 245, 0.18) 50%, rgba(123, 79, 212, 0.35) 51%, transparent 55%) !important;
        }
        .alt-mode .mid-spot {
          box-shadow: 0 0 25px #7B4FD4 !important;
          border-color: #7B4FD4 !important;
        }

        /* Fixed Animation Classes (Solves the Invisible Text Bug) */
        .fade-in-header {
          opacity: 0;
          animation: load 2s ease-in 1s forwards, up 1.4s ease-out 1s forwards;
        }
        .fade-in-title {
          opacity: 0;
          transform: translateY(-1.6em);
          animation: load 2s ease-in-out 0.6s forwards;
        }
        .fade-in-subtitle {
          opacity: 0;
          transform: translateY(1em);
          animation: load 2s ease-out 1.5s forwards, up 1.4s ease-out 1.5s forwards;
        }

        @keyframes load {  
          0% { opacity: 0;}    
          100% { opacity: 1;}    
        }
        @keyframes up {      
          100% { transform: translateY(0); }    
        }
        @keyframes spotlight {
          0% { transform: rotateZ(0deg) scale(1); filter: blur(15px) opacity(0.5); }
          20% { transform: rotateZ(-1deg) scale(1.2); filter: blur(16px) opacity(0.6); }    
          40% { transform: rotateZ(2deg) scale(1.3); filter: blur(14px) opacity(0.4); }    
          60% { transform: rotateZ(-2deg) scale(1.2); filter: blur(15px) opacity(0.6); }    
          80% { transform: rotateZ(1deg) scale(1.1); filter: blur(13px) opacity(0.4); }    
          100% { transform: rotateZ(0deg) scale(1); filter: blur(15px) opacity(0.5); }    
        }
        @keyframes loadrot {
          0% { transform: rotate(0deg) scale(0);}
          100% { transform: scale(1);}
        }
        @keyframes accentload {
          0% { opacity: 0; transform: scale(0); }
          100% { opacity: 1; transform: scale(1); }
        }
      `}</style>

      {/* Header Beams and Top Orb */}

      <div
        className="header fade-in-header pointer-events-none"
        style={{
          display: "flex",
          width: "100%",
          justifyContent: "center",
          color: "#bad6f7",
          padding: "2em",
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          margin: "0 auto",
          zIndex: 9998, /* Massively escalated z-index */
        }}
      >
         
        {/* Top Orb / Black Hole */}
        <div
          className="mid-spot"
          onClick={toggleAltMode}
          onMouseEnter={(e) => {
            e.currentTarget.style.boxShadow = isAltMode
              ? "-0.3em 0.1em 0.5em 0 #E8EDF5"
              : "-0.3em 0.1em 0.5em 0 #7B4FD4, 0 0 30px #3A9BD5" 
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.boxShadow = isAltMode 
              ? "0 0 25px #7B4FD4" 
              : "0 0 20px #3A9BD5"
          }}
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: "2em",
            margin: "0 auto",
            width: "3em", /* Slightly larger hit area */
            height: "3em", /* Slightly larger hit area */
            borderRadius: "50%",
            background: "#040408",
            border: "1px solid #1B6CA8",
            boxShadow: "0 0 20px #3A9BD5",
            cursor: "pointer",
            pointerEvents: "auto", /* EXPLICITLY forces the mouse to work here */
            transition: "box-shadow 0.4s ease-in-out, border-color 0.4s ease",
            zIndex: 9999 /* Ensures it sits above literally everything */
          }}
        />

        {/* Spotlight */}
        <div
          className="spotlight"
          style={{
            pointerEvents: "none",
            position: "absolute",
            left: 0,
            right: 0,
            top: 0,
            margin: "0 auto",
            transition: "filter 1s ease-in-out",
            height: "42em",
            width: "100%",
            overflow: "hidden",
          }}
        >
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="spotlight-beam"
              style={{
                borderRadius: "0 0 50% 50%",
                position: "absolute",
                left: 0,
                right: 0,
                margin: "0 auto",
                top: "3em",
                width: "30em",
                height: "max(42em, 86vh)",
                backgroundImage:
                  "conic-gradient(from 0deg at 50% -5%, transparent 45%, rgba(27, 108, 168, 0.35) 49%, rgba(58, 155, 213, 0.18) 50%, rgba(27, 108, 168, 0.35) 51%, transparent 55%)",
                transformOrigin: "50% 0",
                filter: "blur(15px) opacity(0.5)",
                zIndex: -1,
                transition: "background-image 0.5s ease-in-out",
                transform: i === 0 ? "rotate(20deg)" : i === 1 ? "rotate(-20deg)" : "rotate(0deg)",
                animation:
                  i === 0
                    ? "load 2s ease-in-out forwards, loadrot 2s ease-in-out forwards, spotlight 17s ease-in-out infinite"
                    : i === 1
                      ? "load 2s ease-in-out forwards, loadrot 2s ease-in-out forwards, spotlight 14s ease-in-out infinite"
                      : "load 2s ease-in-out forwards, loadrot 2s ease-in-out forwards, spotlight 21s ease-in-out infinite reverse",
              }}
            />
          ))}
        </div>
      </div>

      {/* Canvas */}
      <canvas
        ref={canvasRef}
        id="particleCanvas"
        style={{
          position: "absolute",
          pointerEvents: "none",
          animation: "load 0.4s ease-in-out forwards",
          zIndex: 1,
          width: "100%",
          height: "100%"
        }}
      />

      {/* Hero Text Content */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full pt-40 px-4 text-center pointer-events-none">
        <div className="fade-in-title">
          <h1 className="text-5xl md:text-7xl font-extrabold text-white leading-[1.1] tracking-tight">
            We Build <br />
            <span className="bg-gradient-to-r from-[#3A9BD5] to-[#7B4FD4] bg-clip-text text-transparent">
              Digital Experiences
            </span>{" "}
            <br />
            That Win.
          </h1>
        </div>

        {/* Hero Tagline */}
        <p className="heroP max-w-2xl mt-8 fade-in-subtitle text-[#A0AAB2] text-xl">
          Engineering scalable software for the digital era
        </p>
      </div>
    </div>
  )
}