import { useEffect, useRef, useState } from 'react'
import brandPosterSrc from '../../LOGO.jpeg'
import brandIsotypeSrc from '../../isotipo-quiroz.jpg'
import brandSignatureSrc from '../../logo-quiroz.jpg'
import {
  ArrowDown,
  ArrowUpRight,
  Check,
  Code2,
  Layout,
  Menu,
  MessageCircle,
  MousePointer2,
  QrCode,
  X,
} from 'lucide-react'

const BASE_URL = import.meta.env.BASE_URL
const PHOTO_SRC = `${BASE_URL}bryan-quiroz.jpg`

const projects = [
  {
    number: '01',
    eyebrow: 'Hostelería · Web & Reservas',
    title: 'Restaurante con una presencia a la altura de su cocina.',
    description:
      'Una experiencia digital que convierte el ambiente del local en deseo: carta, reservas, ubicación y contacto sin fricción.',
    color: '#9c4f37',
    visual: 'restaurant',
  },
  {
    number: '02',
    eyebrow: 'San Fermín · Producto digital',
    title: 'Carta QR multiidioma pensada para horas punta.',
    description:
      'Menús claros en español, inglés y francés, con alérgenos, platos típicos y una navegación diseñada para decidir rápido.',
    color: '#c8a66c',
    visual: 'menu',
  },
  {
    number: '03',
    eyebrow: 'Negocio local · Identidad digital',
    title: 'Una web que convierte experiencia en confianza.',
    description:
      'Estructura comercial, mensajes directos y una estética propia para profesionales que necesitan dejar de parecer uno más.',
    color: '#62664d',
    visual: 'studio',
  },
]

const services = [
  {
    icon: Layout,
    title: 'Diseño web estratégico',
    description: 'Dirección visual, arquitectura y mensajes pensados para que tu negocio se entienda y se recuerde.',
  },
  {
    icon: Code2,
    title: 'Desarrollo a medida',
    description: 'Una web rápida, responsive y cuidada hasta el último detalle. Sin sensación de plantilla genérica.',
  },
  {
    icon: QrCode,
    title: 'Cartas y experiencias QR',
    description: 'Menús digitales atractivos, fáciles de actualizar y preparados para clientes internacionales.',
  },
  {
    icon: MousePointer2,
    title: 'Conversión y contenido',
    description: 'Textos, jerarquía y llamadas a la acción que acompañan al usuario hasta contactar, reservar o comprar.',
  },
]

const process = [
  ['01', 'Descubrir', 'Entiendo el negocio, la competencia y qué debe sentir el cliente al llegar.'],
  ['02', 'Dirigir', 'Defino una dirección visual y verbal propia, coherente con tu valor real.'],
  ['03', 'Construir', 'Diseño y desarrollo cada sección con prioridad absoluta para móvil.'],
  ['04', 'Lanzar', 'Reviso, optimizo y dejo una base preparada para crecer contigo.'],
]

function ProjectVisual({ type }: { type: string }) {
  if (type === 'restaurant') {
    return (
      <div className="project-scene restaurant-scene" aria-hidden="true">
        <div className="restaurant-light" />
        <div className="restaurant-window">
          <span>BRASA</span>
          <p>Cocina honesta.<br />Producto local.</p>
          <i>Reservar mesa →</i>
        </div>
        <div className="restaurant-table" />
      </div>
    )
  }

  if (type === 'menu') {
    return (
      <div className="project-scene menu-scene" aria-hidden="true">
        <div className="phone phone-back">
          <span>MENU / 02</span>
          <strong>Para<br />compartir</strong>
          <i>ES · EN · FR</i>
        </div>
        <div className="phone phone-front">
          <span>CASA QUIROZ</span>
          <strong>La carta</strong>
          <div className="menu-line" />
          <div className="menu-line short" />
          <div className="menu-line" />
          <b>Escanea. Elige. Disfruta.</b>
        </div>
      </div>
    )
  }

  return (
    <div className="project-scene studio-scene" aria-hidden="true">
      <div className="studio-grid" />
      <span className="studio-kicker">ESTUDIO / 2026</span>
      <strong>Ideas que<br /><em>se sienten.</em></strong>
      <div className="studio-orbit"><span>Q</span></div>
      <p>Estrategia · Diseño · Desarrollo</p>
    </div>
  )
}

function Interactive3DShowcase() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const sceneRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const scene = sceneRef.current
    const context = canvas?.getContext('2d')
    if (!canvas || !scene || !context) return
    let frame = 0
    let width = 0
    let height = 0
    let px = 0
    let py = 0
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const stars = Array.from({ length: 86 }, (_, i) => ({ x: ((i * 73) % 997) / 997, y: ((i * 151) % 613) / 613, size: .4 + (i % 4) * .35, phase: i * .71 }))

    const resize = () => {
      const bounds = scene.getBoundingClientRect()
      const ratio = Math.min(window.devicePixelRatio || 1, 2)
      width = bounds.width
      height = bounds.height
      canvas.width = Math.round(width * ratio)
      canvas.height = Math.round(height * ratio)
      context.setTransform(ratio, 0, 0, ratio, 0, 0)
    }
    const mountain = (side: number, depth: number, color: string, horizon: number) => {
      context.beginPath()
      context.moveTo(side < 0 ? 0 : width, horizon + 25)
      for (let i = 0; i <= 8; i += 1) {
        const part = i / 8
        const x = side < 0 ? part * width * .49 : width - part * width * .49
        const rise = Math.sin(part * Math.PI) * height * depth
        context.lineTo(x + px * side * depth * 18, horizon - rise + Math.sin(i * 2.1 + depth * 10) * height * .025)
      }
      context.lineTo(width / 2, horizon + 25)
      context.closePath()
      context.fillStyle = color
      context.fill()
    }
    const draw = (time: number) => {
      const t = time * .00035
      const horizon = height * .59
      const sky = context.createLinearGradient(0, 0, 0, height)
      sky.addColorStop(0, '#080706'); sky.addColorStop(.55, '#1d110b'); sky.addColorStop(1, '#050403')
      context.fillStyle = sky; context.fillRect(0, 0, width, height)
      stars.forEach((star) => {
        context.fillStyle = `rgba(238,196,126,${.16 + Math.sin(t * 3 + star.phase) * .1})`
        context.beginPath(); context.arc(star.x * width + px * 9, star.y * horizon * .9 + py * 5, star.size, 0, Math.PI * 2); context.fill()
      })
      const glow = context.createRadialGradient(width / 2, horizon * .88, 0, width / 2, horizon * .88, width * .43)
      glow.addColorStop(0, 'rgba(218,166,91,.34)'); glow.addColorStop(.38, 'rgba(132,72,37,.10)'); glow.addColorStop(1, 'transparent')
      context.fillStyle = glow; context.fillRect(0, 0, width, horizon)
      mountain(-1, .36, '#120c09', horizon); mountain(1, .39, '#100b08', horizon)
      mountain(-1, .2, '#2a1710', horizon); mountain(1, .23, '#23130e', horizon)
      const water = context.createLinearGradient(0, horizon, 0, height)
      water.addColorStop(0, '#673b25'); water.addColorStop(.18, '#21130d'); water.addColorStop(1, '#050403')
      context.fillStyle = water; context.fillRect(0, horizon, width, height - horizon)
      for (let row = 0; row < 38; row += 1) {
        const p = row / 38; const y = horizon + p * p * (height - horizon); const spread = width * (.045 + p * .54); const wave = Math.sin(t * 4 + row * 1.7) * 12 * p
        context.strokeStyle = `rgba(229,177,96,${.18 * (1 - p) + .025})`; context.lineWidth = .5 + p
        context.beginPath(); context.moveTo(width / 2 - spread + wave, y); context.lineTo(width / 2 + spread + wave, y); context.stroke()
      }
      if (!reduceMotion) frame = requestAnimationFrame(draw)
    }
    const onPointer = (event: PointerEvent) => {
      px = event.clientX / window.innerWidth - .5; py = event.clientY / window.innerHeight - .5
      scene.style.setProperty('--scene-x', `${px * 20}px`); scene.style.setProperty('--scene-y', `${py * 13}px`)
    }
    resize(); window.addEventListener('resize', resize); window.addEventListener('pointermove', onPointer, { passive: true }); draw(0)
    return () => { cancelAnimationFrame(frame); window.removeEventListener('resize', resize); window.removeEventListener('pointermove', onPointer) }
  }, [])

  return (
    <div className="quiroz-scene" ref={sceneRef} aria-label="Escena digital tridimensional de Quiroz">
      <canvas ref={canvasRef} aria-hidden="true" />
      <div className="scene-vignette" />
      <div className="scene-values" aria-hidden="true"><span className="active">Esencia</span><span>Estrategia</span><span>Diseño</span><span>Precisión</span><span>Impacto</span></div>
      <div className="q-totem" aria-hidden="true">
        <div className="q-aura" /><div className="q-ring ring-one" /><div className="q-ring ring-two" />
        <div className="q-core"><img src={brandIsotypeSrc} alt="" /></div><div className="q-shadow" />
      </div>
      <div className="scene-coordinate coordinate-left">QUIROZ / NAVARRA<br />42.8125° N</div>
      <div className="scene-coordinate coordinate-right">DIGITAL CRAFT<br />EST. 2026</div>
    </div>
  )
}

export function QuirozHero() {
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const reveal = new IntersectionObserver(
      (entries) => entries.forEach((entry) => entry.isIntersecting && entry.target.classList.add('is-visible')),
      { threshold: 0.12 },
    )
    document.querySelectorAll('.reveal').forEach((element) => reveal.observe(element))
    return () => reveal.disconnect()
  }, [])

  const closeMenu = () => setMenuOpen(false)

  return (
    <main className="site-shell">
      <header className="topbar">
        <a href="#inicio" className="brand" aria-label="Quiroz, inicio">
          <img src={brandIsotypeSrc} alt="" />
          <span><b>QUIROZ</b><small>Digital studio</small></span>
        </a>

        <nav className="desktop-nav" aria-label="Navegación principal">
          <a href="#proyectos">Proyectos</a>
          <a href="#servicios">Servicios</a>
          <a href="#proceso">Proceso</a>
        </nav>

        <a href="#contacto" className="nav-cta">Hablemos <ArrowUpRight size={15} /></a>
        <button className="menu-button" onClick={() => setMenuOpen(!menuOpen)} aria-label="Abrir menú" aria-expanded={menuOpen}>
          {menuOpen ? <X /> : <Menu />}
        </button>

        {menuOpen && (
          <nav className="mobile-nav" aria-label="Navegación móvil">
            <a href="#proyectos" onClick={closeMenu}>Proyectos</a>
            <a href="#servicios" onClick={closeMenu}>Servicios</a>
            <a href="#proceso" onClick={closeMenu}>Proceso</a>
            <a href="#contacto" onClick={closeMenu}>Hablemos</a>
          </nav>
        )}
      </header>

      <section id="inicio" className="hero-section">
        <Interactive3DShowcase />
        <div className="hero-glow" />
        <div className="hero-copy reveal is-visible">
          <p className="eyebrow"><span /> Bryans Quiroz · Diseñador web · Pamplona</p>
          <h1>Tu negocio merece<br />una presencia<br /><em>imposible de ignorar.</em></h1>
          <div className="hero-bottom">
            <p>Diseño experiencias digitales premium que elevan la percepción de tu marca y convierten atención en clientes.</p>
            <a href="#proyectos" className="hero-primary">Explorar proyectos <ArrowUpRight size={17} /></a>
          </div>
        </div>
        <div className="hero-status" aria-hidden="true">
          <span><i /> Experiencia interactiva</span><span>Desliza para descubrir</span><ArrowDown size={14} />
        </div>
      </section>

      <section className="manifesto section-pad">
        <div className="section-number">01 / Enfoque</div>
        <div className="manifesto-copy reveal">
          <p className="eyebrow"><span /> No hago páginas bonitas</p>
          <h2>Construyo la percepción que tu negocio <em>merece.</em></h2>
          <div className="manifesto-detail">
            <p>Una buena web no empieza con colores. Empieza entendiendo por qué deberían elegirte a ti. Después, cada palabra, cada imagen y cada interacción trabajan para demostrarlo.</p>
            <div className="pill-list"><span>Claridad</span><span>Carácter</span><span>Conversión</span></div>
          </div>
        </div>
      </section>

      <section id="identidad" className="brand-world section-pad">
        <div className="brand-world-copy reveal">
          <p className="eyebrow light"><span /> Una identidad con raíz</p>
          <h2>Elegancia sin distancia.<br /><em>Carácter sin ruido.</em></h2>
          <p>
            Quiroz nace del cuidado por los detalles, de la hostelería vivida desde dentro y de una forma muy personal
            de trabajar: escuchar primero, ordenar después y diseñar solo lo que aporta valor.
          </p>
          <div className="brand-values">
            <span><b>01</b> Cálido</span>
            <span><b>02</b> Preciso</span>
            <span><b>03</b> Humano</span>
          </div>
        </div>
        <div className="brand-poster-stage reveal" aria-label="Identidad visual Quiroz">
          <div className="brand-poster-back"><img src={brandIsotypeSrc} alt="Isotipo dorado de Quiroz" /></div>
          <div className="brand-poster-card">
            <img src={brandPosterSrc} alt="Identidad de Quiroz, diseño web para hostelería" />
            <div className="brand-poster-shine" />
          </div>
          <div className="brand-poster-caption"><span>QUIROZ / NAVARRA</span><span>BRAND SYSTEM 01</span></div>
        </div>
      </section>

      <section id="proyectos" className="projects-section section-pad">
        <div className="section-heading reveal">
          <div>
            <p className="eyebrow"><span /> Trabajo seleccionado</p>
            <h2>Proyectos con<br /><em>intención.</em></h2>
          </div>
          <p>Una selección de experiencias digitales para hostelería, servicios y negocios que quieren competir por valor, no por precio.</p>
        </div>

        <div className="project-list">
          {projects.map((project) => (
            <article className="project-card reveal" key={project.number} style={{ '--project-color': project.color } as React.CSSProperties}>
              <div className="project-visual"><ProjectVisual type={project.visual} /></div>
              <div className="project-copy">
                <div className="project-meta"><span>{project.eyebrow}</span><span>{project.number}</span></div>
                <h3>{project.title}</h3>
                <p>{project.description}</p>
                <button className="project-link" type="button" aria-label={`${project.title}. Enlace próximamente`}>
                  Ver proyecto <ArrowUpRight size={17} /> <small>Próximamente</small>
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section id="servicios" className="services-section section-pad">
        <div className="services-intro reveal">
          <p className="eyebrow light"><span /> Lo que hago</p>
          <h2>De una idea a una presencia digital que <em>trabaja por ti.</em></h2>
        </div>
        <div className="services-grid">
          {services.map((service, index) => {
            const Icon = service.icon
            return (
              <article className="service-card reveal" key={service.title}>
                <div className="service-top"><span>0{index + 1}</span><Icon /></div>
                <h3>{service.title}</h3>
                <p>{service.description}</p>
              </article>
            )
          })}
        </div>
      </section>

      <section id="proceso" className="process-section section-pad">
        <div className="process-heading reveal">
          <p className="eyebrow"><span /> Cómo trabajaremos</p>
          <h2>Simple por fuera.<br /><em>Rigurosamente pensado.</em></h2>
        </div>
        <div className="process-list">
          {process.map(([number, title, description]) => (
            <article className="process-item reveal" key={number}>
              <span>{number}</span><h3>{title}</h3><p>{description}</p><ArrowUpRight />
            </article>
          ))}
        </div>
      </section>

      <section className="about-section section-pad">
        <div className="about-photo reveal"><img src={PHOTO_SRC} alt="Bryans Quiroz trabajando" /><span>Diseñando desde Pamplona</span></div>
        <div className="about-copy reveal">
          <p className="eyebrow"><span /> Sobre mí</p>
          <h2>Tu proyecto no pasa por cinco departamentos. <em>Hablamos tú y yo.</em></h2>
          <p>Soy Bryans Quiroz. Combino estrategia, diseño y desarrollo para crear webs con personalidad y objetivos claros. Me implico en cada proyecto como si el negocio también fuera mío.</p>
          <div className="about-points">
            <span><Check size={16} /> Comunicación directa</span>
            <span><Check size={16} /> Diseño sin plantillas</span>
            <span><Check size={16} /> Atención al detalle</span>
          </div>
        </div>
      </section>

      <section id="contacto" className="contact-section">
        <div className="contact-orbit" aria-hidden="true"><img src={brandIsotypeSrc} alt="" /></div>
        <p className="eyebrow light"><span /> Tu próximo paso</p>
        <h2>¿Creamos algo<br /><em>difícil de ignorar?</em></h2>
        <p className="contact-copy">Cuéntame qué tienes en mente. Te responderé con una primera dirección clara para convertirlo en una web que venda tu verdadero valor.</p>
        <a href="mailto:" className="contact-button"><MessageCircle size={19} /> Cuéntame tu proyecto <ArrowUpRight size={18} /></a>
        <div className="contact-note">Respuesta personal · Sin compromiso · Propuesta a medida</div>
      </section>

      <footer>
        <img src={brandSignatureSrc} alt="Quiroz Digital Studio" />
        <p>Diseño web con estrategia, carácter y detalle.</p>
        <div><span>© 2026 Quiroz</span><a href="#inicio">Volver arriba ↑</a></div>
      </footer>
    </main>
  )
}
