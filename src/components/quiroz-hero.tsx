import { useEffect, useRef } from 'react'
import { ArrowUpRight, Camera, Check, Monitor, QrCode, Sparkles, TrendingUp } from 'lucide-react'

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

const services = [
  {
    title: 'Diseño web',
    description: 'Webs rápidas, claras y pensadas para convertir visitas en reservas, llamadas o mensajes.',
    icon: Monitor,
  },
  {
    title: 'Cartas QR',
    description: 'Menús digitales limpios, multiidioma y fáciles de consultar desde el móvil.',
    icon: QrCode,
  },
  {
    title: 'Contenido visual',
    description: 'Dirección visual para que la web transmita el ambiente real del negocio.',
    icon: Camera,
  },
  {
    title: 'Presencia online',
    description: 'Estructura, textos y experiencia orientados a que el cliente entienda y actúe rápido.',
    icon: TrendingUp,
  },
]

const process = ['Entender el negocio', 'Definir estética y mensaje', 'Diseñar mobile first', 'Publicar y optimizar']

const projects = [
  {
    name: 'Restaurantes',
    label: 'Reservas, carta y confianza',
    description: 'Páginas con horario, ubicación, carta digital, WhatsApp y una primera impresión cuidada.',
  },
  {
    name: 'Bares y cafeterías',
    label: 'Más claridad en menos tiempo',
    description: 'Experiencias directas para clientes que buscan carta, ubicación o contacto desde el móvil.',
  },
  {
    name: 'Negocios locales',
    label: 'Imagen profesional accesible',
    description: 'Webs sobrias, comerciales y fáciles de mantener para comercios y servicios de Pamplona.',
  },
]

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

      const fontSize = width < 640 ? Math.min(width * 0.16, height * 0.46) : Math.min(width * 0.2, height * 0.72)
      sampleContext.font = `900 ${fontSize}px Georgia, "Times New Roman", serif`
      sampleContext.letterSpacing = `${width < 640 ? 2 : Math.max(4, width * 0.012)}px`
      sampleContext.fillText(TEXT, width / 2, height / 2)

      const imageData = sampleContext.getImageData(0, 0, width, height)
      const gap = width < 640 ? 5 : 6
      const particles: Particle[] = []

      for (let y = 0; y < height; y += gap) {
        for (let x = 0; x < width; x += gap) {
          const alpha = imageData.data[(Math.floor(y) * Math.floor(width) + Math.floor(x)) * 4 + 3]

          if (alpha > 90) {
            particles.push({
              x: x + (Math.random() - 0.5) * 24,
              y: y + (Math.random() - 0.5) * 24,
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
    <main className="min-h-screen overflow-hidden bg-[#050505] text-white">
      <header className="fixed inset-x-0 top-0 z-40 border-b border-white/8 bg-black/55 backdrop-blur-xl">
        <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 md:px-8">
          <a href="#inicio" className="flex items-center gap-3" aria-label="Quiroz inicio">
            <img src="/isotipo-quiroz.jpg" alt="" className="h-9 w-9 object-cover opacity-90" />
            <span className="text-sm font-semibold uppercase tracking-[0.24em] text-white">Quiroz</span>
          </a>
          <div className="hidden items-center gap-8 text-xs font-medium uppercase tracking-[0.18em] text-white/54 md:flex">
            <a className="transition hover:text-[#e8c982]" href="#servicios">
              Servicios
            </a>
            <a className="transition hover:text-[#e8c982]" href="#proyectos">
              Proyectos
            </a>
            <a className="transition hover:text-[#e8c982]" href="#contacto">
              Contacto
            </a>
          </div>
          <a
            href="#contacto"
            className="inline-flex h-10 items-center gap-2 border border-[#d7ac64]/35 px-4 text-xs font-semibold uppercase tracking-[0.16em] text-[#f0d098] transition hover:border-[#f0d098] hover:text-white"
          >
            Empezar
            <ArrowUpRight className="h-4 w-4" />
          </a>
        </nav>
      </header>

      <section id="inicio" className="relative flex min-h-[94svh] items-center justify-center px-5 pb-16 pt-24">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(162,105,34,0.2),rgba(0,0,0,0)_46%)]" />
        <div className="absolute inset-x-0 top-0 h-56 bg-gradient-to-b from-black via-black/88 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-64 bg-gradient-to-t from-[#090704] via-transparent to-transparent" />
        <div className="absolute left-1/2 top-[18%] h-64 w-64 -translate-x-1/2 rounded-full border border-[#d7ac64]/10" />

        <div className="relative z-10 flex w-full max-w-6xl flex-col items-center text-center">
          <div className="mb-5 flex items-center gap-4 text-[0.7rem] font-medium uppercase tracking-[0.24em] text-[#e8c982]/75">
            <span className="h-px w-10 bg-[#d7ac64]/35" />
            Webs con esencia
            <span className="h-px w-10 bg-[#d7ac64]/35" />
          </div>

          <img
            src="/isotipo-quiroz.jpg"
            alt="Isotipo Quiroz"
            className="mb-3 h-auto w-20 object-contain opacity-95 sm:w-24 md:mb-4 md:w-28 lg:w-32"
          />

          <h1 className="sr-only">QUIROZ</h1>
          <canvas
            ref={canvasRef}
            aria-hidden="true"
            className="h-[150px] w-full max-w-5xl touch-none sm:h-[205px] md:h-[255px] lg:h-[300px]"
          />

          <div className="mt-1 space-y-4 md:mt-2">
            <h2 className="text-lg font-thin uppercase tracking-[0.28em] text-[#f0d098]/90 sm:text-2xl md:text-4xl">
              DIGITAL STUDIO
            </h2>
            <div className="mx-auto h-px w-24 bg-gradient-to-r from-transparent via-[#d7ac64] to-transparent" />
          </div>

          <p className="mt-7 max-w-3xl text-balance text-base font-light leading-relaxed text-white/66 sm:text-lg md:text-xl">
            Diseño web premium, cartas QR y experiencias digitales para restaurantes y negocios locales.
          </p>

          <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row">
            <a
              href="#proyectos"
              className="group relative inline-flex min-h-14 items-center justify-center overflow-hidden border border-[#d7ac64]/40 bg-[#d7ac64]/8 px-9 text-sm font-semibold uppercase tracking-[0.18em] text-[#f0d098] transition duration-500 hover:border-[#f0d098] hover:text-white sm:px-11"
            >
              <span className="relative z-10">Ver proyectos</span>
              <span className="absolute inset-0 translate-x-[-100%] bg-gradient-to-r from-transparent via-[#d7ac64]/22 to-transparent transition-transform duration-1000 group-hover:translate-x-[100%]" />
            </a>
            <a
              href="#servicios"
              className="inline-flex min-h-14 items-center justify-center px-4 text-sm font-medium uppercase tracking-[0.18em] text-white/58 transition hover:text-white"
            >
              Qué hago
            </a>
          </div>
        </div>
      </section>

      <section id="servicios" className="border-y border-white/8 bg-[#090704] px-5 py-16 md:px-8 md:py-24">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-10 md:grid-cols-[0.9fr_1.4fr] md:items-end">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#d7ac64]">Servicios</p>
              <h2 className="mt-4 max-w-xl text-3xl font-semibold leading-tight text-white sm:text-4xl md:text-5xl">
                Diseño digital para negocios que viven del cliente real.
              </h2>
            </div>
            <p className="max-w-2xl text-base leading-relaxed text-white/58 md:justify-self-end md:text-lg">
              Trabajo especialmente con hostelería, comercios y servicios locales. La web no tiene que parecer una
              plantilla: tiene que explicar bien, cargar rápido y dar ganas de escribir, reservar o visitar.
            </p>
          </div>

          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {services.map((service) => {
              const Icon = service.icon

              return (
                <article
                  key={service.title}
                  className="border border-white/10 bg-black/28 p-6 shadow-2xl shadow-black/20 transition duration-300 hover:-translate-y-1 hover:border-[#d7ac64]/35"
                >
                  <div className="mb-8 flex h-12 w-12 items-center justify-center border border-[#d7ac64]/28 bg-[#d7ac64]/8 text-[#f0d098]">
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-semibold text-white">{service.title}</h3>
                  <p className="mt-4 text-sm leading-relaxed text-white/54">{service.description}</p>
                </article>
              )
            })}
          </div>
        </div>
      </section>

      <section className="bg-[#050505] px-5 py-16 md:px-8 md:py-24">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[1fr_1.1fr] lg:items-center">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#d7ac64]">Método</p>
            <h2 className="mt-4 text-3xl font-semibold leading-tight text-white sm:text-4xl md:text-5xl">
              Una web bonita no basta. Tiene que vender sin parecer forzada.
            </h2>
            <p className="mt-6 max-w-xl text-base leading-relaxed text-white/58 md:text-lg">
              El enfoque parte del negocio: qué necesita mostrar, qué duda tiene el cliente y qué acción interesa
              provocar en los primeros segundos.
            </p>
          </div>

          <div className="grid gap-3">
            {process.map((item, index) => (
              <div key={item} className="flex items-center gap-5 border border-white/10 bg-white/[0.03] p-5">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center border border-[#d7ac64]/30 text-sm font-semibold text-[#f0d098]">
                  0{index + 1}
                </span>
                <span className="text-lg font-medium text-white">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="proyectos" className="bg-[#0b0906] px-5 py-16 md:px-8 md:py-24">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#d7ac64]">Proyectos</p>
              <h2 className="mt-4 text-3xl font-semibold leading-tight text-white sm:text-4xl md:text-5xl">
                Piezas pensadas para sectores locales.
              </h2>
            </div>
            <a
              href="#contacto"
              className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.18em] text-[#f0d098] transition hover:text-white"
            >
              Pedir una propuesta
              <ArrowUpRight className="h-4 w-4" />
            </a>
          </div>

          <div className="mt-12 grid gap-5 lg:grid-cols-3">
            {projects.map((project) => (
              <article key={project.name} className="min-h-72 border border-white/10 bg-black/30 p-6">
                <div className="flex items-center justify-between gap-5">
                  <h3 className="text-2xl font-semibold text-white">{project.name}</h3>
                  <Sparkles className="h-5 w-5 shrink-0 text-[#d7ac64]" />
                </div>
                <p className="mt-4 text-sm font-semibold uppercase tracking-[0.18em] text-[#d7ac64]">{project.label}</p>
                <p className="mt-10 text-base leading-relaxed text-white/58">{project.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="contacto" className="relative bg-black px-5 py-16 md:px-8 md:py-24">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(215,172,100,0.16),rgba(0,0,0,0)_42%)]" />
        <div className="relative mx-auto grid max-w-7xl gap-10 border border-white/10 bg-[#080604]/86 p-6 md:p-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#d7ac64]">Contacto</p>
            <h2 className="mt-4 text-3xl font-semibold leading-tight text-white sm:text-4xl md:text-5xl">
              Construyamos una presencia online con nivel.
            </h2>
            <p className="mt-6 max-w-2xl text-base leading-relaxed text-white/58 md:text-lg">
              Si tienes un restaurante, bar, comercio o servicio local, puedo ayudarte a convertir tu idea en una web
              clara, premium y preparada para vender.
            </p>
          </div>

          <div className="space-y-4">
            {['Mobile first real', 'Textos comerciales y naturales', 'Carta QR y experiencia rápida'].map((item) => (
              <div key={item} className="flex items-center gap-3 text-white/72">
                <Check className="h-5 w-5 text-[#d7ac64]" />
                <span>{item}</span>
              </div>
            ))}
            <a
              href="https://wa.me/"
              className="mt-8 inline-flex min-h-14 w-full items-center justify-center gap-2 border border-[#d7ac64]/40 bg-[#d7ac64]/10 px-8 text-sm font-semibold uppercase tracking-[0.18em] text-[#f0d098] transition hover:border-[#f0d098] hover:text-white sm:w-auto"
            >
              Hablar por WhatsApp
              <ArrowUpRight className="h-4 w-4" />
            </a>
          </div>
        </div>
      </section>
    </main>
  )
}
