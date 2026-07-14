import { skills } from '../data/skills'
import ScrollReveal from './ScrollReveal'
import SkillCard from './SkillCard'
import styles from './Capabilities.module.css'

export default function Capabilities() {
  return (
    <section id="capabilities" className={styles.section}>
      <div className="container">
        <ScrollReveal>
          <p className="section-label">[SECTION_03]</p>
          <h2 className="section-heading">Core Capabilities</h2>
        </ScrollReveal>
        <div className={styles.grid}>
          {skills.map((skill, i) => (
            <ScrollReveal key={skill.id} delay={i * 0.08}>
              <SkillCard skill={skill} />
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  )
}
