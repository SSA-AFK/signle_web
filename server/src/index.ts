import cors from 'cors';
import express from 'express';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { defaultSiteData, type AIChatRequest, type SiteData } from '@siteforge/shared';
import { renderStaticHtml } from './renderStaticHtml.js';

const app = express();
const port = Number(process.env.PORT || 4000);
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dataDir = path.resolve(__dirname, '..', 'data');

app.use(cors());
app.use(express.json({ limit: '4mb' }));

function sitePath(userId: string) {
  const safeUserId = userId.replace(/[^a-zA-Z0-9_-]/g, '_');
  return path.join(dataDir, `${safeUserId}.json`);
}

function isSiteData(value: unknown): value is SiteData {
  const data = value as Partial<SiteData>;
  return Boolean(data && data.user && data.config && Array.isArray(data.projects) && Array.isArray(data.experiences) && Array.isArray(data.skills) && Array.isArray(data.socialLinks) && Array.isArray(data.blogPosts));
}

app.get('/api/health', (_request, response) => {
  response.json({ ok: true, service: 'siteforge-server' });
});

app.get('/api/site/:userId', async (request, response) => {
  try {
    const raw = await readFile(sitePath(request.params.userId), 'utf8');
    response.json(JSON.parse(raw));
  } catch {
    response.json(defaultSiteData);
  }
});

app.put('/api/site/:userId', async (request, response) => {
  if (!isSiteData(request.body)) {
    response.status(400).json({ error: 'Invalid SiteData payload' });
    return;
  }

  await mkdir(dataDir, { recursive: true });
  await writeFile(sitePath(request.params.userId), JSON.stringify(request.body, null, 2), 'utf8');
  response.json({ ok: true });
});

app.post('/api/export/html', (request, response) => {
  const body = request.body as { data?: unknown; templateId?: string };
  if (!isSiteData(body.data) || !body.templateId) {
    response.status(400).json({ error: 'Expected { data: SiteData, templateId: string }' });
    return;
  }

  try {
    const html = renderStaticHtml(body.data, body.templateId);
    response.setHeader('Content-Type', 'text/html; charset=utf-8');
    response.send(html);
  } catch (error) {
    response.status(400).json({ error: error instanceof Error ? error.message : 'Export failed' });
  }
});

app.post('/api/ai/chat', (request, response) => {
  const body = request.body as Partial<AIChatRequest>;
  if (!body.message || !body.currentData || !isSiteData(body.currentData)) {
    response.status(400).json({ error: 'Expected AIChatRequest' });
    return;
  }

  response.json({
    reply: 'AI 接口已预留。首版先使用手动配置面板，后续可在这里接入 OpenAI 并返回结构化 actions。',
    actions: []
  });
});

if (process.env.NODE_ENV !== 'test') {
  app.listen(port, () => {
    console.log(`SiteForge API listening on http://localhost:${port}`);
  });
}

export { app };
