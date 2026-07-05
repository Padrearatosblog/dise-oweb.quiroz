import { useEffect, useRef } from 'react'

type Particle = {
  x: number
  y: number
  tx: number
  ty: number
  vx: number
  vy: number
  size: number
  phase: number
}

const TEXT = 'QUIROZ'

export function QuirozHero() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const particlesRef = useRef<Particle[]>([])
  const animationFrameRef = useRef<number | undefined>(undefined)
  const pointerRef = useRef({ x: -9999, y: -9999, active: false })

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const context = canvas.getContext('2d')
    if (!context) return

    const buildParticles = () => {
      const rect = canvas.getBoundingClientRect()
      const dpr = window.devicePixelRatio || 1
      const width = Math.max(320, rect.width)
      const height = Math.max(170, rect.height)

      canvas.width = Math.floor(width * dpr)
      canvas.height = Math.floor(height * dpr)
      context.setTransform(dpr, 0, 0, dpr, 0, 0)

      const sampleCanvas = document.createElement('canvas')
      const sampleContext = sampleCanvas.getContext('2d')
      if (!sampleContext) return

      sampleCanvas.width = Math.floor(width)
      sampleCanvas.height = Math.floor(height)
      sampleContext.clearRect(0, 0, width, height)
      sampleContext.fillStyle = '#ffffff'
      sampleContext.textAlign = 'center'
      sampleContext.textBaseline = 'middle'

      const fontSize = Math.min(width * 0.22, height * 0.72)
      sampleContext.font = `900 ${fontSize}px Georgia, "Times New Roman", serif`
      sampleContext.letterSpacing = `${Math.max(4, width * 0.015)}px`
      sampleContext.fillText(TEXT, width / 2, height / 2)

      const imageData = sampleContext.getImageData(0, 0, width, height)
      const gap = width < 640 ? 7 : 6
      const particles: Particle[] = []

      for (let y = 0; y < height; y += gap) {
        for (let x = 0; x < width; x += gap) {
          const alpha = imageData.data[(Math.floor(y) * Math.floor(width) + Math.floor(x)) * 4 + 3]

          if (alpha > 90) {
            particles.push({
              x: width / 2 + (Math.random() - 0.5) * width,
              y: height / 2 + (Math.random() - 0.5) * height,
              tx: x,
              ty: y,
              vx: 0,
              vy: 0,
              size: Math.random() * 1.25 + 1,
              phase: Math.random() * Math.PI * 2,
            })
          }
        }
      }

      particlesRef.current = particles
    }

    const animate = () => {
      const rect = canvas.getBoundingClientRect()
      const width = rect.width
      const height = rect.height
      const time = Date.now() * 0.001

      context.clearRect(0, 0, width, height)

      const gradient = context.createRadialGradient(
        width / 2,
        height / 2,
        0,
        width / 2,
        height / 2,
        Math.max(width, height) * 0.55,
      )
      gradient.addColorStop(0, 'rgba(245, 214, 151, 0.13)')
      gradient.addColorStop(1, 'rgba(0, 0, 0, 0)')
      context.fillStyle = gradient
      context.fillRect(0, 0, width, height)

      for (const particle of particlesRef.current) {
        const driftX = Math.cos(time + particle.phase) * 1.5
        const driftY = Math.sin(time * 1.2 + particle.phase) * 1.5
        let targetX = particle.tx + driftX
        let targetY = particle.ty + driftY

        if (pointerRef.current.active) {
          const dx = particle.x - pointerRef.current.x
          const dy = particle.y - pointerRef.current.y
          const distance = Math.sqrt(dx * dx + dy * dy)
          const radius = Math.min(width * 0.18, 130)

          if (distance < radius && distance > 0) {
            const force = (1 - distance / radius) * 28
            targetX += (dx / distance) * force
            targetY += (dy / distance) * force
          }
        }

        particle.vx += (targetX - particle.x) * 0.045
        particle.vy += (targetY - particle.y) * 0.045
        particle.vx *= 0.82
        particle.vy *= 0.82
        particle.x += particle.vx
        particle.y += particle.vy

        context.beginPath()
        context.fillStyle = 'rgba(236, 198, 120, 0.92)'
        context.shadowColor = 'rgba(236, 198, 120, 0.45)'
        context.shadowBlur = 7
        context.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
        context.fill()
      }

      animationFrameRef.current = requestAnimationFrame(animate)
    }

    const handlePointerMove = (event: PointerEvent) => {
      const rect = canvas.getBoundingClientRect()
      pointerRef.current = {
        x: event.clientX - rect.left,
        y: event.clientY - rect.top,
        active: true,
      }
    }

    const handlePointerLeave = () => {
      pointerRef.current.active = false
    }

    buildParticles()
    animate()

    const resizeObserver = new ResizeObserver(buildParticles)
    resizeObserver.observe(canvas)
    canvas.addEventListener('pointermove', handlePointerMove)
    canvas.addEventListener('pointerleave', handlePointerLeave)

    return () => {
      resizeObserver.disconnect()
      canvas.removeEventListener('pointermove', handlePointerMove)
      canvas.removeEventListener('pointerleave', handlePointerLeave)

      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [])

  return (
    <main className="min-h-screen overflow-hidden bg-black text-white">
      <section className="relative flex min-h-screen items-center justify-center px-5 py-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(128,62,28,0.2),rgba(0,0,0,0)_42%)]" />
        <div className="absolute inset-x-0 top-0 h-48 bg-gradient-to-b from-black via-black/90 to-transparent" />

        <div className="relative z-10 flex w-full max-w-6xl flex-col items-center text-center">
          <img
            src="/isotipo-quiroz.jpg"
            alt="Isotipo Quiroz"
            className="mb-5 h-auto w-20 object-contain opacity-90 sm:w-24 md:mb-6 md:w-28 lg:w-32"
          />

          <h1 className="sr-only">QUIROZ</h1>
          <canvas
            ref={canvasRef}
            aria-hidden="true"
            className="h-[170px] w-full max-w-5xl touch-none sm:h-[210px] md:h-[250px] lg:h-[290px]"
          />

          <div className="mt-2 space-y-4 md:mt-3">
            <h2 className="text-xl font-thin uppercase tracking-[0.28em] text-[#f0d098]/90 sm:text-2xl md:text-4xl">
              DIGITAL STUDIO
            </h2>
            <div className="mx-auto h-px w-24 bg-gradient-to-r from-transparent via-[#d7ac64] to-transparent" />
          </div>

          <p className="mt-8 max-w-3xl text-base font-light leading-relaxed text-white/62 sm:text-lg md:text-xl">
            Diseño web premium, cartas QR y experiencias digitales para restaurantes y negocios locales.
          </p>

          <button
            type="button"
            className="group relative mt-12 overflow-hidden border border-[#d7ac64]/35 bg-transparent px-10 py-5 text-base font-medium uppercase tracking-wider text-[#f0d098] transition-all duration-500 hover:border-[#f0d098] hover:text-white sm:px-12"
          >
            <span className="relative z-10">Ver proyectos</span>
            <span className="absolute inset-0 translate-x-[-100%] bg-gradient-to-r from-transparent via-[#d7ac64]/20 to-transparent transition-transform duration-1000 group-hover:translate-x-[100%]" />
          </button>
        </div>
      </section>
    </main>
  )
}
