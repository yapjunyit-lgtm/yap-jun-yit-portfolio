import { profile } from '../data/profile'
import ScrollReveal from './ScrollReveal'
import styles from './Hero.module.css'

export default function Hero() {
  const handleScroll = () => {
    document.getElementById('profile')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section id="hero" className={styles.hero}>
      <div className="container">
        <ScrollReveal>
          <div className={styles.content}>
            <p className={styles.eyebrow}>COMPUTER SCIENCE · DATA SCIENCE · CYBERSECURITY</p>
            <h1 className={styles.headline}>
              {profile.headline.split('\n').map((line, i) => (
                <span key={i}>
                  {line}
                  {i < profile.headline.split('\n').length - 1 && <br />}
                </span>
              ))}
            </h1>
            <p className={styles.subtitle}>{profile.subtitle}</p>
            <button className={styles.cta} onClick={handleScroll}>
              EXPLORE MY WORK
              <span className={styles.ctaArrow}>→</span>
            </button>
          </div>
        </ScrollReveal>
      </div>
      <div className={styles.scrollHint}>
        <div className={styles.scrollHintDot} />
        <span className={styles.scrollHintText}>SCROLL</span>
      </div>
    </section>
  )
}
