import { useEffect, useRef, useState } from 'react'
import { ArrowDown, ArrowLeft, ArrowUpRight } from 'lucide-react'
const brandIsotypeSrc = `${import.meta.env.BASE_URL}isotipo-quiroz.jpg`

const chapters = [
  { label: 'Esencia', title: 'Todo empieza por entender qué te hace diferente.', text: 'Antes de diseñar, escucho. La personalidad del negocio marca el camino.' },
  { label: 'Estrategia', title: 'Ordenamos el mensaje para que tu cliente lo entienda.', text: 'Quitamos ruido, definimos prioridades y hacemos que cada decisión tenga sentido.' },
  { label: 'Diseño', title: 'Convertimos la idea en una presencia que se recuerda.', text: 'Tipografía, color, ritmo y movimiento trabajando como una sola identidad.' },
  { label: 'Experiencia', title: 'Cada interacción debe sentirse sencilla y natural.', text: 'La tecnología desaparece para que la persona encuentre, entienda y actúe.' },
  { label: 'Resultado', title: 'Webs con esencia para negocios reales.', text: 'Una presencia digital preparada para atraer, convencer y crecer contigo.' },
]

export function QuirozExperience() {
  const pageRef = useRef<HTMLElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const progressRef = useRef(0)
  const [progress, setProgress] = useState(0)
  const active = Math.min(chapters.length - 1, Math.floor(progress * chapters.length))

  useEffect(() => {
    document.title = 'Experiencia 3D | Quiroz Digital Studio'
    const previousScrollRestoration = window.history.scrollRestoration
    window.history.scrollRestoration = 'manual'
    window.scrollTo({ top: 0, behavior: 'auto' })
    const resetScroll = window.setTimeout(() => window.scrollTo({ top: 0, behavior: 'auto' }), 80)
    const update = () => {
      const page = pageRef.current
      if (!page) return
      const range = page.offsetHeight - window.innerHeight
      const next = Math.max(0, Math.min(1, -page.getBoundingClientRect().top / Math.max(range, 1)))
      progressRef.current = next
      setProgress(next)
    }
    update()
    window.addEventListener('scroll', update, { passive: true })
    return () => {
      window.clearTimeout(resetScroll)
      window.removeEventListener('scroll', update)
      window.history.scrollRestoration = previousScrollRestoration
    }
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    const context = canvas?.getContext('2d')
    if (!canvas || !context) return
    let width = 0
    let height = 0
    const resize = () => {
      const ratio = Math.min(window.devicePixelRatio || 1, 1.5)
      width = window.innerWidth
      height = window.innerHeight
      canvas.width = width * ratio
      canvas.height = height * ratio
      context.setTransform(ratio, 0, 0, ratio, 0, 0)
    }
    const draw = () => {
      const journey = progressRef.current
      const horizon = height * (.54 + journey * .04)
      const sky = context.createLinearGradient(0, 0, 0, height)
      sky.addColorStop(0, '#060504'); sky.addColorStop(.55, journey > .72 ? '#2a170d' : '#160e09'); sky.addColorStop(1, '#030302')
      context.fillStyle = sky; context.fillRect(0, 0, width, height)
      const glowX = width * (.5 + Math.sin(journey * Math.PI * 2) * .08)
      const glow = context.createRadialGradient(glowX, horizon, 0, glowX, horizon, width * .46)
      glow.addColorStop(0, `rgba(224,174,98,${.16 + journey * .18})`); glow.addColorStop(.4, 'rgba(117,58,28,.08)'); glow.addColorStop(1, 'transparent')
      context.fillStyle = glow; context.fillRect(0, 0, width, height)
      const mountain = (side: number, depth: number, color: string) => {
        context.beginPath(); context.moveTo(side < 0 ? 0 : width, horizon + 25)
        for (let i = 0; i <= 9; i += 1) {
          const p = i / 9; const x = side < 0 ? p * width * .5 : width - p * width * .5
          const rise = Math.sin(p * Math.PI) * height * depth * (1 + journey * .16)
          context.lineTo(x, horizon - rise + Math.sin(i * 1.9 + journey * 4) * 13)
        }
        context.lineTo(width / 2, horizon + 30); context.closePath(); context.fillStyle = color; context.fill()
      }
      mountain(-1, .31, '#130c09'); mountain(1, .34, '#0e0a08'); mountain(-1, .16, '#2b1810'); mountain(1, .2, '#21120d')
      const water = context.createLinearGradient(0, horizon, 0, height)
      water.addColorStop(0, '#633921'); water.addColorStop(.16, '#1d110c'); water.addColorStop(1, '#030302')
      context.fillStyle = water; context.fillRect(0, horizon, width, height - horizon)
      for (let row = 0; row < 45; row += 1) {
        const p = row / 45; const y = horizon + p * p * (height - horizon); const spread = width * (.035 + p * .55)
        context.strokeStyle = `rgba(229,177,96,${.21 * (1 - p) + .02})`; context.lineWidth = .4 + p
        const wave = Math.sin(journey * 18 + row * 1.7) * 14 * p
        context.beginPath(); context.moveTo(width / 2 - spread + wave, y); context.lineTo(width / 2 + spread + wave, y); context.stroke()
      }
      for (let i = 0; i < 70; i += 1) {
        const x = ((i * 83) % 997) / 997 * width; const y = ((i * 149) % 613) / 613 * horizon
        context.fillStyle = `rgba(235,190,115,${.05 + (i % 4) * .025})`; context.beginPath(); context.arc(x, y - journey * (10 + i % 20), .5 + i % 3 * .3, 0, Math.PI * 2); context.fill()
      }
    }
    const redraw = () => draw()
    resize(); draw()
    window.addEventListener('resize', resize)
    window.addEventListener('scroll', redraw, { passive: true })
    return () => { window.removeEventListener('resize', resize); window.removeEventListener('scroll', redraw) }
  }, [])

  return (
    <main className="experience-page" ref={pageRef}>
      <section className="experience-sticky">
        <canvas ref={canvasRef} aria-hidden="true" />
        <div className="experience-vignette" />
        <header className="experience-nav">
          <a href="./" className="experience-brand"><img src={brandIsotypeSrc} alt="" width="340" height="265" /><span>QUIROZ<small>Digital Studio</small></span></a>
          <a href="./" className="experience-back"><ArrowLeft size={15} /> Volver al estudio</a>
        </header>

        <nav className="experience-index" aria-label="Capítulos de la experiencia">
          {chapters.map((chapter, index) => <span key={chapter.label} className={index === active ? 'active' : ''}><i>0{index + 1}</i>{chapter.label}</span>)}
        </nav>

        <div className="experience-totem" style={{ '--journey': progress } as React.CSSProperties} aria-hidden="true">
          <div className="experience-aura" />
          <div className="experience-ring ring-a" /><div className="experience-ring ring-b" />
          <div className="experience-core"><img src={brandIsotypeSrc} alt="" width="340" height="265" /></div>
          <div className="experience-reflection"><img src={brandIsotypeSrc} alt="" width="340" height="265" /></div>
        </div>

        <div className="experience-copy">
          <p><span /> 0{active + 1} / {chapters[active].label}</p>
          <h1 key={`title-${active}`}>{chapters[active].title}</h1>
          <div key={`text-${active}`} className="experience-copy-bottom">
            <p>{chapters[active].text}</p>
            {active === chapters.length - 1 && <a href="./#proyectos">Ver proyectos <ArrowUpRight size={16} /></a>}
          </div>
        </div>

        <div className="experience-footer">
          <span className="experience-mode"><i /> Experiencia visual</span>
          <div className="experience-progress"><i style={{ width: `${progress * 100}%` }} /></div>
          <span>{active === chapters.length - 1 ? 'Fin del recorrido' : 'Scroll para explorar'} <ArrowDown size={13} /></span>
        </div>
      </section>
    </main>
  )
}
