import { profile } from '../data/profile'
import ScrollReveal from './ScrollReveal'
import styles from './Profile.module.css'

export default function Profile() {
  return (
    <section id="profile" className={styles.section}>
      <div className="container">
        <ScrollReveal>
          <div className={styles.grid}>
            <div className={styles.photoWrapper}>
              <div className={styles.photoPlaceholder}>
                <span className={styles.photoPlaceholderIcon}>📷</span>
              </div>
              <div className={styles.photoGlow} />
            </div>

            <div className={styles.right}>
              <div>
                <p className="section-label">[SECTION_01]</p>
                <h2 className="section-heading">About Me</h2>
              </div>

              <div className={styles.intro}>
                {profile.aboutParagraphs.map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
              </div>

              <div className={styles.contactPills}>
                <a href={`mailto:${profile.email}`} className={styles.pill}>
                  <span className={styles.pillIcon}>📧</span> {profile.email}
                </a>
                <a href={`tel:${profile.phone}`} className={styles.pill}>
                  <span className={styles.pillIcon}>📱</span> {profile.phone}
                </a>
                <a href={profile.linkedin} target="_blank" rel="noopener noreferrer" className={styles.pill}>
                  <span className={styles.pillIcon}>🔗</span> LinkedIn
                </a>
              </div>

              <div className={styles.statsRow}>
                {profile.stats.map((stat) => (
                  <div key={stat.label} className={styles.stat}>
                    <div className={styles.statValue}>{stat.value}</div>
                    <div className={styles.statLabel}>{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  )
}
