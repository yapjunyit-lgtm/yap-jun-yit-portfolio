import { useRef, useEffect } from 'react'
import styles from './QuantumHole.module.css'

const PARTICLE_COUNT = 200
const CENTER_X = 0.5
const CENTER_Y = 0.5
const ACCRETION_RINGS = 3

export default function QuantumHole() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    let animId
    let particles = []

    function resize() {
      const dpr = Math.min(window.devicePixelRatio, 2)
      const w = canvas.parentElement.clientWidth
      const h = canvas.parentElement.clientHeight
      canvas.width = w * dpr
      canvas.height = h * dpr
      canvas.style.width = w + 'px'
      canvas.style.height = h + 'px'
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      return { w, h }
    }

    let { w, h } = resize()
    window.addEventListener('resize', () => {
      const s = resize()
      w = s.w; h = s.h
      initParticles()
    })

    function initParticles() {
      particles = []
      const cx = w * CENTER_X
      const cy = h * CENTER_Y
      const maxR = Math.min(w, h) * 0.65

      for (let i = 0; i < PARTICLE_COUNT; i++) {
        // Distribute particles: more dense near center (quantum hole effect)
        const t = Math.random()
        const radius = maxR * (0.08 + t * t * 0.92) // quadratic falloff toward center
        const angle = Math.random() * Math.PI * 2

        particles.push({
          x: cx + Math.cos(angle) * radius,
          y: cy + Math.sin(angle) * radius,
          radius,
          angle,
          speed: 0.15 + Math.random() * 0.4, // degrees per frame
          size: 0.4 + Math.random() * 1.2,
          opacity: 0.15 + Math.random() * 0.5,
          // Orbit slightly elliptical
          eccentricity: 0.7 + Math.random() * 0.3,
          phase: Math.random() * Math.PI * 2,
        })
      }
    }

    initParticles()

    function draw(timestamp) {
      const cx = w * CENTER_X
      const cy = h * CENTER_Y
      const t = timestamp * 0.001

      // Clear with slight trail for motion blur
      ctx.fillStyle = 'rgba(8, 8, 15, 0.25)'
      ctx.fillRect(0, 0, w, h)

      // Accretion rings — subtle glowing bands
      for (let ring = 0; ring < ACCRETION_RINGS; ring++) {
        const ringR = Math.min(w, h) * (0.12 + ring * 0.14)
        const wobble = Math.sin(t * 0.7 + ring * 2.1) * 4

        ctx.beginPath()
        ctx.arc(cx, cy, ringR + wobble, 0, Math.PI * 2)
        ctx.strokeStyle = `rgba(77, 255, 255, ${0.03 + ring * 0.02})`
        ctx.lineWidth = 0.5
        ctx.stroke()
      }

      // Draw particles
      for (const p of particles) {
        // Spiral inward slowly
        p.angle += p.speed * 0.008
        p.radius -= 0.03
        if (p.radius < 8) p.radius = Math.min(w, h) * 0.65

        const rx = p.radius
        const ry = p.radius * p.eccentricity
        const px = cx + Math.cos(p.angle + p.phase) * rx
        const py = cy + Math.sin(p.angle + p.phase) * ry

        // Fade particles as they approach the center (event horizon)
        const distFade = Math.min(1, p.radius / (Math.min(w, h) * 0.15))
        const alpha = p.opacity * distFade

        ctx.beginPath()
        ctx.arc(px, py, p.size, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(77, 255, 255, ${alpha})`
        ctx.fill()

        // Occasional brighter particles with glow
        if (p.size > 1.0) {
          ctx.beginPath()
          ctx.arc(px, py, p.size * 2.5, 0, Math.PI * 2)
          ctx.fillStyle = `rgba(77, 255, 207, ${alpha * 0.15})`
          ctx.fill()
        }
      }

      // Dark center — event horizon
      const gradient = ctx.createRadialGradient(cx, cy, 0, cx, cy, Math.min(w, h) * 0.12)
      gradient.addColorStop(0, 'rgba(8, 8, 15, 1)')
      gradient.addColorStop(0.4, 'rgba(8, 8, 15, 0.9)')
      gradient.addColorStop(0.7, 'rgba(8, 8, 15, 0.4)')
      gradient.addColorStop(1, 'rgba(8, 8, 15, 0)')
      ctx.fillStyle = gradient
      ctx.fillRect(0, 0, w, h)

      // Subtle outer vignette
      const vignette = ctx.createRadialGradient(cx, cy, Math.min(w, h) * 0.3, cx, cy, Math.min(w, h) * 0.7)
      vignette.addColorStop(0, 'rgba(8, 8, 15, 0)')
      vignette.addColorStop(1, 'rgba(8, 8, 15, 0.6)')
      ctx.fillStyle = vignette
      ctx.fillRect(0, 0, w, h)

      animId = requestAnimationFrame(draw)
    }

    animId = requestAnimationFrame(draw)

    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return <canvas ref={canvasRef} className={styles.canvas} />
}
