import styles from './ProjectCard.module.css'

export default function ProjectCard({ project }) {
  return (
    <div className={styles.card}>
      <div className={styles.imageArea}>
        <span className={styles.imagePlaceholder}>
          {project.tags[0] === 'OpenAI' || project.tags[0] === 'Python' ? '🤖' :
           project.tags[0] === 'Figma' || project.tags[0] === 'HTML' ? '🌐' : '📊'}
        </span>
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
    </div>
  )
}
