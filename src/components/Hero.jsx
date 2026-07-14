import { profile } from '../data/profile'
import ScrollReveal from './ScrollReveal'
import styles from './Hero.module.css'

export default function Hero() {
  const handleScroll = () => {
    document.getElementById('profile')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section id="hero" className={styles.hero}>
      <video
        className={styles.video}
        src="/backgroud.mp4"
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        poster="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' width='1920' height='1080'><rect fill='%2308080F' width='1920' height='1080'/></svg>"
      />
      <div className={styles.overlay} />
      <div className={styles.vignette} />
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
