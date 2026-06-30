以下是完整的个人网站数据结构定义，包含所有实体、字段说明、必填/可选标注及默认值。这些类型将作为前后端共享的 TypeScript 接口，存放在 `shared/types.ts` 中。

---

## 共享类型定义（`shared/types.ts`）

```typescript
// ============================================================
// 基础类型
// ============================================================

export type Theme = 'light' | 'dark' | 'minimal';
export type Layout = 'grid' | 'list' | 'masonry';
export type ExperienceType = 'work' | 'education';
export type ProjectStatus = 'draft' | 'published' | 'archived';
export type PostStatus = 'draft' | 'published';

// ============================================================
// 1. 用户信息 (User)
// ============================================================

export interface User {
  id?: number;                 // 可选，新建时自动生成
  email: string;               // 必填，登录邮箱，唯一
  username: string;            // 必填，用户名，唯一，用于URL
  displayName: string;         // 必填，显示名称（如“张逸晨”）
  avatarUrl?: string;          // 可选，头像URL，默认使用gravatar或占位图
  title?: string;              // 可选，头衔/职位（如“UI设计师”）
  bio?: string;                // 可选，一句话简介（用于Hero区）
  fullBio?: string;            // 可选，详细个人介绍（用于About页）
  location?: string;           // 可选，所在城市/地区
  createdAt?: string;          // ISO日期，自动生成
  updatedAt?: string;          // ISO日期，自动更新
}

// ============================================================
// 2. 作品 (Project) & 作品图片 (ProjectImage)
// ============================================================

export interface ProjectImage {
  id?: number;
  projectId?: number;          // 关联作品ID，新建时可省略
  imageUrl: string;            // 必填，图片URL
  caption?: string;            // 可选，图片说明
  displayOrder: number;        // 必填，展示顺序，默认0
  isCover: boolean;            // 必填，是否为封面图，默认false
}

export interface Project {
  id?: number;
  userId?: number;             // 关联用户ID，新建时可省略
  title: string;               // 必填，作品标题
  slug: string;                // 必填，URL友好标识（自动生成）
  category: string;            // 必填，分类（如“UI设计”“插画”），建议预设选项
  coverImage: string;          // 必填，封面图URL
  description: string;         // 必填，简短描述（展示在卡片）
  content: string;             // 必填，富文本详细内容（支持Markdown或HTML）
  role?: string;               // 可选，担任角色（如“主设计”“前端开发”）
  tools?: string;              // 可选，使用工具（如“Figma, Photoshop”）
  projectUrl?: string;         // 可选，项目在线链接
  githubUrl?: string;          // 可选，源码链接
  startDate?: string;          // 可选，开始日期（ISO日期）
  endDate?: string;            // 可选，结束日期（ISO日期）
  displayOrder: number;        // 必填，展示排序，默认0（数字小靠前）
  isFeatured: boolean;         // 必填，是否精选置顶，默认false
  viewCount: number;           // 必填，浏览次数，默认0
  status: ProjectStatus;       // 必填，状态，默认'draft'
  createdAt?: string;
  updatedAt?: string;
  publishedAt?: string;        // 可选，发布时间（status为published时必填）
  images?: ProjectImage[];     // 关联的图片列表（查询时附带）
}

// ============================================================
// 3. 职业经历 (Experience)
// ============================================================

export interface Experience {
  id?: number;
  userId?: number;
  type: ExperienceType;        // 必填，'work' 或 'education'
  company: string;             // 必填，公司/学校名称
  position: string;            // 必填，职位/专业
  description?: string;        // 可选，经历描述（建议使用AI润色）
  startDate: string;           // 必填，开始日期（ISO日期）
  endDate?: string;            // 可选，结束日期，若为null表示至今
  isCurrent: boolean;          // 必填，是否当前职位，默认false
  displayOrder: number;        // 必填，展示顺序，默认0
}

// ============================================================
// 4. 技能 (Skill)
// ============================================================

export interface Skill {
  id?: number;
  userId?: number;
  name: string;                // 必填，技能名称（如“Figma”）
  category?: string;           // 可选，分类（如“设计工具”“编程语言”）
  proficiency: 1 | 2 | 3 | 4 | 5; // 必填，熟练度（1-5星）
  displayOrder: number;        // 必填，展示顺序，默认0
}

// ============================================================
// 5. 社交链接 (SocialLink)
// ============================================================

export interface SocialLink {
  id?: number;
  userId?: number;
  platform: string;            // 必填，平台名称（如“GitHub”“站酷”），用于显示图标
  url: string;                 // 必填，完整链接地址
  icon?: string;               // 可选，图标标识（如Lucide图标名），若不填则根据platform自动映射
  displayOrder: number;        // 必填，展示顺序，默认0
}

// ============================================================
// 6. 博客文章 (BlogPost)
// ============================================================

export interface BlogPost {
  id?: number;
  userId?: number;
  title: string;               // 必填，文章标题
  slug: string;                // 必填，URL友好标识
  excerpt?: string;            // 可选，摘要（若未提供则截取content）
  content: string;             // 必填，富文本文章内容
  coverImage?: string;         // 可选，封面图URL
  tags: string[];              // 必填，标签数组，默认[]
  viewCount: number;           // 必填，阅读次数，默认0
  status: PostStatus;          // 必填，状态，默认'draft'
  createdAt?: string;
  updatedAt?: string;
  publishedAt?: string;        // 可选，发布时间（status为published时必填）
}

// ============================================================
// 7. 网站配置 (SiteConfig)
// ============================================================

export interface SiteConfig {
  userId?: number;             // 关联用户ID，与User一对一
  theme: Theme;                // 必填，主题，默认'light'
  primaryColor: string;        // 必填，主色调（HEX），默认'#3b0764'
  layout: Layout;              // 必填，布局，默认'grid'
  showBlog: boolean;           // 必填，是否显示博客板块，默认false
  showExperience: boolean;     // 必填，是否显示经历板块，默认true
  showSkills: boolean;         // 必填，是否显示技能板块，默认true
  customCss?: string;          // 可选，自定义CSS（进阶用户）
  seoTitle?: string;           // 可选，SEO标题，默认使用displayName + '的个人网站'
  seoDescription?: string;     // 可选，SEO描述
  domain?: string;             // 可选，自定义域名
  updatedAt?: string;
}

// ============================================================
// 8. 聚合数据 (SiteData) - 用于前端存储和预览渲染
// ============================================================

export interface SiteData {
  user: User;                  // 必填，用户信息
  projects: Project[];         // 作品列表（可空）
  experiences: Experience[];   // 经历列表（可空）
  skills: Skill[];             // 技能列表（可空）
  socialLinks: SocialLink[];   // 社交链接列表（可空）
  blogPosts: BlogPost[];       // 博客文章列表（可空）
  config: SiteConfig;          // 网站配置
}

// ============================================================
// 9. AI 对话相关类型
// ============================================================

// AI返回的指令（前端根据指令更新store）
export type AIAction =
  | { action: 'updateUser'; field: keyof User; value: any }
  | { action: 'addProject'; project: Partial<Project> }
  | { action: 'updateProject'; id: number; fields: Partial<Project> }
  | { action: 'deleteProject'; id: number }
  | { action: 'addExperience'; experience: Partial<Experience> }
  | { action: 'updateExperience'; id: number; fields: Partial<Experience> }
  | { action: 'deleteExperience'; id: number }
  | { action: 'addSkill'; skill: Partial<Skill> }
  | { action: 'updateSkill'; id: number; fields: Partial<Skill> }
  | { action: 'deleteSkill'; id: number }
  | { action: 'addSocialLink'; social: Partial<SocialLink> }
  | { action: 'updateSocialLink'; id: number; fields: Partial<SocialLink> }
  | { action: 'deleteSocialLink'; id: number }
  | { action: 'updateConfig'; fields: Partial<SiteConfig> };

// AI对话请求
export interface AIChatRequest {
  message: string;              // 用户消息
  currentData: SiteData;        // 当前站点数据（供AI参考）
}

// AI对话响应
export interface AIChatResponse {
  reply: string;                // AI的文本回复（展示给用户）
  actions: AIAction[];          // 要执行的数据变更指令
}

// ============================================================
// 10. 默认数据（用于新用户快速开始）
// ============================================================

export const defaultUser: User = {
  email: '',
  username: '',
  displayName: '你的名字',
  avatarUrl: 'https://i.pravatar.cc/300?img=11',
  title: '设计师 / 开发者',
  bio: '用创意和技术构建美好数字体验',
  fullBio: '我是一名热爱设计和开发的全栈创作者，致力于打造优雅、实用的数字产品。',
  location: '中国 · 杭州',
};

export const defaultConfig: SiteConfig = {
  theme: 'light',
  primaryColor: '#3b0764',
  layout: 'grid',
  showBlog: false,
  showExperience: true,
  showSkills: true,
  seoTitle: '',
  seoDescription: '',
};

export const defaultSiteData: SiteData = {
  user: defaultUser,
  projects: [],
  experiences: [],
  skills: [],
  socialLinks: [],
  blogPosts: [],
  config: defaultConfig,
};
```

---

## 使用说明

1. **必填/可选**：标注了 `?` 的字段在创建时可省略，后端会自动填充默认值或生成（如 `id`、`createdAt`）。前端表单中，必填字段应标星号提示用户。
2. **默认值**：在 `defaultSiteData` 中给出了示例，方便新用户快速体验。
3. **富文本**：`Project.content` 和 `BlogPost.content` 存储 Markdown 或 HTML 字符串，前端使用 Tiptap 或类似编辑器编辑。
4. **图片处理**：所有图片字段（`avatarUrl`、`coverImage`、`imageUrl`）均为 URL 字符串，由前端上传获取 URL 后存入。
5. **排序**：各列表（projects、experiences、skills、socialLinks）均包含 `displayOrder` 字段，用于前端拖拽排序。
6. **AI指令**：`AIAction` 类型用于前后端通信，后端解析用户意图后生成这些指令，前端执行更新。

这些数据结构覆盖了个人网站的核心模块，同时兼顾了扩展性和易用性。后续开发中，可根据实际需求微调字段。