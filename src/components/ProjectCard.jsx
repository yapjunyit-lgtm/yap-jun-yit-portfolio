import BorderGlow from './BorderGlow/BorderGlow'
import styles from './ProjectCard.module.css'

const MEDIA_EXTENSIONS = /\.(mp4|webm|mov)$/i

function isVideo(path) {
  return MEDIA_EXTENSIONS.test(path)
}

export default function ProjectCard({ project, isActive, onSelect }) {
  const handleClick = () => {
    if (onSelect) onSelect(project)
  }

  const hasMedia = Boolean(project.image)
  const previewTags = project.tags.slice(0, 3)

  const accentGlowMap = {
    cyan: '190 100 50',
    magenta: '300 100 50',
    green: '160 100 50',
  }
  const glowColor = accentGlowMap[project.accent] || '190 100 50'

  return (
    <div
      className={`${styles.card} ${isActive ? styles.active : ''}`}
      onClick={handleClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === 'Enter') handleClick() }}
    >
      <BorderGlow
        backgroundColor="#111118"
        borderRadius={16}
        glowColor={glowColor}
        glowIntensity={isActive ? 1.0 : 0.6}
        edgeSensitivity={35}
        glowRadius={30}
        coneSpread={22}
        colors={['#4DFFFF', '#4DFFCF', '#38bdf8']}
        fillOpacity={0.3}
      >
        {hasMedia && (
          <div className={styles.imageArea}>
            {isVideo(project.image) ? (
              <video
                src={project.image}
                className={styles.image}
                autoPlay
                muted
                loop
                playsInline
              />
            ) : (
              <img
                src={project.image}
                alt={project.title}
                className={styles.image}
                loading="lazy"
              />
            )}
            <div className={styles.imageOverlay}>
              <div className={styles.tagPreview}>
                {previewTags.map((tag) => (
                  <span key={tag} className={styles.tagPreviewChip}>{tag}</span>
                ))}
              </div>
            </div>
          </div>
        )}
        <div className={styles.body}>
          <h3 className={styles.title}>{project.title}</h3>
          <p className={styles.desc}>{project.description}</p>
          <div className={styles.tags}>
            {project.tags.map((tag) => (
              <span key={tag} className={styles.tag}>{tag}</span>
            ))}
          </div>
        </div>
      </BorderGlow>
    </div>
  )
}
