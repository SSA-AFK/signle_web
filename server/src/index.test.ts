import request from 'supertest';
import { describe, expect, it } from 'vitest';
import { defaultSiteData } from '@siteforge/shared';
import { app } from './index.js';

describe('SiteForge API', () => {
  it('returns health status', async () => {
    const response = await request(app).get('/api/health').expect(200);
    expect(response.body.ok).toBe(true);
  });

  it('rejects invalid site payloads', async () => {
    const response = await request(app).put('/api/site/test-invalid').send({ bad: true }).expect(400);
    expect(response.body.error).toContain('Invalid');
  });

  it('exports static HTML', async () => {
    const response = await request(app)
      .post('/api/export/html')
      .send({ data: defaultSiteData, templateId: 'snowly' })
      .expect(200);

    expect(response.text).toContain('<!doctype html>');
    expect(response.text).toContain(defaultSiteData.user.displayName);
  });

  it('returns mock AI response', async () => {
    const response = await request(app)
      .post('/api/ai/chat')
      .send({ message: '完善简介', currentData: defaultSiteData })
      .expect(200);

    expect(response.body.actions).toEqual([]);
  });
});
