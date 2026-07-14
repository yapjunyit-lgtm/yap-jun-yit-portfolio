import { projects } from '../data/projects'
import ScrollReveal from './ScrollReveal'
import ProjectCard from './ProjectCard'
import styles from './Projects.module.css'

export default function Projects() {
  return (
    <section id="projects" className={styles.section}>
      <div className="container">
        <ScrollReveal>
          <p className="section-label">[SECTION_02]</p>
          <h2 className="section-heading">Featured Projects</h2>
        </ScrollReveal>
        <div className={styles.grid}>
          {projects.map((project, i) => (
            <ScrollReveal key={project.id} delay={i * 0.05}>
              <ProjectCard project={project} />
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  )
}
