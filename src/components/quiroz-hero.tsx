import { useEffect, useRef } from 'react'
import {
  ArrowUpRight,
  Camera,
  Check,
  Clock3,
  Monitor,
  MousePointer2,
  QrCode,
  Sparkles,
  TrendingUp,
} from 'lucide-react'

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
const BASE_URL = import.meta.env.BASE_URL
const ISOTYPE_SRC = `${BASE_URL}isotipo-quiroz.jpg`
const PHOTO_SRC = `${BASE_URL}bryan-quiroz.jpg`

const services = [
  {
    title: 'Diseño web',
    description: 'Webs premium, rápidas y enfocadas en convertir visitas en reservas, llamadas o mensajes.',
    icon: Monitor,
  },
  {
    title: 'Menús QR',
    description: 'Cartas digitales claras, elegantes y multiidioma para mejorar la experiencia en mesa.',
    icon: QrCode,
  },
  {
    title: 'Contenido visual',
    description: 'Criterio visual para mostrar el ambiente, producto y personalidad real del negocio.',
    icon: Camera,
  },
  {
    title: 'Presencia online',
    description: 'Estructura, textos y llamadas a la acción para que el cliente entienda y actúe rápido.',
    icon: TrendingUp,
  },
]

const projects = [
  {
    type: 'Hostelería',
    title: 'Web para restaurantes',
    description: 'Hero potente, reservas, carta digital, ubicación, horarios y WhatsApp visibles desde móvil.',
  },
  {
    type: 'San Fermín',
    title: 'Cartas QR multiidioma',
    description: 'Menús ES/EN/FR con bloques numerados, alérgenos y explicación de platos típicos.',
  },
  {
    type: 'Local',
    title: 'Comercios y servicios',
    description: 'Páginas sobrias, comerciales y fáciles de mantener para negocios reales de Pamplona.',
  },
]

const process = [
  'Entiendo el negocio y el cliente real',
  'Defino una dirección visual con personalidad',
  'Diseño mobile first y textos que venden',
  'Publico, reviso y dejo la web preparada',
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
      const height = Math.max(160, rect.height)

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

      const fontSize = width < 640 ? Math.min(width * 0.17, height * 0.48) : Math.min(width * 0.18, height * 0.7)
      sampleContext.font = `900 ${fontSize}px Georgia, "Times New Roman", serif`
      sampleContext.letterSpacing = `${width < 640 ? 2 : Math.max(4, width * 0.01)}px`
      sampleContext.fillText(TEXT, width / 2, height / 2)

      const imageData = sampleContext.getImageData(0, 0, width, height)
      const gap = width < 640 ? 5 : 6
      const particles: Particle[] = []

      for (let y = 0; y < height; y += gap) {
        for (let x = 0; x < width; x += gap) {
          const alpha = imageData.data[(Math.floor(y) * Math.floor(width) + Math.floor(x)) * 4 + 3]

          if (alpha > 90) {
            particles.push({
              x: x + (Math.random() - 0.5) * 18,
              y: y + (Math.random() - 0.5) * 18,
              tx: x,
              ty: y,
              vx: 0,
              vy: 0,
              size: Math.random() * 1.15 + 0.9,
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

      const glow = context.createRadialGradient(width / 2, height / 2, 0, width / 2, height / 2, width * 0.52)
      glow.addColorStop(0, 'rgba(231, 190, 112, 0.14)')
      glow.addColorStop(1, 'rgba(0, 0, 0, 0)')
      context.fillStyle = glow
      context.fillRect(0, 0, width, height)

      for (const particle of particlesRef.current) {
        const driftX = Math.cos(time + particle.phase) * 1.25
        const driftY = Math.sin(time * 1.15 + particle.phase) * 1.25
        let targetX = particle.tx + driftX
        let targetY = particle.ty + driftY

        if (pointerRef.current.active) {
          const dx = particle.x - pointerRef.current.x
          const dy = particle.y - pointerRef.current.y
          const distance = Math.sqrt(dx * dx + dy * dy)
          const radius = Math.min(width * 0.2, 140)

          if (distance < radius && distance > 0) {
            const force = (1 - distance / radius) * 30
            targetX += (dx / distance) * force
            targetY += (dy / distance) * force
          }
        }

        particle.vx += (targetX - particle.x) * 0.048
        particle.vy += (targetY - particle.y) * 0.048
        particle.vx *= 0.83
        particle.vy *= 0.83
        particle.x += particle.vx
        particle.y += particle.vy

        context.beginPath()
        context.fillStyle = 'rgba(238, 203, 134, 0.94)'
        context.shadowColor = 'rgba(238, 203, 134, 0.38)'
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
    <main className="min-h-screen overflow-hidden bg-[#050403] text-white">
      <div className="fixed inset-0 -z-10 bg-[radial-gradient(circle_at_20%_12%,rgba(221,172,88,0.12),transparent_28%),radial-gradient(circle_at_82%_0%,rgba(128,65,28,0.16),transparent_32%),linear-gradient(180deg,#050403_0%,#0b0805_48%,#050403_100%)]" />

      <header className="fixed inset-x-0 top-0 z-40 border-b border-white/8 bg-[#050403]/72 backdrop-blur-xl">
        <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 md:h-20 md:px-8">
          <a href="#inicio" className="flex items-center gap-3" aria-label="Quiroz inicio">
            <img src={ISOTYPE_SRC} alt="" className="h-9 w-9 object-cover opacity-95 md:h-10 md:w-10" />
            <span className="text-sm font-semibold uppercase tracking-[0.24em] text-white">Quiroz</span>
          </a>

          <div className="hidden items-center gap-8 text-xs font-medium uppercase tracking-[0.2em] text-white/50 lg:flex">
            <a className="transition hover:text-[#f0d098]" href="#servicios">
              Servicios
            </a>
            <a className="transition hover:text-[#f0d098]" href="#proyectos">
              Proyectos
            </a>
            <a className="transition hover:text-[#f0d098]" href="#proceso">
              Proceso
            </a>
            <a className="transition hover:text-[#f0d098]" href="#contacto">
              Contacto
            </a>
          </div>

          <a
            href="#contacto"
            className="inline-flex h-10 items-center gap-2 border border-[#d9ad62]/40 bg-[#d9ad62]/8 px-4 text-xs font-semibold uppercase tracking-[0.16em] text-[#f0d098] transition hover:border-[#f0d098] hover:text-white md:h-11 md:px-5"
          >
            Empezar
            <ArrowUpRight className="h-4 w-4" />
          </a>
        </nav>
      </header>

      <section id="inicio" className="relative px-5 pb-20 pt-24 md:px-8 md:pb-28 md:pt-32">
        <div className="absolute inset-x-0 top-0 h-72 bg-gradient-to-b from-black/80 to-transparent" />
        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
          <div className="relative z-10">
            <div className="inline-flex items-center gap-3 border border-[#d9ad62]/18 bg-white/[0.025] px-4 py-2 text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-[#e9c986]/78">
              <Sparkles className="h-3.5 w-3.5" />
              Webs con esencia para negocios reales
            </div>

            <div className="mt-8 flex items-center gap-5">
              <img src={ISOTYPE_SRC} alt="Isotipo Quiroz" className="h-20 w-20 object-contain opacity-95 md:h-24 md:w-24" />
              <div className="h-px flex-1 bg-gradient-to-r from-[#d9ad62]/45 to-transparent" />
            </div>

            <h1 className="mt-8 max-w-4xl text-4xl font-semibold leading-[0.98] tracking-[-0.04em] text-white sm:text-6xl lg:text-7xl">
              Diseño web premium para hostelería, comercios y servicios locales.
            </h1>

            <p className="mt-7 max-w-2xl text-lg leading-relaxed text-white/62">
              Creo webs, cartas QR y experiencias digitales que transmiten confianza desde el primer vistazo y ayudan
              a que el cliente actúe: reservar, escribir, visitar o comprar.
            </p>

            <div className="mt-9 flex flex-col gap-4 sm:flex-row">
              <a
                href="#proyectos"
                className="group relative inline-flex min-h-14 items-center justify-center overflow-hidden border border-[#d9ad62]/45 bg-[#d9ad62]/10 px-8 text-sm font-semibold uppercase tracking-[0.18em] text-[#f0d098] transition hover:border-[#f0d098] hover:text-white"
              >
                <span className="relative z-10">Ver proyectos</span>
                <span className="absolute inset-0 translate-x-[-100%] bg-gradient-to-r from-transparent via-[#d9ad62]/22 to-transparent transition-transform duration-1000 group-hover:translate-x-[100%]" />
              </a>
              <a
                href="#servicios"
                className="inline-flex min-h-14 items-center justify-center gap-2 px-2 text-sm font-semibold uppercase tracking-[0.18em] text-white/56 transition hover:text-white"
              >
                Qué puedo crear
                <ArrowUpRight className="h-4 w-4" />
              </a>
            </div>

            <div className="mt-10 grid max-w-2xl grid-cols-3 border-y border-white/10 py-5">
              {[
                ['Mobile', 'first real'],
                ['QR', 'multiidioma'],
                ['Pamplona', 'negocio local'],
              ].map(([value, label]) => (
                <div key={value} className="border-r border-white/10 px-3 last:border-r-0 first:pl-0">
                  <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#f0d098]">{value}</p>
                  <p className="mt-1 text-xs uppercase tracking-[0.16em] text-white/38">{label}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="relative z-10">
            <div className="absolute -left-4 top-10 hidden h-48 w-48 rounded-full border border-[#d9ad62]/12 lg:block" />
            <div className="relative ml-auto max-w-[520px] border border-white/10 bg-black/38 p-3 shadow-2xl shadow-black/50">
              <div className="relative aspect-[4/5] overflow-hidden bg-[#100c08]">
                <img
                  src={PHOTO_SRC}
                  alt="Bryan Quiroz trabajando en una web"
                  className="h-full w-full object-cover object-[50%_45%] opacity-88 saturate-[0.92]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/10 to-black/16" />
                <div className="absolute bottom-0 left-0 right-0 p-5 md:p-6">
                  <div className="border border-white/12 bg-black/58 p-4 backdrop-blur-md">
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#f0d098]">Bryan Quiroz</p>
                    <p className="mt-2 text-sm leading-relaxed text-white/66">
                      Diseño desde la experiencia real de negocio: claridad, imagen y velocidad para vender mejor.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="relative z-10 mx-auto mt-14 max-w-7xl border-y border-white/8 py-8">
          <div className="mb-4 flex items-center justify-between gap-4 text-xs uppercase tracking-[0.2em] text-white/40">
            <span>Firma interactiva</span>
            <span className="inline-flex items-center gap-2">
              <MousePointer2 className="h-3.5 w-3.5 text-[#d9ad62]" />
              Mueve el cursor
            </span>
          </div>
          <h2 className="sr-only">QUIROZ</h2>
          <canvas
            ref={canvasRef}
            aria-hidden="true"
            className="h-[150px] w-full touch-none sm:h-[190px] md:h-[250px] lg:h-[290px]"
          />
          <div className="mt-5 flex flex-col items-center justify-center gap-3 text-center md:flex-row">
            <span className="text-xl font-thin uppercase tracking-[0.3em] text-[#f0d098]/90 md:text-3xl">
              Digital Studio
            </span>
            <span className="hidden h-px w-16 bg-[#d9ad62]/40 md:block" />
            <span className="max-w-xl text-sm leading-relaxed text-white/48">
              Diseño web premium, cartas QR y experiencias digitales para restaurantes y negocios locales.
            </span>
          </div>
        </div>
      </section>

      <section id="servicios" className="border-y border-white/8 bg-[#090705] px-5 py-18 md:px-8 md:py-24">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-8 md:grid-cols-[0.8fr_1.2fr] md:items-end">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#d9ad62]">Servicios</p>
              <h2 className="mt-4 text-3xl font-semibold leading-tight text-white sm:text-4xl md:text-5xl">
                Lo que necesita una marca local para parecer seria y vender mejor.
              </h2>
            </div>
            <p className="max-w-2xl text-base leading-relaxed text-white/58 md:justify-self-end md:text-lg">
              No diseño webs para decorar. Diseño una presencia digital que ordena la información, mejora la
              percepción del negocio y facilita que el cliente llegue a la acción correcta.
            </p>
          </div>

          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {services.map((service) => {
              const Icon = service.icon

              return (
                <article
                  key={service.title}
                  className="group border border-white/10 bg-black/30 p-6 transition duration-300 hover:-translate-y-1 hover:border-[#d9ad62]/40 hover:bg-[#120d07]"
                >
                  <div className="mb-8 flex h-12 w-12 items-center justify-center border border-[#d9ad62]/30 bg-[#d9ad62]/8 text-[#f0d098] transition group-hover:scale-105">
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

      <section id="proyectos" className="px-5 py-18 md:px-8 md:py-24">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#d9ad62]">Proyectos destacados</p>
              <h2 className="mt-4 max-w-3xl text-3xl font-semibold leading-tight text-white sm:text-4xl md:text-5xl">
                Piezas digitales para negocios que necesitan claridad y presencia.
              </h2>
            </div>
            <a
              href="#contacto"
              className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.18em] text-[#f0d098] transition hover:text-white"
            >
              Pedir propuesta
              <ArrowUpRight className="h-4 w-4" />
            </a>
          </div>

          <div className="mt-12 grid gap-5 lg:grid-cols-3">
            {projects.map((project, index) => (
              <article key={project.title} className="min-h-80 border border-white/10 bg-[#090705] p-6">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#d9ad62]">
                    {project.type}
                  </span>
                  <span className="text-sm text-white/28">0{index + 1}</span>
                </div>
                <h3 className="mt-12 text-2xl font-semibold text-white">{project.title}</h3>
                <p className="mt-5 text-base leading-relaxed text-white/56">{project.description}</p>
                <div className="mt-10 h-px w-full bg-gradient-to-r from-[#d9ad62]/50 to-transparent" />
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="proceso" className="border-y border-white/8 bg-[#0b0805] px-5 py-18 md:px-8 md:py-24">
        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#d9ad62]">Proceso</p>
            <h2 className="mt-4 text-3xl font-semibold leading-tight text-white sm:text-4xl md:text-5xl">
              Un proceso simple, pero con intención en cada decisión.
            </h2>
            <p className="mt-6 max-w-xl text-base leading-relaxed text-white/58 md:text-lg">
              Cada bloque se plantea pensando en cómo mira un cliente desde el móvil: qué entiende, qué siente y qué
              puede hacer sin perder tiempo.
            </p>
          </div>

          <div className="grid gap-3">
            {process.map((item, index) => (
              <div key={item} className="flex items-start gap-5 border border-white/10 bg-black/26 p-5">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center border border-[#d9ad62]/30 text-sm font-semibold text-[#f0d098]">
                  0{index + 1}
                </span>
                <div>
                  <p className="text-lg font-medium text-white">{item}</p>
                  <p className="mt-2 text-sm leading-relaxed text-white/44">
                    {index === 0 && 'Antes de diseñar, ordeno objetivos, prioridades y tipo de cliente.'}
                    {index === 1 && 'Defino una estética propia, no una plantilla genérica.'}
                    {index === 2 && 'Diseño primero para móvil, con jerarquía clara y textos comerciales.'}
                    {index === 3 && 'Dejo una base sólida para publicar, revisar y seguir creciendo.'}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="contacto" className="relative px-5 py-18 md:px-8 md:py-24">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(217,173,98,0.16),transparent_42%)]" />
        <div className="relative mx-auto grid max-w-7xl gap-10 border border-white/10 bg-[#080604]/88 p-6 shadow-2xl shadow-black/40 md:p-10 lg:grid-cols-[1fr_0.85fr] lg:items-center">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#d9ad62]">Contacto</p>
            <h2 className="mt-4 text-3xl font-semibold leading-tight text-white sm:text-4xl md:text-5xl">
              Si tu negocio se ve mejor, se vende mejor.
            </h2>
            <p className="mt-6 max-w-2xl text-base leading-relaxed text-white/58 md:text-lg">
              Construyamos una web con imagen profesional, rapidez, carta digital si la necesitas y una experiencia
              clara para el cliente.
            </p>
          </div>

          <div>
            <div className="space-y-4">
              {['Diseño premium y accesible', 'Enfoque real para hostelería', 'Mobile first y preparado para vender'].map(
                (item) => (
                  <div key={item} className="flex items-center gap-3 text-white/70">
                    <Check className="h-5 w-5 text-[#d9ad62]" />
                    <span>{item}</span>
                  </div>
                ),
              )}
            </div>
            <a
              href="https://wa.me/"
              className="mt-8 inline-flex min-h-14 w-full items-center justify-center gap-2 border border-[#d9ad62]/45 bg-[#d9ad62]/10 px-8 text-sm font-semibold uppercase tracking-[0.18em] text-[#f0d098] transition hover:border-[#f0d098] hover:text-white sm:w-auto"
            >
              Hablar por WhatsApp
              <Clock3 className="h-4 w-4" />
            </a>
          </div>
        </div>
      </section>
    </main>
  )
}
