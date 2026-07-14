import { useCallback } from 'react'
import Particles, { ParticlesProvider } from '@tsparticles/react'
import { loadSlim } from '@tsparticles/slim'

function ParticlesContent() {
  return (
    <Particles
      id="particles"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 0,
        pointerEvents: 'none'
      }}
      options={{
        fpsLimit: 60,
        particles: {
          number: { value: 50, density: { enable: true } },
          color: { value: '#4DFFFF' },
          opacity: { value: 0.15 },
          size: { value: { min: 0.5, max: 1.5 } },
          links: {
            enable: true,
            color: '#4DFFFF',
            opacity: 0.08,
            distance: 180,
            width: 0.5
          },
          move: {
            enable: true,
            speed: 0.4,
            direction: 'none',
            random: true,
            straight: false,
            outModes: 'bounce'
          }
        },
        interactivity: {
          events: {
            onHover: {
              enable: true,
              mode: 'grab',
              parallax: { enable: true, smooth: 10, force: 30 }
            }
          },
          modes: {
            grab: {
              distance: 200,
              links: { opacity: 0.2, color: '#4DFFFF' }
            }
          }
        },
        detectRetina: true
      }}
    />
  )
}

export default function ParticleField() {
  const particlesInit = useCallback(async (engine) => {
    await loadSlim(engine)
  }, [])

  return (
    <ParticlesProvider init={particlesInit}>
      <ParticlesContent />
    </ParticlesProvider>
  )
}
