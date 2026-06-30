import { ArrowRight, BriefcaseBusiness, Github, Linkedin, Mail, MapPin, Sparkles, Star, Wand2 } from 'lucide-react';
import type { CSSProperties } from 'react';
import { useState } from 'react';
import type { Project, SiteData, SocialLink } from '@siteforge/shared';

interface TemplateSnowlyProps {
  data: SiteData;
}

function textColor(primaryColor: string) {
  return { color: primaryColor };
}

function bgColor(primaryColor: string) {
  return { backgroundColor: primaryColor };
}

function iconForSocial(link: SocialLink) {
  const key = `${link.icon || link.platform}`.toLowerCase();
  if (key.includes('github')) return <Github className="h-4 w-4" />;
  if (key.includes('linkedin')) return <Linkedin className="h-4 w-4" />;
  if (key.includes('mail') || key.includes('email')) return <Mail className="h-4 w-4" />;
  return <ArrowRight className="h-4 w-4" />;
}

function ProjectCard({ project, featured, primaryColor }: { project: Project; featured?: boolean; primaryColor: string }) {
  return (
    <article className={`group overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl ${featured ? 'lg:col-span-2' : ''}`}>
      <div className="relative h-64 overflow-hidden bg-slate-200">
        <img src={project.coverImage} alt={project.title} className="h-full w-full object-cover transition duration-700 group-hover:scale-105" />
        <div className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-xs font-extrabold text-slate-700 backdrop-blur">
          {project.category}
        </div>
      </div>
      <div className="space-y-4 p-6">
        <div>
          <h3 className="text-xl font-black text-slate-950">{project.title}</h3>
          <p className="mt-2 text-sm leading-relaxed text-slate-500">{project.description}</p>
        </div>
        <div className="flex flex-wrap gap-2 text-xs font-bold text-slate-500">
          {project.role ? <span className="rounded-full bg-slate-100 px-3 py-1">{project.role}</span> : null}
          {project.tools ? <span className="rounded-full bg-slate-100 px-3 py-1">{project.tools}</span> : null}
        </div>
        {project.projectUrl ? (
          <a href={project.projectUrl} className="inline-flex items-center gap-2 text-sm font-extrabold" style={textColor(primaryColor)}>
            查看项目 <ArrowRight className="h-4 w-4" />
          </a>
        ) : null}
      </div>
    </article>
  );
}

export function TemplateSnowly({ data }: TemplateSnowlyProps) {
  const { user, config } = data;
  const primaryColor = config.primaryColor || '#3b0764';
  const visibleProjects = [...data.projects].sort((a, b) => a.displayOrder - b.displayOrder);
  const visibleExperiences = [...data.experiences].sort((a, b) => a.displayOrder - b.displayOrder);
  const visibleSkills = [...data.skills].sort((a, b) => a.displayOrder - b.displayOrder);
  const visibleSocials = [...data.socialLinks].sort((a, b) => a.displayOrder - b.displayOrder);
  const heroProject = visibleProjects[0];
  const [comparison, setComparison] = useState(50);
  const [areaSize, setAreaSize] = useState(500);
  const [depth, setDepth] = useState(4);
  const [priority, setPriority] = useState(false);
  const estimate = 50 + areaSize * 0.12 + (depth <= 3 ? 0 : Math.ceil((depth - 3) / 3) * 15);
  const totalEstimate = priority ? estimate * 1.45 : estimate;

  return (
    <div className="min-h-screen bg-[#fafbfe] font-sans text-slate-800">
      <nav className="sticky top-0 z-40 border-b border-slate-100/80 bg-white/95 shadow-sm backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 md:px-8">
          <a href="#hero-section" className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl text-xl font-black text-white shadow-md" style={bgColor(primaryColor)}>
              {user.displayName.slice(0, 1) || 'S'}
            </div>
            <span className="text-2xl font-extrabold tracking-tight text-slate-950">{user.displayName || 'SiteForge'}</span>
          </a>
          <div className="hidden items-center gap-8 text-sm font-semibold text-slate-500 md:flex">
            <a href="#about" className="hover:text-slate-950">About</a>
            <a href="#work" className="hover:text-slate-950">Work</a>
            {config.showSkills ? <a href="#skills" className="hover:text-slate-950">Skills</a> : null}
            <a href="#contact" className="hover:text-slate-950">Contact</a>
          </div>
          <div className="hidden items-center gap-2 lg:flex">
            {visibleSocials.slice(0, 3).map((link) => (
              <a key={link.id || link.url} href={link.url} className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-50 text-slate-500 transition hover:text-white" style={{ '--hover-color': primaryColor } as CSSProperties} onMouseEnter={(event) => (event.currentTarget.style.backgroundColor = primaryColor)} onMouseLeave={(event) => (event.currentTarget.style.backgroundColor = '#f8fafc')}>
                {iconForSocial(link)}
              </a>
            ))}
          </div>
        </div>
      </nav>

      <section id="hero-section" className="relative flex min-h-[650px] items-center overflow-hidden bg-slate-950">
        <div className="absolute inset-0">
          <img src={heroProject?.coverImage || user.avatarUrl || 'https://images.unsplash.com/photo-1612240498936-65f5101365d2?auto=format&fit=crop&w=1920&q=80'} alt="" className="h-full w-full object-cover opacity-70" />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/60 to-transparent" />
        </div>
        <div className="relative z-10 mx-auto w-full max-w-7xl px-4 py-20 md:px-8">
          <div className="max-w-2xl rounded-3xl p-8 text-white shadow-2xl backdrop-blur-sm md:p-12" style={{ backgroundColor: `${primaryColor}f2` }}>
            <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-xs font-bold">
              <Star className="h-4 w-4 fill-amber-300 text-amber-300" />
              {user.location || 'Personal Website'} · Live Preview
            </div>
            <h1 className="mb-5 text-4xl font-black leading-tight tracking-tight md:text-6xl">{user.title || 'Build your personal digital presence'}</h1>
            <p className="mb-8 text-base leading-relaxed text-white/85 md:text-lg">{user.bio || 'Use SiteForge to turn your profile, work, and ideas into a polished personal website.'}</p>
            <div className="flex flex-col gap-4 sm:flex-row">
              <a href="#work" className="rounded-xl bg-white px-6 py-3.5 text-center text-sm font-extrabold shadow-lg transition hover:scale-105" style={textColor(primaryColor)}>
                Explore Work
              </a>
              <a href="#contact" className="rounded-xl border border-white/20 bg-black/20 px-6 py-3.5 text-center text-sm font-extrabold text-white transition hover:scale-105">
                Contact Me
              </a>
            </div>
          </div>
        </div>
      </section>

      <section id="about" className="mx-auto max-w-7xl px-4 py-20 md:px-8 md:py-28">
        <div className="mb-12 flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div className="max-w-2xl">
            <span className="mb-4 inline-flex items-center gap-2 rounded-full bg-purple-100 px-3 py-1 text-xs font-extrabold uppercase tracking-wider" style={textColor(primaryColor)}>
              <Sparkles className="h-4 w-4" /> About
            </span>
            <h2 className="text-3xl font-black leading-tight text-slate-950 md:text-5xl">A focused space for your work, story, and capabilities.</h2>
          </div>
        </div>
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:items-center">
          <div className="lg:col-span-5">
            <img src={user.avatarUrl || 'https://i.pravatar.cc/300?img=11'} alt={user.displayName} className="aspect-square w-full rounded-3xl object-cover shadow-xl" />
          </div>
          <div className="space-y-6 lg:col-span-7">
            <p className="text-lg leading-8 text-slate-600">{user.fullBio || user.bio}</p>
            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
                <p className="text-4xl font-black" style={textColor(primaryColor)}>{visibleProjects.length}+</p>
                <p className="mt-1 text-xs font-bold uppercase tracking-wider text-slate-500">Projects</p>
              </div>
              <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
                <p className="text-4xl font-black" style={textColor(primaryColor)}>{visibleSkills.length}+</p>
                <p className="mt-1 text-xs font-bold uppercase tracking-wider text-slate-500">Skills</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {visibleProjects.length > 0 ? (
        <section id="work" className="border-y border-slate-200/70 bg-white px-4 py-20 md:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="mb-12 max-w-2xl">
              <span className="mb-4 inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 text-xs font-extrabold uppercase tracking-wider" style={textColor(primaryColor)}>
                <BriefcaseBusiness className="h-4 w-4" /> Selected Work
              </span>
              <h2 className="text-3xl font-black text-slate-950 md:text-5xl">Recent projects with practical depth.</h2>
            </div>
            <div className={`grid gap-6 ${config.layout === 'list' ? 'grid-cols-1' : 'grid-cols-1 lg:grid-cols-2'}`}>
              {visibleProjects.map((project, index) => (
                <ProjectCard key={project.id || project.slug} project={project} featured={index === 0 && config.layout !== 'list'} primaryColor={primaryColor} />
              ))}
            </div>
          </div>
        </section>
      ) : null}

      <section className="bg-gradient-to-b from-slate-100 to-white px-4 py-20 md:px-8">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 lg:grid-cols-12 lg:items-center">
          <div className="lg:col-span-6">
            <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-xl">
              <div className="mb-4 flex items-center justify-between gap-3">
                <h2 className="m-0 text-2xl font-black text-slate-950 md:text-3xl">Before / After Results</h2>
                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-500">Slide to inspect</span>
              </div>
              <div className="relative h-[340px] overflow-hidden rounded-2xl bg-slate-900">
                <img src={visibleProjects[1]?.coverImage || 'https://images.unsplash.com/photo-1518241353330-0f7941c2d9b5?auto=format&fit=crop&w=1000&q=80'} alt="Before result" className="absolute inset-0 h-full w-full object-cover opacity-80 grayscale" />
                <div className="absolute inset-0 overflow-hidden" style={{ clipPath: `inset(0 ${100 - comparison}% 0 0)` }}>
                  <img src={heroProject?.coverImage || 'https://images.unsplash.com/photo-1482862549707-f63cb32c5fd9?auto=format&fit=crop&w=1000&q=80'} alt="After result" className="h-full w-full object-cover" />
                </div>
                <div className="absolute bottom-4 left-4 rounded-md bg-red-600 px-3 py-1 text-[10px] font-black uppercase tracking-wider text-white">Before</div>
                <div className="absolute bottom-4 right-4 rounded-md bg-emerald-600 px-3 py-1 text-[10px] font-black uppercase tracking-wider text-white">After</div>
                <div className="absolute top-0 h-full w-1 bg-white shadow-xl" style={{ left: `${comparison}%` }} />
                <input aria-label="Before after comparison" type="range" min="0" max="100" value={comparison} onChange={(event) => setComparison(Number(event.target.value))} className="absolute inset-0 h-full w-full cursor-ew-resize opacity-0" />
              </div>
            </div>
          </div>
          <div className="space-y-6 lg:col-span-6">
            <div className="rounded-3xl border border-slate-100 bg-white p-8 shadow-xl">
              <span className="mb-4 inline-flex rounded-full bg-purple-100 px-3 py-1 text-xs font-extrabold uppercase tracking-wider" style={textColor(primaryColor)}>Smart Estimate</span>
              <h2 className="m-0 text-2xl font-black text-slate-950 md:text-3xl">Interactive pricing model</h2>
              <div className="mt-8 space-y-6">
                <label className="grid gap-2 text-xs font-extrabold uppercase tracking-wider text-slate-500">
                  Area size <span className="text-sm normal-case text-slate-950">{areaSize} sq ft</span>
                  <input type="range" min="100" max="2500" step="50" value={areaSize} onChange={(event) => setAreaSize(Number(event.target.value))} />
                </label>
                <label className="grid gap-2 text-xs font-extrabold uppercase tracking-wider text-slate-500">
                  Complexity depth <span className="text-sm normal-case text-slate-950">{depth} points</span>
                  <input type="range" min="1" max="15" step="1" value={depth} onChange={(event) => setDepth(Number(event.target.value))} />
                </label>
                <label className="flex items-center justify-between rounded-2xl border border-slate-200 p-4 text-sm font-bold text-slate-700">
                  Priority delivery <input type="checkbox" checked={priority} onChange={(event) => setPriority(event.target.checked)} />
                </label>
              </div>
            </div>
            <div className="rounded-3xl p-8 text-white shadow-xl" style={bgColor(primaryColor)}>
              <p className="text-xs font-extrabold uppercase tracking-wider text-white/70">Estimated project range</p>
              <p className="mt-2 text-5xl font-black">${totalEstimate.toFixed(2)}</p>
              <p className="mt-4 text-sm leading-7 text-white/75">Use this Snowly-inspired interactive block as a configurable proof point, pricing estimator, or package selector inside the generated personal site.</p>
            </div>
          </div>
        </div>
      </section>

      {config.showSkills && visibleSkills.length > 0 ? (
        <section id="skills" className="mx-auto max-w-7xl px-4 py-20 md:px-8">
          <div className="mb-10 max-w-2xl">
            <span className="mb-4 inline-flex items-center gap-2 rounded-full bg-purple-100 px-3 py-1 text-xs font-extrabold uppercase tracking-wider" style={textColor(primaryColor)}>
              <Wand2 className="h-4 w-4" /> Skills
            </span>
            <h2 className="text-3xl font-black text-slate-950 md:text-5xl">Tools and strengths.</h2>
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {visibleSkills.map((skill) => (
              <div key={skill.id || skill.name} className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
                <div className="mb-3 flex items-center justify-between">
                  <h3 className="font-extrabold text-slate-950">{skill.name}</h3>
                  <span className="text-xs font-bold text-slate-400">{skill.category}</span>
                </div>
                <div className="h-2 rounded-full bg-slate-100">
                  <div className="h-2 rounded-full" style={{ ...bgColor(primaryColor), width: `${skill.proficiency * 20}%` }} />
                </div>
              </div>
            ))}
          </div>
        </section>
      ) : null}

      {config.showExperience && visibleExperiences.length > 0 ? (
        <section className="bg-slate-50 px-4 py-20 md:px-8">
          <div className="mx-auto max-w-7xl">
            <h2 className="mb-10 text-3xl font-black text-slate-950 md:text-5xl">Experience</h2>
            <div className="grid gap-4">
              {visibleExperiences.map((experience) => (
                <div key={experience.id || `${experience.company}-${experience.startDate}`} className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
                  <div className="flex flex-col justify-between gap-3 md:flex-row md:items-start">
                    <div>
                      <p className="text-xs font-extrabold uppercase tracking-wider" style={textColor(primaryColor)}>{experience.type}</p>
                      <h3 className="mt-1 text-xl font-black text-slate-950">{experience.position}</h3>
                      <p className="text-sm font-bold text-slate-500">{experience.company}</p>
                    </div>
                    <p className="text-sm font-bold text-slate-400">{experience.startDate} - {experience.isCurrent ? 'Now' : experience.endDate}</p>
                  </div>
                  {experience.description ? <p className="mt-4 text-sm leading-6 text-slate-600">{experience.description}</p> : null}
                </div>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      <section id="contact" className="px-4 py-20 md:px-8">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 rounded-3xl p-8 text-white shadow-xl md:p-12 lg:grid-cols-12" style={bgColor(primaryColor)}>
          <div className="space-y-4 lg:col-span-6">
            <span className="text-xs font-extrabold uppercase tracking-wider text-white/70">Contact</span>
            <h2 className="text-3xl font-black md:text-5xl">Let's build the next version.</h2>
            <p className="max-w-md text-sm leading-7 text-white/75">Reach out through your preferred channel, or use this section as a clean contact block in the exported site.</p>
          </div>
          <div className="space-y-4 lg:col-span-6">
            {user.email ? <a className="flex items-center gap-3 rounded-2xl bg-white/10 p-4 font-bold" href={`mailto:${user.email}`}><Mail className="h-5 w-5" />{user.email}</a> : null}
            {user.location ? <div className="flex items-center gap-3 rounded-2xl bg-white/10 p-4 font-bold"><MapPin className="h-5 w-5" />{user.location}</div> : null}
            <div className="flex flex-wrap gap-3">
              {visibleSocials.map((link) => (
                <a key={link.id || link.url} href={link.url} className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-3 text-sm font-extrabold" style={textColor(primaryColor)}>
                  {iconForSocial(link)} {link.platform}
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t border-slate-200 bg-slate-950 px-4 py-8 text-center text-xs text-slate-400 md:px-8">
        <p>Copyright 2026 - {user.displayName || 'SiteForge'}. Built with SiteForge.</p>
      </footer>
    </div>
  );
}
