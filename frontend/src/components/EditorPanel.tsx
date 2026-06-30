import { Download, Plus, RotateCcw, Save, Trash2 } from 'lucide-react';
import type { ReactNode } from 'react';
import type { Experience, Project, ProjectImage, Skill, SocialLink, VideoItem } from '@siteforge/shared';
import { useSiteStore } from '../store/siteStore';
import { exportSiteHtml } from '../utils/exportHtml';

function nextId(items: Array<{ id?: number }>) {
  return Math.max(0, ...items.map((item) => item.id || 0)) + 1;
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '') || 'untitled';
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="grid gap-1.5 text-xs font-bold uppercase tracking-wide text-slate-500">
      <span>{label}</span>
      {children}
    </label>
  );
}

const inputClass = 'w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm font-medium text-slate-800 outline-none transition focus:border-purple-700 focus:ring-4 focus:ring-purple-100';

export function EditorPanel() {
  const { data, templateId, updateUser, updateConfig, upsertProject, removeProject, upsertExperience, removeExperience, upsertSkill, removeSkill, upsertSocialLink, removeSocialLink, upsertVideo, removeVideo, reset } = useSiteStore();

  async function saveToServer() {
    const response = await fetch('/api/site/local', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      throw new Error('保存失败，请确认后端服务正在运行。');
    }
  }

  function addProject() {
    const id = nextId(data.projects);
    const project: Project = {
      id,
      title: `新项目 ${id}`,
      slug: `project-${id}`,
      category: 'Portfolio',
      coverImage: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80',
      description: '描述这个项目的目标、过程和成果。',
      content: '',
      role: 'Designer / Developer',
      tools: 'Figma, React',
      displayOrder: data.projects.length,
      isFeatured: false,
      viewCount: 0,
      status: 'published'
    };
    upsertProject(project);
  }

  function addProjectImage(project: Project) {
    const images = project.images ?? [];
    const id = nextId(images);
    const image: ProjectImage = {
      id,
      imageUrl: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&w=900&q=80',
      caption: `Gallery image ${id}`,
      displayOrder: images.length,
      isCover: false
    };
    upsertProject({ ...project, images: [...images, image] });
  }

  function updateProjectImage(project: Project, image: ProjectImage) {
    upsertProject({
      ...project,
      images: (project.images ?? []).map((item) => (item.id === image.id ? image : item))
    });
  }

  function removeProjectImage(project: Project, imageId?: number) {
    upsertProject({
      ...project,
      images: (project.images ?? []).filter((image) => image.id !== imageId)
    });
  }

  function addExperience() {
    const id = nextId(data.experiences);
    const experience: Experience = {
      id,
      type: 'work',
      company: '新机构',
      position: '职位名称',
      description: '描述你的职责、贡献和结果。',
      startDate: '2024-01',
      isCurrent: true,
      displayOrder: data.experiences.length
    };
    upsertExperience(experience);
  }

  function addSkill() {
    const id = nextId(data.skills);
    const skill: Skill = {
      id,
      name: 'New Skill',
      category: 'General',
      proficiency: 4,
      displayOrder: data.skills.length
    };
    upsertSkill(skill);
  }

  function addSocial() {
    const id = nextId(data.socialLinks);
    const social: SocialLink = {
      id,
      platform: 'GitHub',
      url: 'https://github.com',
      icon: 'github',
      displayOrder: data.socialLinks.length
    };
    upsertSocialLink(social);
  }

  function addVideo() {
    const id = nextId(data.videos);
    const video: VideoItem = {
      id,
      title: `视频 ${id}`,
      platform: 'youtube',
      videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      thumbnailUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=900&q=80',
      description: '补充视频简介、幕后过程或项目演示。',
      displayOrder: data.videos.length,
      isFeatured: false
    };
    upsertVideo(video);
  }

  return (
    <aside className="flex h-full min-h-0 flex-col border-r border-slate-200 bg-white">
      <div className="border-b border-slate-200 p-5">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h1 className="text-xl font-black text-slate-950">SiteForge</h1>
            <p className="mt-1 text-xs font-medium text-slate-500">Snowly 模板工作台</p>
          </div>
          <button className="rounded-lg border border-slate-200 p-2 text-slate-500 transition hover:bg-slate-50" onClick={reset} title="重置默认数据">
            <RotateCcw className="h-4 w-4" />
          </button>
        </div>
        <div className="mt-4 grid grid-cols-2 gap-2">
          <button className="inline-flex items-center justify-center gap-2 rounded-lg bg-slate-950 px-3 py-2.5 text-xs font-extrabold text-white transition hover:bg-slate-800" onClick={() => saveToServer().catch((error) => alert(error.message))}>
            <Save className="h-4 w-4" /> 保存
          </button>
          <button className="inline-flex items-center justify-center gap-2 rounded-lg px-3 py-2.5 text-xs font-extrabold text-white transition hover:opacity-90" style={{ backgroundColor: data.config.primaryColor }} onClick={() => exportSiteHtml(data, templateId).catch((error) => alert(error.message))}>
            <Download className="h-4 w-4" /> 导出
          </button>
        </div>
      </div>

      <div className="sf-scrollbar min-h-0 flex-1 space-y-6 overflow-y-auto p-5">
        <section className="space-y-3">
          <h2 className="text-sm font-black text-slate-950">个人信息</h2>
          <Field label="显示名称"><input className={inputClass} value={data.user.displayName} onChange={(event) => updateUser({ displayName: event.target.value })} /></Field>
          <Field label="用户名"><input className={inputClass} value={data.user.username} onChange={(event) => updateUser({ username: event.target.value })} /></Field>
          <Field label="邮箱"><input className={inputClass} type="email" value={data.user.email} onChange={(event) => updateUser({ email: event.target.value })} /></Field>
          <Field label="头像 URL"><input className={inputClass} value={data.user.avatarUrl || ''} onChange={(event) => updateUser({ avatarUrl: event.target.value })} /></Field>
          <Field label="头衔"><input className={inputClass} value={data.user.title || ''} onChange={(event) => updateUser({ title: event.target.value })} /></Field>
          <Field label="一句话简介"><textarea className={inputClass} rows={3} value={data.user.bio || ''} onChange={(event) => updateUser({ bio: event.target.value })} /></Field>
          <Field label="详细介绍"><textarea className={inputClass} rows={4} value={data.user.fullBio || ''} onChange={(event) => updateUser({ fullBio: event.target.value })} /></Field>
          <Field label="位置"><input className={inputClass} value={data.user.location || ''} onChange={(event) => updateUser({ location: event.target.value })} /></Field>
        </section>

        <section className="space-y-3">
          <h2 className="text-sm font-black text-slate-950">网站配置</h2>
          <Field label="主色"><input className={`${inputClass} h-12`} type="color" value={data.config.primaryColor} onChange={(event) => updateConfig({ primaryColor: event.target.value })} /></Field>
          <Field label="布局">
            <select className={inputClass} value={data.config.layout} onChange={(event) => updateConfig({ layout: event.target.value as typeof data.config.layout })}>
              <option value="grid">Grid</option>
              <option value="list">List</option>
              <option value="masonry">Masonry</option>
            </select>
          </Field>
          <label className="flex items-center justify-between rounded-lg border border-slate-200 p-3 text-sm font-bold text-slate-700">
            显示经历 <input type="checkbox" checked={data.config.showExperience} onChange={(event) => updateConfig({ showExperience: event.target.checked })} />
          </label>
          <label className="flex items-center justify-between rounded-lg border border-slate-200 p-3 text-sm font-bold text-slate-700">
            显示技能 <input type="checkbox" checked={data.config.showSkills} onChange={(event) => updateConfig({ showSkills: event.target.checked })} />
          </label>
          <label className="flex items-center justify-between rounded-lg border border-slate-200 p-3 text-sm font-bold text-slate-700">
            显示视频 <input type="checkbox" checked={data.config.showVideos} onChange={(event) => updateConfig({ showVideos: event.target.checked })} />
          </label>
          <label className="flex items-center justify-between rounded-lg border border-slate-200 p-3 text-sm font-bold text-slate-700">
            显示博客 <input type="checkbox" checked={data.config.showBlog} onChange={(event) => updateConfig({ showBlog: event.target.checked })} />
          </label>
        </section>

        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-black text-slate-950">作品</h2>
            <button className="rounded-lg bg-slate-100 p-2 text-slate-600 hover:bg-slate-200" onClick={addProject}><Plus className="h-4 w-4" /></button>
          </div>
          {data.projects.map((project) => (
            <div key={project.id || project.slug} className="space-y-3 rounded-xl border border-slate-200 bg-slate-50 p-3">
              <div className="flex justify-between gap-2">
                <input className={inputClass} value={project.title} onChange={(event) => upsertProject({ ...project, title: event.target.value, slug: slugify(event.target.value) })} />
                <button className="rounded-lg p-2 text-red-500 hover:bg-red-50" onClick={() => project.id && removeProject(project.id)}><Trash2 className="h-4 w-4" /></button>
              </div>
              <input className={inputClass} value={project.category} onChange={(event) => upsertProject({ ...project, category: event.target.value })} />
              <input className={inputClass} value={project.coverImage} onChange={(event) => upsertProject({ ...project, coverImage: event.target.value })} />
              <input className={inputClass} placeholder="角色" value={project.role || ''} onChange={(event) => upsertProject({ ...project, role: event.target.value })} />
              <input className={inputClass} placeholder="工具，例如 Figma, React" value={project.tools || ''} onChange={(event) => upsertProject({ ...project, tools: event.target.value })} />
              <textarea className={inputClass} rows={2} value={project.description} onChange={(event) => upsertProject({ ...project, description: event.target.value })} />
              <input className={inputClass} placeholder="项目链接" value={project.projectUrl || ''} onChange={(event) => upsertProject({ ...project, projectUrl: event.target.value })} />
              <input className={inputClass} placeholder="源码链接" value={project.githubUrl || ''} onChange={(event) => upsertProject({ ...project, githubUrl: event.target.value })} />
              <div className="grid grid-cols-2 gap-2">
                <input className={inputClass} placeholder="开始日期" value={project.startDate || ''} onChange={(event) => upsertProject({ ...project, startDate: event.target.value })} />
                <input className={inputClass} placeholder="结束日期" value={project.endDate || ''} onChange={(event) => upsertProject({ ...project, endDate: event.target.value })} />
              </div>
              <textarea className={inputClass} rows={3} placeholder="项目详细内容" value={project.content} onChange={(event) => upsertProject({ ...project, content: event.target.value })} />
              <div className="grid grid-cols-2 gap-2">
                <select className={inputClass} value={project.status} onChange={(event) => upsertProject({ ...project, status: event.target.value as Project['status'] })}>
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                  <option value="archived">Archived</option>
                </select>
                <label className="flex items-center justify-between rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-xs font-bold text-slate-600">
                  精选 <input type="checkbox" checked={project.isFeatured} onChange={(event) => upsertProject({ ...project, isFeatured: event.target.checked })} />
                </label>
              </div>
              <div className="space-y-2 rounded-lg border border-slate-200 bg-white p-3">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-black uppercase tracking-wide text-slate-500">项目图库</p>
                  <button className="rounded-md bg-slate-100 p-1.5 text-slate-600 hover:bg-slate-200" onClick={() => addProjectImage(project)}><Plus className="h-3.5 w-3.5" /></button>
                </div>
                {(project.images ?? []).map((image) => (
                  <div key={image.id || image.imageUrl} className="grid gap-2 rounded-md bg-slate-50 p-2">
                    <div className="flex gap-2">
                      <input className={inputClass} placeholder="图片 URL" value={image.imageUrl} onChange={(event) => updateProjectImage(project, { ...image, imageUrl: event.target.value })} />
                      <button className="rounded-lg p-2 text-red-500 hover:bg-red-50" onClick={() => removeProjectImage(project, image.id)}><Trash2 className="h-4 w-4" /></button>
                    </div>
                    <input className={inputClass} placeholder="图片说明" value={image.caption || ''} onChange={(event) => updateProjectImage(project, { ...image, caption: event.target.value })} />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </section>

        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-black text-slate-950">视频</h2>
            <button className="rounded-lg bg-slate-100 p-2 text-slate-600 hover:bg-slate-200" onClick={addVideo}><Plus className="h-4 w-4" /></button>
          </div>
          {data.videos.map((video) => (
            <div key={video.id || video.videoUrl} className="space-y-3 rounded-xl border border-slate-200 bg-slate-50 p-3">
              <div className="flex justify-between gap-2">
                <input className={inputClass} value={video.title} onChange={(event) => upsertVideo({ ...video, title: event.target.value })} />
                <button className="rounded-lg p-2 text-red-500 hover:bg-red-50" onClick={() => video.id && removeVideo(video.id)}><Trash2 className="h-4 w-4" /></button>
              </div>
              <select className={inputClass} value={video.platform} onChange={(event) => upsertVideo({ ...video, platform: event.target.value as VideoItem['platform'] })}>
                <option value="youtube">YouTube</option>
                <option value="vimeo">Vimeo</option>
                <option value="bilibili">Bilibili</option>
                <option value="custom">Custom</option>
              </select>
              <input className={inputClass} placeholder="视频 URL" value={video.videoUrl} onChange={(event) => upsertVideo({ ...video, videoUrl: event.target.value })} />
              <input className={inputClass} placeholder="缩略图 URL" value={video.thumbnailUrl || ''} onChange={(event) => upsertVideo({ ...video, thumbnailUrl: event.target.value })} />
              <textarea className={inputClass} rows={2} placeholder="视频描述" value={video.description || ''} onChange={(event) => upsertVideo({ ...video, description: event.target.value })} />
              <label className="flex items-center justify-between rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-xs font-bold text-slate-600">
                精选视频 <input type="checkbox" checked={video.isFeatured} onChange={(event) => upsertVideo({ ...video, isFeatured: event.target.checked })} />
              </label>
            </div>
          ))}
        </section>

        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-black text-slate-950">经历</h2>
            <button className="rounded-lg bg-slate-100 p-2 text-slate-600 hover:bg-slate-200" onClick={addExperience}><Plus className="h-4 w-4" /></button>
          </div>
          {data.experiences.map((experience) => (
            <div key={experience.id || experience.company} className="space-y-3 rounded-xl border border-slate-200 bg-slate-50 p-3">
              <div className="flex justify-between gap-2">
                <input className={inputClass} value={experience.position} onChange={(event) => upsertExperience({ ...experience, position: event.target.value })} />
                <button className="rounded-lg p-2 text-red-500 hover:bg-red-50" onClick={() => experience.id && removeExperience(experience.id)}><Trash2 className="h-4 w-4" /></button>
              </div>
              <input className={inputClass} value={experience.company} onChange={(event) => upsertExperience({ ...experience, company: event.target.value })} />
              <textarea className={inputClass} rows={2} value={experience.description || ''} onChange={(event) => upsertExperience({ ...experience, description: event.target.value })} />
            </div>
          ))}
        </section>

        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-black text-slate-950">技能</h2>
            <button className="rounded-lg bg-slate-100 p-2 text-slate-600 hover:bg-slate-200" onClick={addSkill}><Plus className="h-4 w-4" /></button>
          </div>
          {data.skills.map((skill) => (
            <div key={skill.id || skill.name} className="grid grid-cols-[1fr_74px_36px] gap-2 rounded-xl border border-slate-200 bg-slate-50 p-3">
              <input className={inputClass} value={skill.name} onChange={(event) => upsertSkill({ ...skill, name: event.target.value })} />
              <input className={inputClass} type="number" min={1} max={5} value={skill.proficiency} onChange={(event) => upsertSkill({ ...skill, proficiency: Number(event.target.value) as Skill['proficiency'] })} />
              <button className="rounded-lg p-2 text-red-500 hover:bg-red-50" onClick={() => skill.id && removeSkill(skill.id)}><Trash2 className="h-4 w-4" /></button>
            </div>
          ))}
        </section>

        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-black text-slate-950">社交链接</h2>
            <button className="rounded-lg bg-slate-100 p-2 text-slate-600 hover:bg-slate-200" onClick={addSocial}><Plus className="h-4 w-4" /></button>
          </div>
          {data.socialLinks.map((social) => (
            <div key={social.id || social.url} className="space-y-2 rounded-xl border border-slate-200 bg-slate-50 p-3">
              <div className="flex justify-between gap-2">
                <input className={inputClass} value={social.platform} onChange={(event) => upsertSocialLink({ ...social, platform: event.target.value })} />
                <button className="rounded-lg p-2 text-red-500 hover:bg-red-50" onClick={() => social.id && removeSocialLink(social.id)}><Trash2 className="h-4 w-4" /></button>
              </div>
              <input className={inputClass} value={social.url} onChange={(event) => upsertSocialLink({ ...social, url: event.target.value })} />
            </div>
          ))}
        </section>
      </div>
    </aside>
  );
}
