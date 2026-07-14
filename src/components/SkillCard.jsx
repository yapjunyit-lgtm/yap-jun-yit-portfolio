import BorderGlow from './BorderGlow/BorderGlow'
import styles from './SkillCard.module.css'

const ICONS = {
  'Python': '🐍',
  'HTML / CSS': '🎨',
  'UI/UX Design': '🖌️',
  'PHP / MySQL': '🗄️',
  'JavaScript': '⚡',
  'Cybersecurity': '🔒',
}

export default function SkillCard({ skill }) {
  const fillClass = skill.tier === 'high'
    ? styles.barFillHigh
    : skill.tier === 'mid'
      ? styles.barFillMid
      : styles.barFillLow

  return (
    <BorderGlow
      backgroundColor="#111118"
      borderRadius={12}
      glowColor="190 100 50"
      glowIntensity={0.6}
      edgeSensitivity={35}
      glowRadius={24}
      coneSpread={22}
      colors={['#4DFFFF', '#4DFFCF', '#38bdf8']}
      fillOpacity={0.2}
    >
      <div className={styles.header}>
        <div className={styles.icon}>
          {ICONS[skill.name] || '📌'}
        </div>
        <h3 className={styles.name}>{skill.name}</h3>
      </div>
      <div className={styles.barWrapper}>
        <div className={styles.barTrack}>
          <div
            className={`${styles.barFill} ${fillClass}`}
            style={{ width: `${skill.level}%` }}
          />
        </div>
        <span className={styles.pct}>{skill.level}%</span>
      </div>
      <div className={styles.tools}>
        {skill.tools.map((tool) => (
          <span key={tool} className={styles.tool}>{tool}</span>
        ))}
      </div>
    </BorderGlow>
  )
}
