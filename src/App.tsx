import { useEffect, useState } from 'react'
import { QuirozExperience } from '@/components/quiroz-experience'
import { QuirozHero } from '@/components/quiroz-hero'

function App() {
  const [route, setRoute] = useState(window.location.hash)

  useEffect(() => {
    const updateRoute = () => setRoute(window.location.hash)
    window.addEventListener('hashchange', updateRoute)
    return () => window.removeEventListener('hashchange', updateRoute)
  }, [])

  return route.startsWith('#/experiencia') ? <QuirozExperience /> : <QuirozHero />
}

export default App
