import { useState, useCallback, useRef } from 'react'
import { projects } from '../data/projects'
import ProjectCard from './ProjectCard'
import styles from './Projects.module.css'

function smoothScrollTo(track, targetLeft, duration = 700) {
  const start = track.scrollLeft
  const startTime = performance.now()

  function animate(now) {
    const elapsed = now - startTime
    const progress = Math.min(elapsed / duration, 1)
    const eased = 1 - Math.pow(1 - progress, 3)
    track.scrollLeft = start + (targetLeft - start) * eased
    if (progress < 1) {
      requestAnimationFrame(animate)
    }
  }

  requestAnimationFrame(animate)
}

export default function Projects() {
  const total = projects.length
  const trackRef = useRef(null)
  const scrollRaf = useRef(null)
  const [active, setActive] = useState(0)

  const getCardCenter = useCallback((index) => {
    const track = trackRef.current
    if (!track) return 0
    const card = track.children[index]
    if (!card) return 0
    return card.offsetLeft + card.offsetWidth / 2 - track.offsetWidth / 2
  }, [])

  const scrollToCard = useCallback((index) => {
    const track = trackRef.current
    if (!track) return
    const target = getCardCenter(index)
    smoothScrollTo(track, target, 700)
  }, [getCardCenter])

  const next = useCallback(() => {
    setActive((prev) => {
      const nextIdx = (prev + 1) % total
      scrollToCard(nextIdx)
      return nextIdx
    })
  }, [total, scrollToCard])

  const prev = useCallback(() => {
    setActive((prev) => {
      const prevIdx = (prev - 1 + total) % total
      scrollToCard(prevIdx)
      return prevIdx
    })
  }, [total, scrollToCard])

  const handleScroll = useCallback(() => {
    if (scrollRaf.current) return
    scrollRaf.current = requestAnimationFrame(() => {
      scrollRaf.current = null
      const track = trackRef.current
      if (!track) return
      const center = track.scrollLeft + track.offsetWidth / 2
      let closest = 0
      let closestDist = Infinity
      for (let i = 0; i < track.children.length; i++) {
        const card = track.children[i]
        const cardCenter = card.offsetLeft + card.offsetWidth / 2
        const dist = Math.abs(center - cardCenter)
        if (dist < closestDist) {
          closestDist = dist
          closest = i
        }
      }
      if (closest !== active) setActive(closest)
    })
  }, [active])

  return (
    <section id="projects" className={styles.section}>
      <div className="container">
        <p className="section-label">[SECTION_02]</p>
        <h2 className="section-heading">Featured Projects</h2>

        <div className={styles.carousel}>
          <button onClick={prev} className={styles.arrow} aria-label="Previous">
            ←
          </button>

          <div className={styles.track} ref={trackRef} onScroll={handleScroll}>
            {projects.map((project, idx) => (
              <ProjectCard
                key={project.id}
                project={project}
                isActive={idx === active}
              />
            ))}
          </div>

          <button onClick={next} className={styles.arrow} aria-label="Next">
            →
          </button>
        </div>

        <div className={styles.dots}>
          {projects.map((_, i) => (
            <button
              key={i}
              onClick={() => {
                setActive(i)
                scrollToCard(i)
              }}
              className={`${styles.dot} ${i === active ? styles.dotActive : ''}`}
              aria-label={`Project ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
