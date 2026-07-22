import { chromium } from 'playwright';
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'fs';
import { createServer } from 'http';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');
const PROJECTS_DIR = resolve(ROOT, 'public/projects');
const DEMOS_DIR = resolve(ROOT, 'demos');

// Project data — matches src/data/projects.js
const PROJECTS = [
  { id: 1,  title: "AI Studio",           accent: "cyan",    icon: "🤖", type: "dashboard",
    features: ["Multi-provider chatbot", "Code compiler", "Content generator", "Data analyst", "Image analyzer", "PDF analyzer", "100% browser-based"] },
  { id: 2,  title: "AI Image Analyzer",   accent: "magenta", icon: "👁️", type: "vision",
    features: ["Upload any image", "Extract colors & composition", "Reverse-engineer prompts", "Multi-provider: OpenAI, Gemini, DeepSeek"] },
  { id: 3,  title: "AI Data Analyst",     accent: "green",   icon: "📊", type: "charts",
    features: ["Upload CSV / Excel", "Auto-generated charts", "Natural-language querying", "7 chart types", "Statistical profiling"] },
  { id: 4,  title: "AI Content Generator", accent: "cyan",   icon: "✍️", type: "text",
    features: ["9 content types", "SEO blog articles", "Social media posts", "Marketing emails", "Bilingual EN / ZH"] },
  { id: 5,  title: "AI PDF Analyzer",     accent: "magenta", icon: "📄", type: "document",
    features: ["Upload multiple PDFs", "Cross-document Q&A", "Auto-suggested questions", "Instant AI summaries", "RAG architecture"] },
  { id: 6,  title: "AI Chatbot",          accent: "green",   icon: "💬", type: "chat",
    features: ["Custom brand knowledge base", "Streaming responses", "Typing-effect UI", "Embeddable widget", "Multi-provider: OpenAI, Claude, DeepSeek"] },
  { id: 7,  title: "Ticketing Check-In",   accent: "cyan",    icon: "🎫", type: "web",
    features: ["QR code ticket scanning", "Firebase real-time DB", "Instant validation", "Attendance tracking", "Drums of Resonance Concert"] },
  { id: 8,  title: "Bulk Email Sender",    accent: "magenta", icon: "📧", type: "code",
    features: ["Automated email distribution", "Responsive HTML templates", "Rate limiting & bounce handling", "Delivery tracking", "Python backend"] },
  { id: 9,  title: "MakanHero",            accent: "green",   icon: "🍔", type: "web",
    features: ["Food surplus marketplace", "Restaurant-to-user platform", "Geolocation discovery", "Order management", "PHP / MySQL full-stack"] },
  { id: 10, title: "Breast Cancer Analysis", accent: "cyan",  icon: "🔬", type: "charts",
    features: ["Dataset preprocessing", "Feature scaling & outlier detection", "Correlation analysis", "PCA projections", "Predictive modeling"] },
  { id: 11, title: "JJ Photography",       accent: "magenta", icon: "📸", type: "web",
    features: ["Professional photo portfolio", "Figma-designed layouts", "Gallery grid & lightbox", "Lazy-loaded images", "Netlify deployment"] },
  { id: 12, title: "Medicine E-Commerce",   accent: "green",  icon: "💊", type: "web",
    features: ["Medicine online store", "Accessible UI/UX design", "Product catalog with search", "Shopping cart & checkout", "Admin panel"] },
];

const ACCENT_COLORS = {
  cyan:    { primary: '#4DFFFF', bg1: '#061A1F', bg2: '#0A2A30', glow: 'rgba(77,255,255,0.15)' },
  magenta: { primary: '#FF4DFF', bg1: '#1A061F', bg2: '#2A0A30', glow: 'rgba(255,77,255,0.15)' },
  green:   { primary: '#4DFFCF', bg1: '#061F14', bg2: '#0A3020', glow: 'rgba(77,255,207,0.15)' },
};

const TYPE_ANIMATIONS = {
  dashboard: `<!-- Dashboard grid animation -->
    <div class="dashboard-grid">
      <div class="dash-card" style="animation-delay:0.5s"><div class="dash-bar"></div><div class="dash-line"></div></div>
      <div class="dash-card" style="animation-delay:0.8s"><div class="dash-bar short"></div><div class="dash-line"></div></div>
      <div class="dash-card" style="animation-delay:1.1s"><div class="dash-bar"></div><div class="dash-line short"></div></div>
      <div class="dash-card" style="animation-delay:1.4s"><div class="dash-bar short"></div><div class="dash-line"></div></div>
      <div class="dash-card" style="animation-delay:1.7s"><div class="dash-bar"></div><div class="dash-line short"></div></div>
      <div class="dash-card" style="animation-delay:2.0s"><div class="dash-bar short"></div><div class="dash-line"></div></div>
    </div>`,
  vision: `<!-- Image analysis animation -->
    <div class="vision-demo">
      <div class="vision-image"><span class="vision-emoji">🖼️</span><div class="scan-line"></div></div>
      <div class="vision-results">
        <div class="result-row" style="animation-delay:1s"><span class="result-label">Colors</span><span class="result-dots">●●●●●</span></div>
        <div class="result-row" style="animation-delay:1.5s"><span class="result-label">Style</span><span class="result-val">Cinematic</span></div>
        <div class="result-row" style="animation-delay:2s"><span class="result-label">Prompt</span><span class="result-val code">A cinematic wide shot...</span></div>
      </div>
    </div>`,
  charts: `<!-- Chart animation -->
    <div class="charts-demo">
      <div class="chart-grid">
        <div class="mini-chart bar-chart"><div class="bar" style="height:60%"></div><div class="bar" style="height:85%"></div><div class="bar" style="height:40%"></div><div class="bar" style="height:70%"></div></div>
        <div class="mini-chart line-chart"><svg viewBox="0 0 100 50"><polyline points="0,40 20,30 40,35 60,10 80,25 100,15" fill="none" stroke="currentColor" stroke-width="2"/></svg></div>
        <div class="mini-chart pie-chart"><div class="pie"></div></div>
      </div>
    </div>`,
  text: `<!-- Content generation animation -->
    <div class="text-demo">
      <div class="text-tabs"><span class="tab active">Blog</span><span class="tab">Social</span><span class="tab">Email</span></div>
      <div class="text-output">
        <div class="typing-line" style="animation-delay:0.5s">The Future of Edge Computing in 2026</div>
        <div class="typing-line" style="animation-delay:1.5s">As organizations move beyond cloud-native architectures...</div>
        <div class="typing-line" style="animation-delay:2.5s">Edge computing is reshaping how we think about latency...</div>
        <div class="cursor-blink">▌</div>
      </div>
    </div>`,
  document: `<!-- PDF analysis animation -->
    <div class="document-demo">
      <div class="doc-sidebar">
        <div class="doc-file" style="animation-delay:0.3s">📄 report.pdf</div>
        <div class="doc-file" style="animation-delay:0.6s">📄 slides.pdf</div>
        <div class="doc-file" style="animation-delay:0.9s">📄 notes.pdf</div>
      </div>
      <div class="doc-chat">
        <div class="doc-question" style="animation-delay:1.2s">Summarize all three documents</div>
        <div class="doc-answer" style="animation-delay:2s">These documents cover Q3 performance across three departments. Revenue grew 12% YoY, with the strongest gains in the APAC region...</div>
      </div>
    </div>`,
  chat: `<!-- Chatbot animation -->
    <div class="chat-demo">
      <div class="chat-bubble user" style="animation-delay:0.3s">What's your return policy?</div>
      <div class="chat-bubble bot" style="animation-delay:0.8s">Our return policy allows returns within 30 days of purchase. All items must be in original condition with tags attached.</div>
      <div class="chat-bubble user" style="animation-delay:1.8s">Do you offer free shipping?</div>
      <div class="chat-bubble bot" style="animation-delay:2.3s">Yes! We offer free shipping on all orders over $50. Standard delivery takes 3-5 business days.</div>
    </div>`,
  web: `<!-- Web UI animation -->
    <div class="web-demo">
      <div class="web-header"><div class="web-nav-item"></div><div class="web-nav-item short"></div><div class="web-nav-item"></div></div>
      <div class="web-hero"><div class="web-hero-text"></div></div>
      <div class="web-grid">
        <div class="web-card" style="animation-delay:0.5s"><div class="web-card-img"></div><div class="web-card-text"></div></div>
        <div class="web-card" style="animation-delay:1s"><div class="web-card-img"></div><div class="web-card-text short"></div></div>
        <div class="web-card" style="animation-delay:1.5s"><div class="web-card-img"></div><div class="web-card-text"></div></div>
      </div>
    </div>`,
  code: `<!-- Code animation -->
    <div class="code-demo">
      <div class="code-editor">
        <div class="code-line" style="animation-delay:0.2s"><span class="code-keyword">import</span> smtplib</div>
        <div class="code-line" style="animation-delay:0.5s"><span class="code-keyword">from</span> email.mime <span class="code-keyword">import</span> MIMEMultipart</div>
        <div class="code-line empty" style="animation-delay:0.8s"></div>
        <div class="code-line" style="animation-delay:1s"><span class="code-keyword">def</span> <span class="code-func">send_bulk</span>(recipients, template):</div>
        <div class="code-line" style="animation-delay:1.3s">  server = smtplib.<span class="code-func">SMTP</span>(host, port)</div>
        <div class="code-line" style="animation-delay:1.6s">  <span class="code-keyword">for</span> email <span class="code-keyword">in</span> recipients:</div>
        <div class="code-line" style="animation-delay:1.9s">    msg = <span class="code-func">build_message</span>(email, template)</div>
        <div class="code-line" style="animation-delay:2.2s">    server.<span class="code-func">sendmail</span>(sender, email, msg)</div>
        <div class="code-line" style="animation-delay:2.5s">  <span class="code-keyword">return</span> {<span class="code-string">'sent'</span>: <span class="code-func">len</span>(recipients)}</div>
      </div>
    </div>`,
};

function makeDemoHTML(project) {
  const c = ACCENT_COLORS[project.accent];
  const anim = TYPE_ANIMATIONS[project.type] || TYPE_ANIMATIONS.code;

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${project.title} — Demo</title>
<style>
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body {
    width: 800px; height: 450px;
    background: linear-gradient(135deg, ${c.bg1}, ${c.bg2});
    font-family: 'Inter', system-ui, sans-serif;
    overflow: hidden;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .glow {
    position: absolute;
    width: 400px; height: 400px;
    border-radius: 50%;
    background: radial-gradient(circle, ${c.glow}, transparent 70%);
    top: -100px; right: -100px;
  }
  .glow2 {
    position: absolute;
    width: 300px; height: 300px;
    border-radius: 50%;
    background: radial-gradient(circle, ${c.glow}, transparent 70%);
    bottom: -80px; left: -60px;
  }
  .container {
    position: relative; z-index: 1;
    width: 720px; height: 380px;
    display: flex; flex-direction: column;
  }
  .header {
    display: flex; align-items: center; gap: 16px;
    margin-bottom: 28px;
  }
  .icon {
    font-size: 40px;
    animation: iconPop 0.6s cubic-bezier(0.16,1,0.3,1) both;
  }
  @keyframes iconPop {
    from { opacity: 0; transform: scale(0.5); }
    to { opacity: 1; transform: scale(1); }
  }
  .title-group {
    animation: slideUp 0.6s 0.2s cubic-bezier(0.16,1,0.3,1) both;
  }
  @keyframes slideUp {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }
  .title {
    font-size: 28px; font-weight: 700; color: #ECECEC;
    letter-spacing: -0.5px; line-height: 1.2;
  }
  .subtitle {
    font-size: 13px; color: ${c.primary}; opacity: 0.7;
    font-family: 'JetBrains Mono', monospace;
    letter-spacing: 1px; margin-top: 4px;
  }
  .demo-area {
    flex: 1;
    background: rgba(0,0,0,0.25);
    border: 1px solid rgba(255,255,255,0.06);
    border-radius: 12px;
    padding: 24px;
    overflow: hidden;
    position: relative;
  }
  .features {
    display: flex; gap: 8px; flex-wrap: wrap;
    margin-top: 16px;
  }
  .feature {
    padding: 5px 12px;
    border-radius: 6px;
    font-size: 11px;
    font-weight: 500;
    background: rgba(255,255,255,0.04);
    color: #8888A0;
    border: 1px solid rgba(255,255,255,0.06);
    animation: fadeIn 0.4s ease both;
  }
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }

  /* Dashboard */
  .dashboard-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; }
  .dash-card {
    background: rgba(255,255,255,0.03); border-radius: 8px; padding: 14px;
    border: 1px solid rgba(255,255,255,0.04);
    animation: cardIn 0.5s cubic-bezier(0.16,1,0.3,1) both;
  }
  @keyframes cardIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
  .dash-bar { height: 8px; background: ${c.primary}; opacity: 0.3; border-radius: 4px; margin-bottom: 8px; width: 100%; animation: pulseBar 3s ease-in-out infinite; }
  .dash-bar.short { width: 60%; }
  @keyframes pulseBar { 0%,100% { opacity: 0.2; } 50% { opacity: 0.5; } }
  .dash-line { height: 4px; background: rgba(255,255,255,0.06); border-radius: 2px; }

  /* Vision */
  .vision-demo { display: flex; gap: 20px; height: 100%; }
  .vision-image { width: 180px; height: 140px; background: rgba(255,255,255,0.03); border-radius: 8px; display: flex; align-items: center; justify-content: center; position: relative; overflow: hidden; border: 1px solid rgba(255,255,255,0.06); }
  .vision-emoji { font-size: 48px; opacity: 0.4; }
  .scan-line { position: absolute; left: 0; right: 0; height: 2px; background: ${c.primary}; opacity: 0.5; animation: scanDown 2s ease-in-out infinite; }
  @keyframes scanDown { 0%,100% { top: 0; } 50% { top: 100%; } }
  .vision-results { flex: 1; display: flex; flex-direction: column; gap: 12px; justify-content: center; }
  .result-row { display: flex; justify-content: space-between; align-items: center; padding: 8px 12px; background: rgba(255,255,255,0.02); border-radius: 6px; animation: rowIn 0.4s cubic-bezier(0.16,1,0.3,1) both; }
  @keyframes rowIn { from { opacity: 0; transform: translateX(-10px); } to { opacity: 1; transform: translateX(0); } }
  .result-label { font-size: 12px; color: #8888A0; font-family: 'JetBrains Mono', monospace; }
  .result-dots { color: ${c.primary}; font-size: 14px; letter-spacing: 2px; }
  .result-val { font-size: 12px; color: #ECECEC; font-weight: 500; }
  .result-val.code { font-family: 'JetBrains Mono', monospace; font-size: 10px; color: ${c.primary}; max-width: 200px; overflow: hidden; white-space: nowrap; text-overflow: ellipsis; }

  /* Charts */
  .charts-demo { height: 100%; }
  .chart-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; height: 100%; align-items: end; }
  .mini-chart { background: rgba(255,255,255,0.02); border-radius: 8px; padding: 12px; border: 1px solid rgba(255,255,255,0.04); }
  .bar-chart { display: flex; align-items: end; gap: 8px; height: 100%; padding-bottom: 0; }
  .bar { flex: 1; background: ${c.primary}; opacity: 0.4; border-radius: 3px 3px 0 0; animation: growUp 0.8s cubic-bezier(0.16,1,0.3,1) both; }
  @keyframes growUp { from { height: 0 !important; } }
  .line-chart svg { width: 100%; height: 100%; color: ${c.primary}; opacity: 0.6; }
  .pie-chart { display: flex; align-items: center; justify-content: center; }
  .pie { width: 60px; height: 60px; border-radius: 50%; background: conic-gradient(${c.primary} 0% 35%, ${c.primary}44 35% 55%, ${c.primary}22 55% 80%, ${c.primary}11 80% 100%); animation: spinPie 4s linear infinite; }
  @keyframes spinPie { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }

  /* Text / Content Generator */
  .text-demo { height: 100%; display: flex; flex-direction: column; }
  .text-tabs { display: flex; gap: 4px; margin-bottom: 16px; }
  .tab { padding: 6px 14px; border-radius: 6px; font-size: 12px; color: #555568; background: rgba(255,255,255,0.03); border: 1px solid transparent; }
  .tab.active { color: ${c.primary}; background: rgba(255,255,255,0.06); border-color: rgba(255,255,255,0.08); }
  .text-output { flex: 1; position: relative; }
  .typing-line { font-size: 14px; color: #8888A0; margin-bottom: 10px; overflow: hidden; white-space: nowrap; width: 0; animation: typeIn 1.5s steps(40,end) forwards; }
  @keyframes typeIn { from { width: 0; } to { width: 100%; } }
  .cursor-blink { display: inline; color: ${c.primary}; font-size: 14px; animation: blink 1s step-end infinite; }
  @keyframes blink { 0%,100% { opacity: 1; } 50% { opacity: 0; } }

  /* Document / PDF */
  .document-demo { height: 100%; display: flex; gap: 20px; }
  .doc-sidebar { width: 150px; display: flex; flex-direction: column; gap: 8px; }
  .doc-file { padding: 8px 12px; background: rgba(255,255,255,0.03); border-radius: 6px; font-size: 12px; color: #8888A0; border: 1px solid rgba(255,255,255,0.04); animation: slideRight 0.4s cubic-bezier(0.16,1,0.3,1) both; }
  @keyframes slideRight { from { opacity: 0; transform: translateX(-10px); } to { opacity: 1; transform: translateX(0); } }
  .doc-chat { flex: 1; display: flex; flex-direction: column; gap: 12px; }
  .doc-question { padding: 10px 14px; background: rgba(255,255,255,0.06); border-radius: 8px; font-size: 13px; color: #ECECEC; align-self: flex-end; max-width: 80%; border: 1px solid ${c.primary}33; animation: msgIn 0.4s cubic-bezier(0.16,1,0.3,1) both; }
  .doc-answer { padding: 10px 14px; background: rgba(255,255,255,0.03); border-radius: 8px; font-size: 12px; color: #8888A0; line-height: 1.5; max-width: 85%; border: 1px solid rgba(255,255,255,0.04); animation: msgIn 0.5s cubic-bezier(0.16,1,0.3,1) both; }
  @keyframes msgIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }

  /* Chat */
  .chat-demo { height: 100%; display: flex; flex-direction: column; gap: 10px; padding: 0 20px; }
  .chat-bubble { padding: 8px 14px; border-radius: 10px; font-size: 12px; max-width: 75%; line-height: 1.5; animation: bubbleIn 0.4s cubic-bezier(0.16,1,0.3,1) both; }
  .chat-bubble.user { background: ${c.primary}22; color: #ECECEC; align-self: flex-end; border: 1px solid ${c.primary}33; }
  .chat-bubble.bot { background: rgba(255,255,255,0.04); color: #8888A0; align-self: flex-start; border: 1px solid rgba(255,255,255,0.06); }
  @keyframes bubbleIn { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }

  /* Web UI */
  .web-demo { height: 100%; display: flex; flex-direction: column; gap: 10px; }
  .web-header { display: flex; gap: 12px; padding: 8px 0; }
  .web-nav-item { height: 6px; width: 50px; background: rgba(255,255,255,0.1); border-radius: 3px; }
  .web-nav-item.short { width: 30px; }
  .web-hero { height: 40px; background: rgba(255,255,255,0.03); border-radius: 8px; display: flex; align-items: center; padding: 0 16px; }
  .web-hero-text { height: 6px; width: 200px; background: rgba(255,255,255,0.08); border-radius: 3px; }
  .web-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; flex: 1; }
  .web-card { background: rgba(255,255,255,0.02); border-radius: 8px; padding: 10px; border: 1px solid rgba(255,255,255,0.03); animation: cardIn 0.5s cubic-bezier(0.16,1,0.3,1) both; display: flex; flex-direction: column; gap: 8px; }
  .web-card-img { height: 40px; background: rgba(255,255,255,0.04); border-radius: 4px; }
  .web-card-text { height: 5px; background: rgba(255,255,255,0.06); border-radius: 2px; width: 80%; }
  .web-card-text.short { width: 50%; }

  /* Code */
  .code-demo { height: 100%; }
  .code-editor { font-family: 'JetBrains Mono', monospace; font-size: 11px; color: #8888A0; line-height: 1.8; }
  .code-line { animation: codeIn 0.3s ease both; }
  .code-line.empty { height: 10px; }
  @keyframes codeIn { from { opacity: 0; } to { opacity: 1; } }
  .code-keyword { color: ${c.primary}; opacity: 0.8; }
  .code-func { color: #ECECEC; }
  .code-string { color: ${c.primary}; opacity: 0.6; }
</style>
</head>
<body>
  <div class="glow"></div>
  <div class="glow2"></div>
  <div class="container">
    <div class="header">
      <div class="icon">${project.icon}</div>
      <div class="title-group">
        <div class="title">${project.title}</div>
        <div class="subtitle">DEMONSTRATION</div>
      </div>
    </div>
    <div class="demo-area">
      ${anim}
    </div>
    <div class="features">
      ${project.features.map((f, i) => `<div class="feature" style="animation-delay:${(i+2)*0.15}s">${f}</div>`).join('\n      ')}
    </div>
  </div>
</body>
</html>`;
}

// ─── Main ────────────────────────────────────────────────────────────────────

async function main() {
  mkdirSync(PROJECTS_DIR, { recursive: true });
  mkdirSync(DEMOS_DIR, { recursive: true });

  // Step 1: Generate demo HTML files
  console.log('Generating demo HTML pages...');
  for (const project of PROJECTS) {
    const html = makeDemoHTML(project);
    const num = String(project.id).padStart(2, '0');
    const path = resolve(DEMOS_DIR, `project-${num}.html`);
    writeFileSync(path, html, 'utf-8');
    console.log(`  ✓ project-${num}.html (${project.title})`);
  }

  // Step 2: Start local HTTP server
  const PORT = 3456;
  const server = createServer((req, res) => {
    const url = new URL(req.url, `http://localhost:${PORT}`);
    let filePath;
    if (url.pathname.startsWith('/demos/')) {
      filePath = resolve(ROOT, url.pathname.slice(1));
    } else {
      res.writeHead(404);
      res.end('Not found');
      return;
    }
    try {
      const content = readFileSync(filePath);
      const ext = filePath.split('.').pop();
      const mime = { html: 'text/html', css: 'text/css', js: 'text/javascript', svg: 'image/svg+xml' }[ext] || 'text/plain';
      res.writeHead(200, { 'Content-Type': mime });
      res.end(content);
    } catch {
      res.writeHead(404);
      res.end('Not found');
    }
  });

  await new Promise(r => server.listen(PORT, r));
  console.log(`\nServer running at http://localhost:${PORT}`);

  // Step 3: Launch browser and record
  const browser = await chromium.launch({ headless: true });
  console.log('Browser launched\n');

  for (const project of PROJECTS) {
    const num = String(project.id).padStart(2, '0');
    const videoPath = resolve(PROJECTS_DIR, `project-${num}.webm`);
    const demoUrl = `http://localhost:${PORT}/demos/project-${num}.html`;

    console.log(`Recording project ${project.id}/12: ${project.title}...`);

    const context = await browser.newContext({
      viewport: { width: 800, height: 450 },
      recordVideo: { dir: PROJECTS_DIR, size: { width: 800, height: 450 } },
    });

    const page = await context.newPage();
    await page.goto(demoUrl, { waitUntil: 'networkidle' });

    // Let the full animation cycle play (animations are staggered over ~3.5s, so 8s gives 2 cycles)
    await page.waitForTimeout(8000);

    await context.close();

    // Playwright names the video with a UUID — rename it
    const { renameSync, readdirSync } = await import('fs');
    const files = readdirSync(PROJECTS_DIR).filter(f => f.endsWith('.webm') && !f.startsWith('project-'));
    const latestVideo = files.sort().pop();
    if (latestVideo) {
      const oldPath = resolve(PROJECTS_DIR, latestVideo);
      if (existsSync(oldPath)) {
        // Remove old file if exists
        if (existsSync(videoPath)) {
          const { unlinkSync } = await import('fs');
          unlinkSync(videoPath);
        }
        renameSync(oldPath, videoPath);
        console.log(`  ✓ project-${num}.webm saved`);
      }
    }
  }

  await browser.close();
  server.close();
  console.log('\n✅ All 12 demo videos recorded to public/projects/');
}

main().catch(err => { console.error(err); process.exit(1); });
