# 个人网站生成器（SiteForge）开发计划

## 一、项目概述

**目标**：开发一个面向非设计专业/初级设计人士的“一键生成个人网站”工具。用户通过AI对话引导 + 手动配置，快速生成并导出专业个人展示网站。

**核心用户**：设计师、开发者、创意工作者、学生等。

**技术栈**：
- 前端：React 18 + TypeScript + Tailwind CSS + Zustand + Vite
- 后端：Node.js + Express + TypeScript + Prisma + PostgreSQL
- AI集成：OpenAI API（或兼容接口）实现对话式数据填充
- 存储：本地开发使用文件系统，生产使用云存储（OSS/S3）
- 部署：前端Vercel/Netlify，后端Render/自托管

**参考模板**：Snowly（已提供HTML模板）作为首个模板。

---

## 二、开发阶段划分（4个迭代，共12周）

| 迭代 | 周期 | 重点内容 |
|------|------|----------|
| Sprint 1 | 第1-3周 | 基础架构搭建 + 数据模型 + 后端API + 前端核心布局 |
| Sprint 2 | 第4-6周 | 模板组件开发（Snowly） + 配置面板（手动表单） + 预览实时联动 |
| Sprint 3 | 第7-9周 | AI对话引导功能 + 图片上传 + 导出完整HTML |
| Sprint 4 | 第10-12周 | 多模板支持 + 移动端适配 + 测试 + 部署上线 |

---

## 三、详细任务分解

### Sprint 1：基础架构搭建（第1-3周）

#### 1.1 项目初始化（Week 1）
- 创建前后端项目仓库，配置TypeScript、ESLint、Prettier。
- 前端：使用Vite创建React+TS项目，安装Tailwind、Zustand、React Router（如需）、Lucide图标库。
- 后端：初始化Node+Express+TS项目，安装Prisma、PostgreSQL（或SQLite用于开发）、CORS、dotenv。
- 定义共享类型（`shared/types.ts`），前后端通过符号链接或npm包共享。

#### 1.2 数据库设计与建模（Week 1-2）
- 根据设计方案创建Prisma Schema（User、Project、ProjectImage、Experience、Skill、SocialLink、BlogPost、SiteConfig）。
- 编写迁移脚本，初始化开发数据库。
- 准备默认示例数据（用于快速填充测试）。

#### 1.3 后端基础API（Week 2）
- 实现CRUD接口：
  - `GET /api/site/:userId` → 获取完整站点数据（聚合查询）
  - `PUT /api/site/:userId` → 全量更新站点数据（或增量patch）
  - `POST /api/upload` → 图片上传（返回URL）
- 添加基本错误处理和输入验证（Joi或Zod）。
- 编写API文档（OpenAPI或Postman Collection）。

#### 1.4 前端状态管理 & 布局（Week 3）
- 使用Zustand创建`siteStore`，管理`SiteData`，集成`localStorage`持久化。
- 实现`GeneratorLayout`：左右两栏（配置面板+预览面板），使用`flex`或`grid`布局，确保基础响应式。
- 配置面板骨架：划分各区块（个人信息、项目、经历、技能、社交、博客、网站配置），每个区块先放置占位组件。

---

### Sprint 2：模板 & 配置面板 + 实时预览（第4-6周）

#### 2.1 模板组件开发（TemplateSnowly）（Week 4-5）
- 将Snowly HTML拆分为React组件：
  - `HeroSection`：展示用户头像、姓名、头衔、简介。
  - `StatsSection`：统计数字（项目数、客户数等）。
  - `ProjectsSection`：网格展示作品卡片。
  - `VideosSection`：视频网格（嵌入YouTube/Vimeo）。
  - `SkillsSection`：技能标签或进度条。
  - `ExperienceSection`：时间线展示工作/教育经历。
  - `ContactSection`：社交链接 + 联系表单。
  - `Footer`。
- 所有组件接收对应的数据子集作为props，根据数据是否为空和`config`开关决定是否渲染。
- 使用Tailwind响应式类，确保在不同屏幕下表现良好。
- 添加CSS变量控制主题色（`--primary-color`）。

#### 2.2 配置面板（手动表单）（Week 5-6）
- 为每个数据模块开发编辑组件：
  - `PersonalInfoForm`：姓名、头像URL、头衔、简介、详细bio、位置。
  - `ProjectList`：展示项目列表，支持添加/编辑/删除/排序（拖拽排序可选）。每个项目表单包含标题、分类、封面图、描述、详细内容（富文本编辑器）、角色、工具、链接、日期等。
  - `ExperienceList`：类似，添加工作/教育经历。
  - `SkillList`：技能名称、分类、熟练度（星级或滑块）。
  - `SocialList`：选择平台（预设列表）+ 链接。
  - `BlogList`：文章管理（标题、摘要、内容、标签、状态）。
  - `SiteConfigForm`：主题选择、主色选择、布局选择、各模块显示开关。
- 使用受控组件，双向绑定到`siteStore`。

#### 2.3 实时预览联动（Week 6）
- 在右侧预览面板中，使用`TemplateRenderer`根据当前选中的模板ID加载对应模板组件，传入`store.data`。
- 任何表单变化触发`store`更新，预览自动重新渲染。
- 优化性能：使用`React.memo`包裹模板组件，只在相关数据变化时重绘。

---

### Sprint 3：AI对话 + 图片上传 + 导出（第7-9周）

#### 3.1 AI对话引导（Week 7-8）
- **后端AI服务**：
  - 创建`POST /api/ai/chat`接口，接收用户消息和当前站点数据。
  - 设计Prompt模板，引导GPT解析用户意图，输出结构化指令（JSON格式）。
  - 实现指令解析器，将AI输出映射为对`SiteData`的操作（更新字段、添加项目等）。
- **前端对话界面**：
  - 在配置面板顶部或独立区域嵌入聊天组件（类似ChatGPT）。
  - 用户输入消息，调用AI接口，获取指令并执行。
  - 显示AI的文本回复，告知用户已完成的更新。
  - 提供快速提问按钮（如“帮我完善个人简介”“添加一个项目”）。
- **降级方案**：预设常见问题的模板回复，减少API调用成本。

#### 3.2 图片上传功能（Week 8）
- 前端实现图片选择预览，调用`/api/upload`上传到云存储（开发阶段可存储到本地public目录）。
- 上传成功后返回URL，自动填入对应字段（如封面图、头像）。
- 支持拖拽上传。

#### 3.3 导出完整HTML（Week 9）
- **前端**：点击“导出”按钮，获取当前预览DOM内容（`document.getElementById('preview').innerHTML`）。
- **后端**：接收HTML片段，注入完整的`<head>`（包含Tailwind CDN、字体、Lucide、AOS等）和必要的初始化脚本，返回完整HTML文件。
- **下载**：前端使用`Blob`下载为`.html`文件。
- 可选：提供导出为PDF或部署到Netlify等一键发布功能（后续迭代）。

---

### Sprint 4：多模板 + 移动端适配 + 测试与上线（第10-12周）

#### 4.1 多模板支持（Week 10）
- 抽象模板接口，确保所有模板组件接收相同的`SiteData` props。
- 开发第二个模板（如`TemplateMinimal`，极简风格），验证模板切换功能。
- 在预览面板增加模板选择下拉，切换时动态加载对应组件。

#### 4.2 移动端适配完善（Week 10-11）
- 配置面板在窄屏（<768px）下变为抽屉或底部弹出，使用汉堡菜单切换。
- 预览区提供“移动预览”模式，缩小视口展示移动效果。
- 所有表单控件优化触摸体验（增大点击区域，使用合适的输入类型）。

#### 4.3 测试与修复（Week 11）
- 单元测试：对核心工具函数和组件（Jest + React Testing Library）。
- 集成测试：API端点测试（Supertest）。
- 端到端测试（可选）：使用Playwright模拟用户完整流程。
- 修复各浏览器兼容性问题。

#### 4.4 部署与上线（Week 12）
- 前端构建并部署到Vercel/Netlify。
- 后端部署到Render或自建服务器，设置环境变量。
- 配置数据库（生产环境PostgreSQL）。
- 配置云存储（AWS S3或阿里云OSS）。
- 设置自定义域名（可选）。
- 上线后监控日志和性能。

---

## 四、技术选型细化

### 前端
- **框架**：React 18 + TypeScript
- **状态管理**：Zustand（轻量、简单）
- **样式**：Tailwind CSS（与Snowly模板一致）
- **UI组件**：基于Tailwind自建组件，不使用第三方UI库（保持轻量）
- **富文本编辑器**：Tiptap（基于ProseMirror，易于定制）
- **拖拽排序**：dnd-kit（用于项目/经历排序）
- **HTTP请求**：axios
- **表单验证**：react-hook-form（可选）

### 后端
- **运行环境**：Node.js 18+ + Express
- **语言**：TypeScript
- **ORM**：Prisma
- **数据库**：PostgreSQL（开发可用SQLite）
- **文件上传**：Multer + 云存储SDK
- **AI集成**：OpenAI SDK（可配置其他兼容接口）
- **验证**：Zod

### 开发工具
- **代码规范**：ESLint + Prettier
- **版本控制**：Git + GitHub
- **项目管理**：Notion / Jira（记录任务和进度）

---

## 五、风险与应对措施

| 风险 | 应对策略 |
|------|----------|
| AI接口不稳定或成本高 | 预设模板回复，仅关键操作调用AI；使用缓存；提供手动编辑兜底 |
| 导出HTML样式错乱 | 预览和导出使用同一套渲染逻辑，确保一致性；导出前注入完整样式 |
| 移动端适配困难 | 设计时即采用移动优先（Mobile First）原则，使用Tailwind响应式类 |
| 图片上传慢 | 使用云存储直传（客户端直接上传到OSS），减少服务器中转 |
| 数据结构变更导致已保存数据失效 | 版本管理，提供数据迁移脚本 |

---

## 六、里程碑与验收标准

- **Sprint 1 结束**：可运行前后端项目，数据库模型创建，基础API工作，界面布局展示。
- **Sprint 2 结束**：Snowly模板完整渲染，所有表单可编辑，预览实时更新。
- **Sprint 3 结束**：AI对话可填充数据，图片上传成功，导出HTML功能可用。
- **Sprint 4 结束**：至少2套模板可选，移动端体验良好，系统稳定，成功部署上线。

---

## 七、后续迭代规划（v2.0）

- 增加更多模板（如摄影、博客风格）
- 提供更多主题色和字体选项
- 支持自定义CSS/JS
- 数据分析仪表板（浏览量等）

---

以上开发计划可根据团队规模和资源灵活调整。建议采用敏捷开发，每两周一个迭代，及时回顾和调整。