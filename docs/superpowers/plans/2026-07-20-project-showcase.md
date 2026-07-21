# Project Showcase Redesign — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Upgrade portfolio projects from a text-heavy carousel to a premium visual showcase with rich cards, placeholder images, and a cinematic detail modal.

**Architecture:** One new component (ProjectModal), two modified components (ProjectCard, Projects), extended project data, and 12 generated SVG placeholder images. The modal reuses the existing BorderGlow and ScrollReveal patterns; animations follow the existing `--ease-out-expo` convention.

**Tech Stack:** React 19, Vite 8, CSS Modules, OGL (unchanged)

## Global Constraints

- All new CSS uses the project's `--var` token system from `src/styles/tokens.css`
- All components use CSS Modules (`*.module.css`)
- Animations use `cubic-bezier(0.16, 1, 0.3, 1)` (`--ease-out-expo`)
- Modal matches the site's dark aesthetic: `--bg-primary: #08080F`, `--bg-surface: #111118`
- File extension detection: `.mp4`/`.webm` renders `<video>`, anything else renders `<img>`

---

### Task 1: Fix favicon and background video filename

**Files:**
- Modify: `index.html:5`
- Rename: `public/backgroud.mp4` → `public/background.mp4`
- Modify: `src/components/Hero.jsx:14`

**Interfaces:**
- Consumes: nothing
- Produces: corrected filenames for Tasks 4-7

- [ ] **Step 1: Fix favicon reference in index.html**

```html
<!-- index.html, line 5 — change: -->
<link rel="icon" type="image/svg+xml" href="/favicon.svg" />
```

Use Edit to replace `href="/vite.svg"` with `href="/favicon.svg"`.

- [ ] **Step 2: Rename background video file**

```bash
cd /Users/jy/Documents/Personal-profile/portfolio-v5
mv public/backgroud.mp4 public/background.mp4
```

- [ ] **Step 3: Update Hero.jsx video source reference**

In `src/components/Hero.jsx`, line 14, change `src="/backgroud.mp4"` to `src="/background.mp4"`.

```jsx
// Hero.jsx, line 14 — change:
src="/background.mp4"
```

- [ ] **Step 4: Verify build still passes**

```bash
cd /Users/jy/Documents/Personal-profile/portfolio-v5 && npm run build
```

Expected: `✓ built in ...` with no errors.

- [ ] **Step 5: Commit**

```bash
git add index.html src/components/Hero.jsx public/background.mp4 public/backgroud.mp4
git commit -m "fix: correct favicon path and background video filename"
```

Delete the old file from git tracking if needed:
```bash
git rm --cached public/backgroud.mp4 2>/dev/null || true
```

---

### Task 2: Generate 12 SVG placeholder images

**Files:**
- Create: `public/projects/project-01.svg` through `public/projects/project-12.svg`

**Interfaces:**
- Consumes: project accent colors from `src/data/projects.js` (cyan, magenta, green)
- Produces: `/projects/project-NN.svg` URLs referenced by project data in Task 3

- [ ] **Step 1: Create the projects directory**

```bash
mkdir -p /Users/jy/Documents/Personal-profile/portfolio-v5/public/projects
```

- [ ] **Step 2: Generate 12 placeholder SVGs using a shell script**

Create and run this script to generate all 12 SVGs at once. Each project gets a unique gradient + emoji icon matched to its content:

```bash
cd /Users/jy/Documents/Personal-profile/portfolio-v5/public/projects

# Color palettes by accent group
CYAN1="#0D2B3B"; CYAN2="#0A4A5A"; ACCENT_CYAN="#4DFFFF"
MAG1="#2B0D2B"; MAG2="#4A0A3A"; ACCENT_MAG="#FF4DFF"
GREEN1="#0D2B1A"; GREEN2="#0A4A2A"; ACCENT_GREEN="#4DFFCF"

# Project definitions: filename|icon|color1|color2|accent
projects=(
  "project-01.svg|🤖|$CYAN1|$CYAN2|$ACCENT_CYAN"
  "project-02.svg|👁️|$MAG1|$MAG2|$ACCENT_MAG"
  "project-03.svg|📊|$GREEN1|$GREEN2|$ACCENT_GREEN"
  "project-04.svg|✍️|$CYAN1|$CYAN2|$ACCENT_CYAN"
  "project-05.svg|📄|$MAG1|$MAG2|$ACCENT_MAG"
  "project-06.svg|💬|$GREEN1|$GREEN2|$ACCENT_GREEN"
  "project-07.svg|🎫|$CYAN1|$CYAN2|$ACCENT_CYAN"
  "project-08.svg|📧|$MAG1|$MAG2|$ACCENT_MAG"
  "project-09.svg|🍔|$GREEN1|$GREEN2|$ACCENT_GREEN"
  "project-10.svg|🔬|$CYAN1|$CYAN2|$ACCENT_CYAN"
  "project-11.svg|📸|$MAG1|$MAG2|$ACCENT_MAG"
  "project-12.svg|💊|$GREEN1|$GREEN2|$ACCENT_GREEN"
)

for proj in "${projects[@]}"; do
  IFS='|' read -r filename icon c1 c2 accent <<< "$proj"
  cat > "$filename" << SVGEOF
<svg xmlns="http://www.w3.org/2000/svg" width="800" height="450" viewBox="0 0 800 450">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${c1}"/>
      <stop offset="100%" stop-color="${c2}"/>
    </linearGradient>
    <radialGradient id="glow" cx="50%" cy="40%" r="50%">
      <stop offset="0%" stop-color="${accent}" stop-opacity="0.12"/>
      <stop offset="100%" stop-color="${accent}" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="800" height="450" fill="url(#bg)"/>
  <rect width="800" height="450" fill="url(#glow)"/>
  <g transform="translate(400,200)">
    <text text-anchor="middle" dominant-baseline="central" font-size="96" opacity="0.15" fill="${accent}">${icon}</text>
  </g>
  <g transform="translate(400,340)">
    <text text-anchor="middle" dominant-baseline="central" font-family="Inter, system-ui, sans-serif" font-size="20" font-weight="600" fill="${accent}" opacity="0.35">Preview</text>
    <rect x="-60" y="26" width="120" height="1" fill="${accent}" opacity="0.2" rx="0.5"/>
  </g>
</svg>
SVGEOF
  echo "Created $filename"
done
```

- [ ] **Step 3: Verify all 12 SVGs exist**

```bash
ls -la /Users/jy/Documents/Personal-profile/portfolio-v5/public/projects/project-*.svg | wc -l
```

Expected: `12`

- [ ] **Step 4: Commit**

```bash
git add public/projects/
git commit -m "feat: add 12 project placeholder SVG images"
```

---

### Task 3: Extend project data with modal fields

**Files:**
- Modify: `src/data/projects.js`

**Interfaces:**
- Consumes: placeholder image paths from Task 2
- Produces: extended `projects` array with `image`, `longDescription`, `liveUrl`, `repoUrl` — consumed by Tasks 4, 5, 6

- [ ] **Step 1: Add image paths to all 12 projects**

In `src/data/projects.js`, add `image: "/projects/project-NN.svg"` to each project entry matching its ID.

Also add `longDescription`, `liveUrl`, and `repoUrl` fields where applicable. Projects without links get `null` values (the modal hides those buttons).

The full updated file (`src/data/projects.js`):

```js
export const projects = [
  {
    id: 1,
    title: "⚡ AI Studio",
    description: "Premium all-in-one AI toolkit — 7 tools in a single static site. 100% browser-based, zero data leakage. Includes chatbot, compiler, content generator, data analyst, image & PDF analyzers.",
    longDescription: "A premium all-in-one AI toolkit that packages 7 powerful tools into a single static website. Every tool runs 100% in the browser — no backend, no API keys sent to any server, zero data leakage. Built with a dark premium UI, the suite includes a multi-provider chatbot, a code compiler supporting multiple languages, an AI content generator for blogs and marketing, a data analyst with auto-generated charts, and both image and PDF analyzers. Designed for creators, developers, and analysts who want powerful AI without compromising privacy.",
    tags: ["OpenAI", "Claude", "Gemini", "JavaScript", "Python"],
    accent: "cyan",
    image: "/projects/project-01.svg",
    liveUrl: null,
    repoUrl: null,
  },
  {
    id: 2,
    title: "AI Image Analyzer",
    description: "Multi-provider vision AI — extracts colors, composition, style & reverse-engineers structured prompts. Smart resize, JSON repair, auto key-prefix detection.",
    longDescription: "A multi-provider vision AI tool that analyzes images across OpenAI, Gemini, and DeepSeek. It extracts dominant colors, composition patterns, and artistic style, then reverse-engineers structured prompts that could reproduce similar images. Features smart image resizing for different model context windows, automatic JSON repair for malformed responses, and intelligent API key-prefix detection that auto-routes to the correct provider. Perfect for designers, prompt engineers, and anyone curious about what makes an image work.",
    tags: ["OpenAI", "Gemini", "DeepSeek", "Vision AI", "Python"],
    accent: "magenta",
    image: "/projects/project-02.svg",
    liveUrl: null,
    repoUrl: null,
  },
  {
    id: 3,
    title: "AI Data Analyst",
    description: "Upload CSV/Excel — get auto charts, AI insights and natural-language querying. 7 chart types, auto profiling, plain-English questions.",
    longDescription: "Upload any CSV or Excel file and instantly get AI-powered insights, auto-generated charts, and natural-language querying. The tool auto-profiles your data — detecting column types, distributions, and correlations — then presents a dashboard of 7 chart types (bar, line, scatter, pie, histogram, box plot, heatmap). Ask plain-English questions about your data and get answers backed by real statistical analysis. Built with Python, Plotly, and OpenAI, it turns anyone into a data analyst in seconds.",
    tags: ["Python", "Plotly", "OpenAI", "Pandas", "Data Viz"],
    accent: "green",
    image: "/projects/project-03.svg",
    liveUrl: null,
    repoUrl: null,
  },
  {
    id: 4,
    title: "AI Content Generator",
    description: "All-in-one content creation — SEO blog articles, social media posts, marketing emails, ad copy, and scripts. 9 content types, 8 tones, bilingual EN/ZH.",
    longDescription: "An all-in-one content creation platform that generates professional-grade writing across 9 content types: SEO blog articles, social media posts, marketing emails, ad copy, video scripts, product descriptions, press releases, newsletters, and landing page copy. Choose from 8 tones of voice — from professional to playful — and generate content in both English and Chinese. Built with OpenAI and Claude for maximum quality, with built-in SEO optimization and readability scoring.",
    tags: ["OpenAI", "Claude", "Python", "SEO", "Marketing"],
    accent: "cyan",
    image: "/projects/project-04.svg",
    liveUrl: null,
    repoUrl: null,
  },
  {
    id: 5,
    title: "AI PDF Analyzer",
    description: "Multi-PDF text extraction with chunked Q&A, auto-suggested questions, and instant AI summaries. Smart document understanding at scale.",
    longDescription: "Upload multiple PDFs and ask questions across all of them simultaneously. The analyzer extracts text with smart chunking, preserving context across page boundaries, then indexes everything for fast retrieval. Auto-suggests questions based on document content, generates instant AI summaries, and supports follow-up questions that reference previous answers. Built with a RAG architecture using OpenAI and Claude, with support for documents up to hundreds of pages.",
    tags: ["OpenAI", "Claude", "Python", "PDF.js", "RAG"],
    accent: "magenta",
    image: "/projects/project-05.svg",
    liveUrl: null,
    repoUrl: null,
  },
  {
    id: 6,
    title: "AI Chatbot",
    description: "Custom AI chatbot with brand knowledge base (RAG-lite). Streaming responses with premium typing-effect UI. Embeddable widget generator for any website.",
    longDescription: "A custom AI chatbot that you can train on your brand's knowledge base using a RAG-lite architecture. Features streaming responses rendered with a premium typing-effect UI, conversation history, and context-aware follow-ups. Includes an embeddable widget generator — copy one line of JavaScript to add the chatbot to any website. Supports OpenAI, Claude, and DeepSeek as backends, with automatic failover between providers.",
    tags: ["OpenAI", "Claude", "DeepSeek", "JavaScript", "API"],
    accent: "green",
    image: "/projects/project-06.svg",
    liveUrl: null,
    repoUrl: null,
  },
  {
    id: 7,
    title: "Ticketing Check-In",
    description: "Web-based event check-in system for Drums of Resonance Concert. Firebase real-time database, ticket validation, cloud deployment.",
    longDescription: "A web-based event check-in system built for the Drums of Resonance Concert. Attendees scan their ticket QR codes at the door, and the system validates them against Firebase Realtime Database in milliseconds. Features include real-time attendance tracking, duplicate scan prevention, capacity monitoring, and a clean dashboard for event staff. Deployed to the cloud for reliability, it handled hundreds of check-ins smoothly on event night.",
    tags: ["HTML", "CSS", "Firebase"],
    accent: "cyan",
    image: "/projects/project-07.svg",
    liveUrl: null,
    repoUrl: null,
  },
  {
    id: 8,
    title: "Bulk Email Sender",
    description: "Automated bulk email system for concert ticketing confirmations. Responsive HTML/CSS email templates with automated distribution workflows.",
    longDescription: "An automated bulk email system built to handle concert ticketing confirmations at scale. Features responsive HTML/CSS email templates that render beautifully across Gmail, Outlook, and Apple Mail. The Python backend handles automated distribution workflows with rate limiting, bounce handling, and delivery tracking. Sent hundreds of confirmation emails for the Drums of Resonance Concert without a single spam flag.",
    tags: ["Python", "HTML", "CSS"],
    accent: "magenta",
    image: "/projects/project-08.svg",
    liveUrl: null,
    repoUrl: null,
  },
  {
    id: 9,
    title: "MakanHero",
    description: "Food-saving web platform connecting users with surplus food offers. Responsive UI with backend database integration — full-stack solution.",
    longDescription: "A food-saving web platform that connects users with restaurants and stores offering surplus food at discounted prices. Built as a full-stack solution with a responsive frontend UI and PHP/MySQL backend. Features include user authentication, listing search with filters, geolocation-based discovery, order management, and a rating system. Designed to reduce food waste while making meals more affordable for everyone.",
    tags: ["HTML", "CSS", "PHP", "MySQL", "JS"],
    accent: "green",
    image: "/projects/project-09.svg",
    liveUrl: null,
    repoUrl: null,
  },
  {
    id: 10,
    title: "Breast Cancer Analysis",
    description: "Data preprocessing and analysis on breast cancer datasets. Visualizations and exploratory analysis in Python for predictive outcomes.",
    longDescription: "A data science project applying preprocessing and exploratory analysis to breast cancer datasets. Includes handling missing values, feature scaling, outlier detection, and correlation analysis. Generates a suite of visualizations — distribution plots, correlation heatmaps, pair plots, and PCA projections — to uncover patterns predictive of outcomes. Built in Python using Pandas, Matplotlib, Seaborn, and Scikit-learn in Google Colab.",
    tags: ["Python", "Google Colab", "ML", "Data Viz"],
    accent: "cyan",
    image: "/projects/project-10.svg",
    liveUrl: null,
    repoUrl: null,
  },
  {
    id: 11,
    title: "JJ Photography Site",
    description: "Professional photography portfolio website. Figma prototypes converted to responsive web pages. Deployed and maintained via Netlify.",
    longDescription: "A professional photography portfolio website designed from Figma prototypes and built into fully responsive web pages. Features a clean, image-first layout that lets photography take center stage — gallery grids, lightbox viewing, and categorized portfolios. Deployed and maintained via Netlify with continuous deployment from Git. Optimized for fast loading with lazy-loaded images and minimal JavaScript.",
    tags: ["HTML", "CSS", "Netlify", "Figma"],
    accent: "magenta",
    image: "/projects/project-11.svg",
    liveUrl: null,
    repoUrl: null,
  },
  {
    id: 12,
    title: "Medicine E-Commerce",
    description: "Medicine e-commerce website with user-friendly shopping experience. UI/UX wireframes in Figma, product management, and database integration.",
    longDescription: "A medicine e-commerce website designed with a user-friendly shopping experience at its core. The UI/UX was wireframed in Figma with a focus on accessibility and clear information hierarchy — critical for a health-related product. Features include product catalog with categories, search with filters, shopping cart, checkout flow, and an admin panel for product and order management. Backend built with PHP and MySQL for reliable data handling.",
    tags: ["Figma", "HTML", "CSS", "PHP", "MySQL"],
    accent: "green",
    image: "/projects/project-12.svg",
    liveUrl: null,
    repoUrl: null,
  },
]
```

Write this complete file to `src/data/projects.js` using the Write tool.

- [ ] **Step 2: Verify the data file is valid JavaScript**

```bash
cd /Users/jy/Documents/Personal-profile/portfolio-v5 && node -e "import('./src/data/projects.js').then(m => console.log(m.projects.length, 'projects, first:', m.projects[0].image))"
```

Expected: `12 projects, first: /projects/project-01.svg`

- [ ] **Step 3: Verify build passes**

```bash
npm run build
```

Expected: `✓ built in ...`

- [ ] **Step 4: Commit**

```bash
git add src/data/projects.js
git commit -m "feat: extend project data with images, long descriptions, and link fields"
```

---

### Task 4: Redesign ProjectCard with image, hover effects, and click handler

**Files:**
- Modify: `src/components/ProjectCard.jsx`
- Modify: `src/components/ProjectCard.module.css`

**Interfaces:**
- Consumes: `project` object from Task 3 (with `image`, `tags`, `accent`)
- Produces: `onSelect(project)` callback prop — consumed by Projects carousel in Task 6

- [ ] **Step 1: Write the updated ProjectCard.jsx**

```jsx
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
```

Write this to `src/components/ProjectCard.jsx`.

- [ ] **Step 2: Write the updated ProjectCard.module.css**

```css
.card {
  flex-shrink: 0;
  width: clamp(380px, 38vw, 520px);
  scroll-snap-align: center;
  scroll-snap-stop: always;
  transition: opacity 600ms ease, transform 400ms var(--ease-out-expo);
  cursor: pointer;
  opacity: 0.5;
}

.card:hover {
  opacity: 0.85;
  transform: translateY(-4px);
}

.active {
  opacity: 1;
}

.imageArea {
  width: 100%;
  aspect-ratio: 16 / 9;
  position: relative;
  overflow: hidden;
}

.image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 400ms var(--ease-out-expo);
}

.card:hover .image {
  transform: scale(1.03);
}

.imageOverlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 50%;
  background: linear-gradient(to top, rgba(8, 8, 15, 0.85), transparent);
  display: flex;
  align-items: flex-end;
  padding: 12px;
}

.tagPreview {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
}

.tagPreviewChip {
  padding: 3px 8px;
  border-radius: 4px;
  font-family: var(--font-mono);
  font-size: 10px;
  font-weight: 500;
  background: rgba(8, 8, 15, 0.7);
  color: var(--accent);
  border: 1px solid rgba(77, 255, 255, 0.15);
  backdrop-filter: blur(4px);
}

.body {
  padding: 20px 24px 24px;
}

.title {
  font-size: 20px;
  font-weight: 600;
  color: var(--text-primary);
  letter-spacing: -0.3px;
  margin-bottom: 4px;
}

.desc {
  font-size: 14px;
  color: var(--text-secondary);
  line-height: 1.6;
  margin-bottom: 16px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.tags {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
}

.tag {
  padding: 4px 10px;
  border-radius: 4px;
  font-family: var(--font-mono);
  font-size: 11px;
  font-weight: 500;
  background: rgba(255, 255, 255, 0.04);
  color: var(--text-muted);
  border: 1px solid var(--border-subtle);
}
```

Write this to `src/components/ProjectCard.module.css`.

- [ ] **Step 3: Verify build passes**

```bash
cd /Users/jy/Documents/Personal-profile/portfolio-v5 && npm run build
```

Expected: `✓ built in ...`

- [ ] **Step 4: Commit**

```bash
git add src/components/ProjectCard.jsx src/components/ProjectCard.module.css
git commit -m "feat: redesign ProjectCard with image, hover zoom, tag preview, and click handler"
```

---

### Task 5: Build ProjectModal component

**Files:**
- Create: `src/components/ProjectModal.jsx`
- Create: `src/components/ProjectModal.module.css`

**Interfaces:**
- Consumes: `project`, `projects` (full array for prev/next nav), `onClose()`, `onNavigate(index)` props
- Produces: self-contained modal with keyboard nav, scroll lock, animation — consumed by Projects carousel in Task 6

- [ ] **Step 1: Write ProjectModal.jsx**

```jsx
import { useEffect, useCallback, useRef } from 'react'
import styles from './ProjectModal.module.css'

const MEDIA_EXTENSIONS = /\.(mp4|webm|mov)$/i

function isVideo(path) {
  return MEDIA_EXTENSIONS.test(path)
}

export default function ProjectModal({ project, projects, onClose, onNavigate }) {
  const overlayRef = useRef(null)
  const currentIndex = projects.findIndex((p) => p.id === project.id)
  const hasPrev = currentIndex > 0
  const hasNext = currentIndex < projects.length - 1

  const close = useCallback(() => {
    if (onClose) onClose()
  }, [onClose])

  const goTo = useCallback((index) => {
    if (onNavigate) onNavigate(index)
  }, [onNavigate])

  const prev = useCallback(() => {
    if (hasPrev) goTo(currentIndex - 1)
    else goTo(projects.length - 1) // wrap to last
  }, [hasPrev, currentIndex, goTo, projects.length])

  const next = useCallback(() => {
    if (hasNext) goTo(currentIndex + 1)
    else goTo(0) // wrap to first
  }, [hasNext, currentIndex, goTo])

  // Keyboard navigation
  useEffect(() => {
    const handleKey = (e) => {
      switch (e.key) {
        case 'Escape':
          close()
          break
        case 'ArrowLeft':
          prev()
          break
        case 'ArrowRight':
          next()
          break
      }
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [close, prev, next])

  // Lock body scroll
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  const handleOverlayClick = (e) => {
    if (e.target === overlayRef.current) close()
  }

  const hasMedia = Boolean(project.image)
  const displayText = project.longDescription || project.description

  return (
    <div
      className={styles.overlay}
      ref={overlayRef}
      onClick={handleOverlayClick}
      role="dialog"
      aria-modal="true"
      aria-label={project.title}
    >
      <div className={styles.modal}>
        {/* Close button */}
        <button
          className={styles.closeBtn}
          onClick={close}
          aria-label="Close"
        >
          ×
        </button>

        {/* Navigation arrows */}
        <button
          className={`${styles.arrow} ${styles.arrowLeft}`}
          onClick={prev}
          aria-label="Previous project"
        >
          ←
        </button>
        <button
          className={`${styles.arrow} ${styles.arrowRight}`}
          onClick={next}
          aria-label="Next project"
        >
          →
        </button>

        {/* Content */}
        <div className={styles.body}>
          {hasMedia && (
            <div className={styles.mediaArea}>
              {isVideo(project.image) ? (
                <video
                  src={project.image}
                  className={styles.media}
                  autoPlay
                  muted
                  loop
                  playsInline
                  controls
                />
              ) : (
                <img
                  src={project.image}
                  alt={project.title}
                  className={styles.media}
                />
              )}
            </div>
          )}

          <div className={styles.textContent}>
            <h2 className={styles.title}>{project.title}</h2>

            <div className={styles.tags}>
              {project.tags.map((tag) => (
                <span key={tag} className={styles.tag}>{tag}</span>
              ))}
            </div>

            <p className={styles.description}>{displayText}</p>

            {(project.liveUrl || project.repoUrl) && (
              <div className={styles.links}>
                {project.liveUrl && (
                  <a
                    href={project.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.linkBtn}
                  >
                    🌐 Live Demo
                  </a>
                )}
                {project.repoUrl && (
                  <a
                    href={project.repoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`${styles.linkBtn} ${styles.linkBtnSecondary}`}
                  >
                    📂 Source Code
                  </a>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Project counter */}
        <div className={styles.counter}>
          {currentIndex + 1} / {projects.length}
        </div>
      </div>
    </div>
  )
}
```

Write this to `src/components/ProjectModal.jsx`.

- [ ] **Step 2: Write ProjectModal.module.css**

```css
.overlay {
  position: fixed;
  inset: 0;
  z-index: 1000;
  background: rgba(8, 8, 15, 0.85);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px;
  animation: overlayIn 400ms var(--ease-out-expo);
}

@keyframes overlayIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.modal {
  position: relative;
  width: 100%;
  max-width: 900px;
  max-height: calc(100vh - 80px);
  background: var(--bg-surface);
  border: 1px solid var(--border-active);
  border-radius: 20px;
  overflow-y: auto;
  animation: modalIn 400ms var(--ease-out-expo);
  box-shadow:
    0 0 0 1px rgba(77, 255, 255, 0.05),
    0 20px 60px rgba(0, 0, 0, 0.5);
}

@keyframes modalIn {
  from {
    opacity: 0;
    transform: scale(0.92) translateY(20px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

.modal::-webkit-scrollbar {
  width: 4px;
}

.modal::-webkit-scrollbar-thumb {
  background: var(--border-active);
  border-radius: 2px;
}

/* Close button */
.closeBtn {
  position: absolute;
  top: 16px;
  right: 16px;
  z-index: 10;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  color: var(--text-secondary);
  background: rgba(8, 8, 15, 0.8);
  border: 1px solid rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(8px);
  transition: all 200ms ease;
  cursor: pointer;
}

.closeBtn:hover {
  color: var(--text-primary);
  background: rgba(8, 8, 15, 0.95);
  border-color: var(--accent);
}

/* Navigation arrows */
.arrow {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  z-index: 10;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 22px;
  color: var(--accent);
  background: rgba(8, 8, 15, 0.9);
  border: 1px solid rgba(77, 255, 255, 0.4);
  backdrop-filter: blur(8px);
  transition: all 200ms ease;
  cursor: pointer;
}

.arrow:hover {
  background: rgba(77, 255, 255, 0.15);
  border-color: var(--accent);
  box-shadow: 0 0 20px var(--accent-glow);
}

.arrowLeft {
  left: -24px;
}

.arrowRight {
  right: -24px;
}

/* Media area */
.mediaArea {
  width: 100%;
  aspect-ratio: 16 / 9;
  background: var(--bg-primary);
  overflow: hidden;
}

.media {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* Text content */
.textContent {
  padding: 32px 40px 40px;
}

.title {
  font-size: 32px;
  font-weight: 600;
  letter-spacing: -0.5px;
  color: var(--text-primary);
  margin-bottom: 20px;
}

.tags {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  margin-bottom: 24px;
}

.tag {
  padding: 5px 12px;
  border-radius: 5px;
  font-family: var(--font-mono);
  font-size: 12px;
  font-weight: 500;
  background: rgba(255, 255, 255, 0.04);
  color: var(--text-secondary);
  border: 1px solid var(--border-subtle);
}

.description {
  font-size: 16px;
  color: var(--text-secondary);
  line-height: 1.8;
  margin-bottom: 32px;
  white-space: pre-line;
}

/* Link buttons */
.links {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.linkBtn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 12px 24px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  color: var(--bg-primary);
  background: var(--accent);
  border: none;
  cursor: pointer;
  text-decoration: none;
  transition: all 200ms ease;
}

.linkBtn:hover {
  box-shadow: 0 0 24px var(--accent-glow-strong);
  transform: translateY(-1px);
}

.linkBtnSecondary {
  color: var(--text-primary);
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid var(--border-active);
}

.linkBtnSecondary:hover {
  background: rgba(255, 255, 255, 0.1);
  box-shadow: 0 0 20px rgba(255, 255, 255, 0.05);
}

/* Project counter */
.counter {
  position: absolute;
  bottom: 16px;
  left: 50%;
  transform: translateX(-50%);
  font-family: var(--font-mono);
  font-size: 12px;
  color: var(--text-muted);
  background: rgba(8, 8, 15, 0.7);
  padding: 4px 12px;
  border-radius: 12px;
  border: 1px solid var(--border-subtle);
}
```

Write this to `src/components/ProjectModal.module.css`.

- [ ] **Step 3: Verify build passes with the new component (it won't break since nothing imports it yet)**

```bash
cd /Users/jy/Documents/Personal-profile/portfolio-v5 && npm run build
```

Expected: `✓ built in ...`

- [ ] **Step 4: Commit**

```bash
git add src/components/ProjectModal.jsx src/components/ProjectModal.module.css
git commit -m "feat: add ProjectModal with animation, keyboard nav, and media support"
```

---

### Task 6: Update Projects carousel to wire up modal

**Files:**
- Modify: `src/components/Projects.jsx`

**Interfaces:**
- Consumes: `ProjectCard` with `onSelect` prop (Task 4), `ProjectModal` (Task 5)
- Produces: working end-to-end flow — card click → modal open → nav → close

- [ ] **Step 1: Write the updated Projects.jsx**

```jsx
import { useState, useCallback, useRef } from 'react'
import { projects } from '../data/projects'
import ProjectCard from './ProjectCard'
import ProjectModal from './ProjectModal'
import styles from './Projects.module.css'

function smoothScrollTo(track, targetLeft, duration = 700) {
  const start = track.scrollLeft
  const startTime = performance.now()

  function animate(now) {
    const elapsed = now - startTime
    const progress = Math.min(elapsed / duration, 1)
    const eased = 1 - Math.pow(1 - progress, 3)
    track.scrollLeft = start + (targetLeft - start) * eased
    if (progress < 1) {
      requestAnimationFrame(animate)
    }
  }

  requestAnimationFrame(animate)
}

export default function Projects() {
  const total = projects.length
  const trackRef = useRef(null)
  const scrollRaf = useRef(null)
  const [active, setActive] = useState(0)
  const [selectedProject, setSelectedProject] = useState(null)

  const getCardCenter = useCallback((index) => {
    const track = trackRef.current
    if (!track) return 0
    const card = track.children[index]
    if (!card) return 0
    return card.offsetLeft + card.offsetWidth / 2 - track.offsetWidth / 2
  }, [])

  const scrollToCard = useCallback((index) => {
    const track = trackRef.current
    if (!track) return
    const target = getCardCenter(index)
    smoothScrollTo(track, target, 700)
  }, [getCardCenter])

  const next = useCallback(() => {
    setActive((prev) => {
      const nextIdx = (prev + 1) % total
      scrollToCard(nextIdx)
      return nextIdx
    })
  }, [total, scrollToCard])

  const prev = useCallback(() => {
    setActive((prev) => {
      const prevIdx = (prev - 1 + total) % total
      scrollToCard(prevIdx)
      return prevIdx
    })
  }, [total, scrollToCard])

  const handleScroll = useCallback(() => {
    if (scrollRaf.current) return
    scrollRaf.current = requestAnimationFrame(() => {
      scrollRaf.current = null
      const track = trackRef.current
      if (!track) return
      const center = track.scrollLeft + track.offsetWidth / 2
      let closest = 0
      let closestDist = Infinity
      for (let i = 0; i < track.children.length; i++) {
        const card = track.children[i]
        const cardCenter = card.offsetLeft + card.offsetWidth / 2
        const dist = Math.abs(center - cardCenter)
        if (dist < closestDist) {
          closestDist = dist
          closest = i
        }
      }
      if (closest !== active) setActive(closest)
    })
  }, [active])

  // Modal handlers
  const handleSelect = useCallback((project) => {
    setSelectedProject(project)
  }, [])

  const handleClose = useCallback(() => {
    setSelectedProject(null)
  }, [])

  const handleNavigate = useCallback((index) => {
    setSelectedProject(projects[index])
    setActive(index)
    scrollToCard(index)
  }, [scrollToCard])

  return (
    <section id="projects" className={styles.section}>
      <div className="container">
        <p className="section-label">[SECTION_02]</p>
        <h2 className="section-heading">Featured Projects</h2>

        <p className={styles.hint}>Click a project to learn more</p>

        <div className={styles.carousel}>
          <button onClick={prev} className={styles.arrow} aria-label="Previous">
            ←
          </button>

          <div className={styles.track} ref={trackRef} onScroll={handleScroll}>
            {projects.map((project, idx) => (
              <ProjectCard
                key={project.id}
                project={project}
                isActive={idx === active}
                onSelect={handleSelect}
              />
            ))}
          </div>

          <button onClick={next} className={styles.arrow} aria-label="Next">
            →
          </button>
        </div>

        <div className={styles.dots}>
          {projects.map((_, i) => (
            <button
              key={i}
              onClick={() => {
                setActive(i)
                scrollToCard(i)
              }}
              className={`${styles.dot} ${i === active ? styles.dotActive : ''}`}
              aria-label={`Project ${i + 1}`}
            />
          ))}
        </div>
      </div>

      {selectedProject && (
        <ProjectModal
          project={selectedProject}
          projects={projects}
          onClose={handleClose}
          onNavigate={handleNavigate}
        />
      )}
    </section>
  )
}
```

Write this to `src/components/Projects.jsx`.

- [ ] **Step 2: Add the hint text style to Projects.module.css**

Use Edit to add the following after the `.section :global(.container)` rule in `src/components/Projects.module.css`:

```css
.hint {
  font-family: var(--font-mono);
  font-size: 12px;
  color: var(--text-muted);
  letter-spacing: 1px;
  margin-top: -36px;
  margin-bottom: 40px;
}
```

- [ ] **Step 3: Verify build passes**

```bash
cd /Users/jy/Documents/Personal-profile/portfolio-v5 && npm run build
```

Expected: `✓ built in ...`

- [ ] **Step 4: Run dev server and spot-check**

```bash
npm run dev &
sleep 2
echo "Dev server running — open http://localhost:5173 to test"
```

Expected: Site loads with project images visible on cards. Click a card → modal opens with full project detail. Arrow keys and ← → buttons navigate between projects. Escape closes.

- [ ] **Step 5: Commit**

```bash
git add src/components/Projects.jsx src/components/Projects.module.css
git commit -m "feat: wire up ProjectModal to Projects carousel with card click navigation"
```

---

### Task 7: Final verification and polish

**Files:**
- No new files — all changes complete

- [ ] **Step 1: Run production build**

```bash
cd /Users/jy/Documents/Personal-profile/portfolio-v5 && npm run build
```

Expected: `✓ built in ...` with no warnings.

- [ ] **Step 2: Preview the production build**

```bash
npm run preview &
sleep 2
echo "Preview running — open the URL shown above"
```

Manual check:
- All 12 project cards show with unique gradient placeholder images
- Cards have hover lift + zoom effect
- Inactive cards are dimmed, active card is fully opaque
- Clicking a card opens the modal with scale+fade animation
- Modal shows: large image, project title, all tags, long description
- ← → arrows navigate between projects (wrapping)
- Left/Right keyboard keys navigate
- Escape key closes the modal
- Clicking the backdrop closes the modal
- Body scroll is locked while modal is open
- Close button works
- "Click a project to learn more" hint text visible below heading
- Favicon loads correctly (`/favicon.svg`)
- Hero background video loads correctly (`/background.mp4`)
- No console errors

- [ ] **Step 3: Final commit if any tweaks were needed**

```bash
git add -A
git commit -m "chore: final polish and verification of project showcase"
```

If no changes needed, skip this commit.
