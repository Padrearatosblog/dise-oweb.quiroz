import { useEffect, useState } from 'react'
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
  Sparkles,
  X,
} from 'lucide-react'

const BASE_URL = import.meta.env.BASE_URL
const PHOTO_SRC = `${BASE_URL}bryan-quiroz.jpg`
const LOGO_SRC = `${BASE_URL}logo-quiroz.svg`

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
  const [tilt, setTilt] = useState({ x: -4, y: 7 })

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    const bounds = event.currentTarget.getBoundingClientRect()
    const x = (event.clientX - bounds.left) / bounds.width - 0.5
    const y = (event.clientY - bounds.top) / bounds.height - 0.5
    setTilt({ x: y * -12, y: x * 16 })
  }

  return (
    <div
      className="showcase-3d"
      onPointerMove={handlePointerMove}
      onPointerLeave={() => setTilt({ x: -4, y: 7 })}
      style={{ '--tilt-x': `${tilt.x}deg`, '--tilt-y': `${tilt.y}deg` } as React.CSSProperties}
    >
      <div className="showcase-hud hud-top"><span>Q / 001</span><span>INTERACTIVE DESIGN</span></div>
      <div className="showcase-grid" />
      <div className="showcase-glow" />
      <div className="scene-3d">
        <div className="orbit orbit-one" /><div className="orbit orbit-two" />
        <div className="portrait-monolith">
          <div className="monolith-face monolith-front">
            <img src={PHOTO_SRC} alt="Bryan Quiroz, diseñador y desarrollador web" />
            <div className="scan-line" />
            <div className="face-index">QUIROZ® — 2026</div>
          </div>
          <div className="monolith-face monolith-side"><span>DESIGN<br />WITH<br />INTENT</span></div>
          <div className="monolith-face monolith-top" />
        </div>
        <div className="float-card card-strategy"><small>01</small><strong>ESTRATEGIA</strong><span>Que se entienda</span></div>
        <div className="float-card card-design"><small>02</small><strong>DISEÑO</strong><span>Que se recuerde</span></div>
        <div className="float-card card-code"><small>03</small><strong>CÓDIGO</strong><span>Que funcione</span></div>
        <div className="scene-badge"><span>+</span><b>WEB / 3D / MOTION</b></div>
      </div>
      <div className="showcase-hud hud-bottom"><span>MOVE YOUR CURSOR</span><span>X {Math.round(tilt.y * 10)} · Y {Math.round(tilt.x * 10)}</span></div>
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
          <span>QUIROZ</span>
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
        <div className="hero-glow" />
        <div className="hero-copy reveal is-visible">
          <p className="eyebrow"><span /> Diseñador web & director digital · Pamplona</p>
          <h1>Tu negocio no necesita<br />otra web. Necesita<br /><em>ser inolvidable.</em></h1>
          <div className="hero-bottom">
            <p>Diseño experiencias digitales premium que hacen que negocios locales se vean, se entiendan y vendan como grandes marcas.</p>
            <a href="#proyectos" className="circle-link" aria-label="Ver proyectos"><ArrowDown /></a>
          </div>
        </div>

        <div className="portrait-wrap reveal is-visible">
          <div className="portrait-label"><Sparkles size={14} /> Laboratorio digital interactivo</div>
          <Interactive3DShowcase />
        </div>

        <div className="hero-marquee" aria-hidden="true">
          <div>ESTRATEGIA <i>✦</i> DISEÑO WEB <i>✦</i> DESARROLLO <i>✦</i> EXPERIENCIAS QR <i>✦</i> ESTRATEGIA <i>✦</i> DISEÑO WEB <i>✦</i></div>
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
        <div className="about-photo reveal"><img src={PHOTO_SRC} alt="Bryan Quiroz trabajando" /><span>Diseñando desde Pamplona</span></div>
        <div className="about-copy reveal">
          <p className="eyebrow"><span /> Sobre mí</p>
          <h2>Tu proyecto no pasa por cinco departamentos. <em>Hablamos tú y yo.</em></h2>
          <p>Soy Bryan Quiroz. Combino estrategia, diseño y desarrollo para crear webs con personalidad y objetivos claros. Me implico en cada proyecto como si el negocio también fuera mío.</p>
          <div className="about-points">
            <span><Check size={16} /> Comunicación directa</span>
            <span><Check size={16} /> Diseño sin plantillas</span>
            <span><Check size={16} /> Atención al detalle</span>
          </div>
        </div>
      </section>

      <section id="contacto" className="contact-section">
        <div className="contact-orbit" aria-hidden="true"><span>Q</span></div>
        <p className="eyebrow light"><span /> Tu próximo paso</p>
        <h2>¿Creamos algo<br /><em>difícil de ignorar?</em></h2>
        <p className="contact-copy">Cuéntame qué tienes en mente. Te responderé con una primera dirección clara para convertirlo en una web que venda tu verdadero valor.</p>
        <a href="mailto:" className="contact-button"><MessageCircle size={19} /> Cuéntame tu proyecto <ArrowUpRight size={18} /></a>
        <div className="contact-note">Respuesta personal · Sin compromiso · Propuesta a medida</div>
      </section>

      <footer>
        <img src={LOGO_SRC} alt="Quiroz" />
        <p>Diseño web con estrategia, carácter y detalle.</p>
        <div><span>© 2026 Quiroz</span><a href="#inicio">Volver arriba ↑</a></div>
      </footer>
    </main>
  )
}
