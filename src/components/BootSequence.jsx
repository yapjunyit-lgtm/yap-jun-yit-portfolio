import { useState, useEffect } from 'react'
import styles from './BootSequence.module.css'

const LINES = [
  { text: '> INITIALIZING_SYSTEM...',          delay: 0 },
  { text: '> LOADING_PROFILE: YAP_JUN_YIT',    delay: 300 },
  { text: '> MOUNTING_MODULES...',              delay: 600 },
  { text: '> INITIALIZING_RENDER_ENGINE...',    delay: 900 },
  { text: '> ACCESS_GRANTED ✓',                 delay: 1400 },
  { text: '> READY.',                           delay: 1700 },
]

const EXIT_DELAY = 2300 // ms before overlay starts fading

const SESSION_KEY = 'portfolio-boot-shown'

export default function BootSequence() {
  const [visibleLines, setVisibleLines] = useState(new Set())
  const [exiting, setExiting] = useState(false)
  const [hidden, setHidden] = useState(
    () => typeof window !== 'undefined' && window.sessionStorage.getItem(SESSION_KEY) === '1'
  )

  useEffect(() => {
    // Show each line after its delay
    const timers = LINES.map((line) =>
      setTimeout(() => {
        setVisibleLines((prev) => new Set([...prev, line.text]))
      }, line.delay)
    )

    // Start exit animation
    const exitTimer = setTimeout(() => {
      setExiting(true)
    }, EXIT_DELAY)

    // Remove from DOM after exit animation completes
    const hiddenTimer = setTimeout(() => {
      setHidden(true)
      window.sessionStorage.setItem(SESSION_KEY, '1')
    }, EXIT_DELAY + 800)

    return () => {
      timers.forEach(clearTimeout)
      clearTimeout(exitTimer)
      clearTimeout(hiddenTimer)
    }
  }, [])

  if (hidden) return null

  return (
    <div className={`${styles.overlay} ${exiting ? styles.exiting : ''}`}>
      <div className={styles.scanlines} />
      <div className={styles.glow} />
      <div className={styles.terminal}>
        {LINES.map((line) => (
          <div
            key={line.text}
            className={`${styles.line} ${visibleLines.has(line.text) ? styles.lineVisible : ''}`}
          >
            <span className={styles.prompt}>{line.text.slice(0, 2)}</span>
            {line.text.slice(2)}
          </div>
        ))}
        <div className={styles.cursor}>▌</div>
      </div>
    </div>
  )
}
