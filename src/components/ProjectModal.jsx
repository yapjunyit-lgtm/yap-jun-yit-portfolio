import { useEffect, useCallback, useRef } from 'react'
import styles from './ProjectModal.module.css'

const MEDIA_EXTENSIONS = /\.(mp4|webm|mov)$/i

function isVideo(path) {
  return MEDIA_EXTENSIONS.test(path)
}

export default function ProjectModal({ project, projects, onClose, onNavigate }) {
  const overlayRef = useRef(null)
  const currentIndex = projects.findIndex((p) => p.id === project.id)
  const hasPrev = currentIndex > 0
  const hasNext = currentIndex < projects.length - 1

  const close = useCallback(() => {
    if (onClose) onClose()
  }, [onClose])

  const goTo = useCallback((index) => {
    if (onNavigate) onNavigate(index)
  }, [onNavigate])

  const prev = useCallback(() => {
    if (hasPrev) goTo(currentIndex - 1)
    else goTo(projects.length - 1) // wrap to last
  }, [hasPrev, currentIndex, goTo, projects.length])

  const next = useCallback(() => {
    if (hasNext) goTo(currentIndex + 1)
    else goTo(0) // wrap to first
  }, [hasNext, currentIndex, goTo])

  // Keyboard navigation
  useEffect(() => {
    const handleKey = (e) => {
      switch (e.key) {
        case 'Escape':
          close()
          break
        case 'ArrowLeft':
          prev()
          break
        case 'ArrowRight':
          next()
          break
      }
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [close, prev, next])

  // Lock body scroll
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  const handleOverlayClick = (e) => {
    if (e.target === overlayRef.current) close()
  }

  const hasMedia = Boolean(project.image)
  const displayText = project.longDescription || project.description

  return (
    <div
      className={styles.overlay}
      ref={overlayRef}
      onClick={handleOverlayClick}
      role="dialog"
      aria-modal="true"
      aria-label={project.title}
    >
      <div className={styles.modal}>
        {/* Close button */}
        <button
          className={styles.closeBtn}
          onClick={close}
          aria-label="Close"
        >
          ×
        </button>

        {/* Navigation arrows */}
        <button
          className={`${styles.arrow} ${styles.arrowLeft}`}
          onClick={prev}
          aria-label="Previous project"
        >
          ←
        </button>
        <button
          className={`${styles.arrow} ${styles.arrowRight}`}
          onClick={next}
          aria-label="Next project"
        >
          →
        </button>

        {/* Content */}
        <div className={styles.body}>
          {hasMedia && (
            <div className={styles.mediaArea}>
              {isVideo(project.image) ? (
                <video
                  src={project.image}
                  className={styles.media}
                  autoPlay
                  muted
                  loop
                  playsInline
                  controls
                />
              ) : (
                <img
                  src={project.image}
                  alt={project.title}
                  className={styles.media}
                />
              )}
            </div>
          )}

          <div className={styles.textContent}>
            <h2 className={styles.title}>{project.title}</h2>

            <div className={styles.tags}>
              {project.tags.map((tag) => (
                <span key={tag} className={styles.tag}>{tag}</span>
              ))}
            </div>

            <p className={styles.description}>{displayText}</p>

            {(project.liveUrl || project.repoUrl) && (
              <div className={styles.links}>
                {project.liveUrl && (
                  <a
                    href={project.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.linkBtn}
                  >
                    🌐 Live Demo
                  </a>
                )}
                {project.repoUrl && (
                  <a
                    href={project.repoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`${styles.linkBtn} ${styles.linkBtnSecondary}`}
                  >
                    📂 Source Code
                  </a>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Project counter */}
        <div className={styles.counter}>
          {currentIndex + 1} / {projects.length}
        </div>
      </div>
    </div>
  )
}
