import BorderGlow from './BorderGlow/BorderGlow'
import styles from './ProjectCard.module.css'

export default function ProjectCard({ project, isActive }) {
  return (
    <div className={`${styles.card} ${isActive ? styles.active : ''}`}>
      <BorderGlow
        backgroundColor="#111118"
        borderRadius={16}
        glowColor="190 100 50"
        glowIntensity={0.8}
        edgeSensitivity={35}
        glowRadius={30}
        coneSpread={22}
        colors={['#4DFFFF', '#4DFFCF', '#38bdf8']}
        fillOpacity={0.3}
      >
        <div className={styles.imageArea}>
          {project.image ? (
            <img src={project.image} alt={project.title} className={styles.image} />
          ) : (
            <span className={styles.imagePlaceholder}>
              {project.tags[0] === 'OpenAI' || project.tags[0] === 'Python' ? '🤖' :
               project.tags[0] === 'Figma' || project.tags[0] === 'HTML' ? '🌐' : '📊'}
            </span>
          )}
        </div>
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
