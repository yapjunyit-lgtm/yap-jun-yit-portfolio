import { profile } from '../data/profile'
import ScrollReveal from './ScrollReveal'
import styles from './Footer.module.css'

export default function Footer() {
  return (
    <section id="footer" className={styles.section}>
      <div className="container">
        <ScrollReveal>
          <div className={styles.inner}>
            <p className="section-label">[SECTION_04]</p>
            <h2 className={styles.heading}>Let's build something together.</h2>
            <p className={styles.subtitle}>
              Open to internships, collaborations, and freelance projects.
              Reach out and let's talk.
            </p>
            <div className={styles.links}>
              <a href={`mailto:${profile.email}`} className={styles.pill}>
                <span className={styles.pillIcon}>📧</span> {profile.email}
              </a>
              <a href={profile.linkedin} target="_blank" rel="noopener noreferrer" className={styles.pill}>
                <span className={styles.pillIcon}>🔗</span> LinkedIn
              </a>
              <a href={`tel:${profile.phone}`} className={styles.pill}>
                <span className={styles.pillIcon}>📱</span> {profile.phone}
              </a>
            </div>
            <p className={styles.copyright}>Made with ⚡ by Yap Jun Yit © 2026</p>
          </div>
        </ScrollReveal>
      </div>
    </section>
  )
}
