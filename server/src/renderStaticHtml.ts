import type { Project, SiteData, SocialLink } from '@siteforge/shared';

function escapeHtml(value: unknown) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function sortByOrder<T extends { displayOrder: number }>(items: T[]) {
  return [...items].sort((a, b) => a.displayOrder - b.displayOrder);
}

function socialLabel(link: SocialLink) {
  return escapeHtml(link.platform || link.icon || 'Link');
}

function projectCard(project: Project, primaryColor: string) {
  return `
    <article class="card project-card">
      <img src="${escapeHtml(project.coverImage)}" alt="${escapeHtml(project.title)}" />
      <div class="project-body">
        <span class="pill">${escapeHtml(project.category)}</span>
        <h3>${escapeHtml(project.title)}</h3>
        <p>${escapeHtml(project.description)}</p>
        ${project.role || project.tools ? `<div class="tags">${project.role ? `<span>${escapeHtml(project.role)}</span>` : ''}${project.tools ? `<span>${escapeHtml(project.tools)}</span>` : ''}</div>` : ''}
        ${project.projectUrl ? `<a class="link" href="${escapeHtml(project.projectUrl)}" style="color:${primaryColor}">View project</a>` : ''}
      </div>
    </article>`;
}

export function renderStaticHtml(data: SiteData, templateId: string) {
  if (templateId !== 'snowly') {
    throw new Error(`Unsupported template: ${templateId}`);
  }

  const primaryColor = data.config.primaryColor || '#3b0764';
  const projects = sortByOrder(data.projects);
  const skills = sortByOrder(data.skills);
  const experiences = sortByOrder(data.experiences);
  const socials = sortByOrder(data.socialLinks);
  const heroImage = projects[0]?.coverImage || data.user.avatarUrl || 'https://images.unsplash.com/photo-1612240498936-65f5101365d2?auto=format&fit=crop&w=1920&q=80';
  const title = data.config.seoTitle || `${data.user.displayName} - Personal Website`;
  const description = data.config.seoDescription || data.user.bio || 'Built with SiteForge';

  return `<!doctype html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${escapeHtml(title)}</title>
  <meta name="description" content="${escapeHtml(description)}" />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />
  <style>
    :root { --primary: ${primaryColor}; --dark: #16022b; --bg: #fafbfe; }
    * { box-sizing: border-box; }
    body { margin: 0; font-family: 'Plus Jakarta Sans', system-ui, sans-serif; background: var(--bg); color: #1e293b; }
    a { color: inherit; text-decoration: none; }
    .nav { position: sticky; top: 0; z-index: 10; background: rgba(255,255,255,.95); backdrop-filter: blur(14px); border-bottom: 1px solid #e2e8f0; }
    .nav-inner, .container { max-width: 1180px; margin: 0 auto; padding-left: 24px; padding-right: 24px; }
    .nav-inner { min-height: 72px; display: flex; align-items: center; justify-content: space-between; }
    .brand { display: flex; align-items: center; gap: 12px; font-size: 24px; font-weight: 800; color: #0f172a; }
    .mark { width: 42px; height: 42px; border-radius: 14px; display: grid; place-items: center; background: var(--primary); color: white; }
    .nav-links { display: flex; gap: 28px; font-size: 14px; font-weight: 700; color: #64748b; }
    .hero { min-height: 650px; position: relative; display: flex; align-items: center; overflow: hidden; background: #020617; }
    .hero img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; opacity: .68; }
    .hero::after { content: ""; position: absolute; inset: 0; background: linear-gradient(90deg, rgba(2,6,23,.95), rgba(2,6,23,.55), transparent); }
    .hero-card { position: relative; z-index: 1; max-width: 650px; margin: 80px 0; padding: 48px; color: white; background: color-mix(in srgb, var(--primary) 92%, transparent); border-radius: 28px; box-shadow: 0 28px 80px rgba(0,0,0,.35); }
    .hero-card h1 { margin: 16px 0; font-size: clamp(40px, 8vw, 68px); line-height: .98; letter-spacing: -.03em; }
    .hero-card p { color: rgba(255,255,255,.82); line-height: 1.75; }
    .button { display: inline-flex; margin-top: 20px; padding: 14px 20px; border-radius: 14px; background: white; color: var(--primary); font-weight: 800; }
    section { padding: 92px 0; }
    .eyebrow { display: inline-flex; margin-bottom: 18px; padding: 7px 12px; border-radius: 999px; background: #f1f5f9; color: var(--primary); font-size: 12px; font-weight: 800; text-transform: uppercase; letter-spacing: .08em; }
    h2 { margin: 0 0 36px; max-width: 760px; color: #0f172a; font-size: clamp(34px, 6vw, 54px); line-height: 1.02; letter-spacing: -.03em; }
    .about-grid { display: grid; grid-template-columns: minmax(0, .8fr) minmax(0, 1.2fr); gap: 52px; align-items: center; }
    .avatar { width: 100%; aspect-ratio: 1; object-fit: cover; border-radius: 28px; box-shadow: 0 24px 60px rgba(15,23,42,.16); }
    .lead { color: #475569; font-size: 18px; line-height: 1.8; }
    .stats { display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px; margin-top: 28px; }
    .stat, .card { background: white; border: 1px solid #e2e8f0; border-radius: 22px; box-shadow: 0 10px 30px rgba(15,23,42,.06); }
    .stat { padding: 24px; }
    .stat strong { display: block; color: var(--primary); font-size: 42px; }
    .work { background: white; border-top: 1px solid #e2e8f0; border-bottom: 1px solid #e2e8f0; }
    .project-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 24px; }
    .project-card { overflow: hidden; }
    .project-card img { width: 100%; height: 280px; object-fit: cover; display: block; }
    .project-body { padding: 24px; }
    .project-body h3 { margin: 14px 0 8px; color: #0f172a; font-size: 24px; }
    .project-body p { color: #64748b; line-height: 1.65; }
    .pill, .tags span { display: inline-flex; border-radius: 999px; background: #f1f5f9; padding: 6px 10px; font-size: 12px; font-weight: 800; color: #64748b; }
    .tags { display: flex; gap: 8px; flex-wrap: wrap; margin: 18px 0; }
    .link { font-weight: 800; }
    .skill-grid { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 16px; }
    .skill { padding: 22px; }
    .bar { height: 8px; border-radius: 999px; background: #e2e8f0; overflow: hidden; margin-top: 14px; }
    .bar span { display: block; height: 100%; background: var(--primary); }
    .timeline { display: grid; gap: 16px; }
    .experience { padding: 24px; }
    .lab { display: grid; grid-template-columns: 1fr 1fr; gap: 32px; align-items: start; }
    .compare, .estimator { padding: 24px; }
    .compare h2, .estimator h2 { font-size: 32px; margin-bottom: 22px; }
    .compare-frame { position: relative; height: 340px; overflow: hidden; border-radius: 22px; background: #020617; }
    .compare-frame img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; }
    .compare-frame .before { filter: grayscale(1); opacity: .8; }
    .after-wrap { position: absolute; inset: 0; width: 50%; overflow: hidden; }
    .after-wrap img { width: 200%; max-width: none; }
    .compare-bar { position: absolute; top: 0; bottom: 0; left: 50%; width: 4px; background: white; box-shadow: 0 0 18px rgba(0,0,0,.5); }
    .compare-frame input { position: absolute; inset: 0; opacity: 0; width: 100%; height: 100%; cursor: ew-resize; }
    .label { position: absolute; bottom: 16px; border-radius: 8px; padding: 6px 10px; color: white; font-size: 11px; font-weight: 900; text-transform: uppercase; }
    .before-label { left: 16px; background: #dc2626; }
    .after-label { right: 16px; background: #059669; }
    .estimator label { display: grid; gap: 8px; margin: 18px 0; color: #64748b; font-size: 12px; font-weight: 900; text-transform: uppercase; letter-spacing: .06em; }
    .estimator strong { color: #0f172a; font-size: 14px; text-transform: none; }
    .estimator .check { display: flex; align-items: center; justify-content: space-between; border: 1px solid #e2e8f0; border-radius: 16px; padding: 16px; }
    .estimate-card { margin-top: 18px; border-radius: 24px; padding: 32px; background: var(--primary); color: white; }
    .estimate-card span { display: block; color: rgba(255,255,255,.72); font-size: 12px; font-weight: 900; text-transform: uppercase; letter-spacing: .08em; }
    .estimate-card strong { display: block; margin: 10px 0; font-size: 54px; line-height: 1; }
    .contact { background: var(--primary); color: white; border-radius: 30px; padding: 52px; display: grid; grid-template-columns: 1fr 1fr; gap: 32px; }
    .contact h2 { color: white; margin-bottom: 18px; }
    .contact a, .contact .row { display: flex; align-items: center; gap: 10px; background: rgba(255,255,255,.12); border-radius: 16px; padding: 16px; font-weight: 800; }
    footer { padding: 32px; background: #020617; color: #94a3b8; text-align: center; font-size: 12px; }
    @media (max-width: 800px) {
      .nav-links { display: none; }
      .hero-card { padding: 32px; }
      .about-grid, .project-grid, .skill-grid, .contact, .lab { grid-template-columns: 1fr; }
    }
  </style>
  ${data.config.customCss ? `<style>${data.config.customCss}</style>` : ''}
</head>
<body>
  <nav class="nav">
    <div class="nav-inner">
      <a class="brand" href="#top"><span class="mark">${escapeHtml(data.user.displayName.slice(0, 1) || 'S')}</span>${escapeHtml(data.user.displayName || 'SiteForge')}</a>
      <div class="nav-links">
        <a href="#about">About</a><a href="#work">Work</a>${data.config.showSkills ? '<a href="#skills">Skills</a>' : ''}<a href="#contact">Contact</a>
      </div>
    </div>
  </nav>
  <header id="top" class="hero">
    <img src="${escapeHtml(heroImage)}" alt="" />
    <div class="container">
      <div class="hero-card">
        <span class="eyebrow">${escapeHtml(data.user.location || 'Personal Website')}</span>
        <h1>${escapeHtml(data.user.title || 'Build your personal digital presence')}</h1>
        <p>${escapeHtml(data.user.bio || 'Use SiteForge to turn your profile, work, and ideas into a polished personal website.')}</p>
        <a class="button" href="#work">Explore Work</a>
      </div>
    </div>
  </header>
  <section id="about">
    <div class="container about-grid">
      <img class="avatar" src="${escapeHtml(data.user.avatarUrl || 'https://i.pravatar.cc/300?img=11')}" alt="${escapeHtml(data.user.displayName)}" />
      <div>
        <span class="eyebrow">About</span>
        <h2>A focused space for your work, story, and capabilities.</h2>
        <p class="lead">${escapeHtml(data.user.fullBio || data.user.bio || '')}</p>
        <div class="stats">
          <div class="stat"><strong>${projects.length}+</strong><span>Projects</span></div>
          <div class="stat"><strong>${skills.length}+</strong><span>Skills</span></div>
        </div>
      </div>
    </div>
  </section>
  ${projects.length ? `<section id="work" class="work"><div class="container"><span class="eyebrow">Selected Work</span><h2>Recent projects with practical depth.</h2><div class="project-grid">${projects.map((project) => projectCard(project, primaryColor)).join('')}</div></div></section>` : ''}
  <section><div class="container"><div class="lab"><div class="card compare"><h2>Before / After Results</h2><div class="compare-frame"><img class="before" src="${escapeHtml(projects[1]?.coverImage || 'https://images.unsplash.com/photo-1518241353330-0f7941c2d9b5?auto=format&fit=crop&w=1000&q=80')}" alt="Before" /><div id="afterWrap" class="after-wrap"><img src="${escapeHtml(projects[0]?.coverImage || heroImage)}" alt="After" /></div><span class="label before-label">Before</span><span class="label after-label">After</span><div id="compareBar" class="compare-bar"></div><input id="compareInput" type="range" min="0" max="100" value="50" /></div></div><div><div class="card estimator"><span class="eyebrow">Smart Estimate</span><h2>Interactive pricing model</h2><label>Area size <strong id="sizeVal">500 sq ft</strong><input id="sizeInput" type="range" min="100" max="2500" step="50" value="500" /></label><label>Complexity depth <strong id="depthVal">4 points</strong><input id="depthInput" type="range" min="1" max="15" step="1" value="4" /></label><label class="check">Priority delivery <input id="priorityInput" type="checkbox" /></label></div><div class="estimate-card"><span>Estimated project range</span><strong id="priceVal">$120.00</strong><p>Use this Snowly-inspired interactive block as a configurable proof point, pricing estimator, or package selector.</p></div></div></div></div></section>
  ${data.config.showSkills && skills.length ? `<section id="skills"><div class="container"><span class="eyebrow">Skills</span><h2>Tools and strengths.</h2><div class="skill-grid">${skills.map((skill) => `<div class="card skill"><strong>${escapeHtml(skill.name)}</strong><p>${escapeHtml(skill.category || '')}</p><div class="bar"><span style="width:${skill.proficiency * 20}%"></span></div></div>`).join('')}</div></div></section>` : ''}
  ${data.config.showExperience && experiences.length ? `<section><div class="container"><h2>Experience</h2><div class="timeline">${experiences.map((experience) => `<article class="card experience"><strong>${escapeHtml(experience.position)}</strong><p>${escapeHtml(experience.company)} · ${escapeHtml(experience.startDate)} - ${escapeHtml(experience.isCurrent ? 'Now' : experience.endDate || '')}</p><p>${escapeHtml(experience.description || '')}</p></article>`).join('')}</div></div></section>` : ''}
  <section id="contact"><div class="container"><div class="contact"><div><span class="eyebrow">Contact</span><h2>Let's build the next version.</h2><p>${escapeHtml(description)}</p></div><div>${data.user.email ? `<a href="mailto:${escapeHtml(data.user.email)}">${escapeHtml(data.user.email)}</a>` : ''}${data.user.location ? `<div class="row">${escapeHtml(data.user.location)}</div>` : ''}${socials.map((social) => `<a href="${escapeHtml(social.url)}">${socialLabel(social)}</a>`).join('')}</div></div></div></section>
  <footer>Copyright 2026 - ${escapeHtml(data.user.displayName || 'SiteForge')}. Built with SiteForge.</footer>
  <script>
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
      anchor.addEventListener('click', (event) => {
        const target = document.querySelector(anchor.getAttribute('href'));
        if (target) {
          event.preventDefault();
          target.scrollIntoView({ behavior: 'smooth' });
        }
      });
    });
    const compareInput = document.getElementById('compareInput');
    const afterWrap = document.getElementById('afterWrap');
    const compareBar = document.getElementById('compareBar');
    compareInput?.addEventListener('input', (event) => {
      const value = event.target.value;
      afterWrap.style.width = value + '%';
      compareBar.style.left = value + '%';
    });
    const sizeInput = document.getElementById('sizeInput');
    const depthInput = document.getElementById('depthInput');
    const priorityInput = document.getElementById('priorityInput');
    const sizeVal = document.getElementById('sizeVal');
    const depthVal = document.getElementById('depthVal');
    const priceVal = document.getElementById('priceVal');
    function calculateEstimate() {
      const size = Number(sizeInput.value);
      const depth = Number(depthInput.value);
      const base = 50 + size * 0.12 + (depth <= 3 ? 0 : Math.ceil((depth - 3) / 3) * 15);
      const total = priorityInput.checked ? base * 1.45 : base;
      sizeVal.textContent = size + ' sq ft';
      depthVal.textContent = depth + ' points';
      priceVal.textContent = '$' + total.toFixed(2);
    }
    [sizeInput, depthInput, priorityInput].forEach((input) => input?.addEventListener('input', calculateEstimate));
    calculateEstimate();
  </script>
</body>
</html>`;
}
