import type { SiteData } from '@siteforge/shared';

export async function exportSiteHtml(data: SiteData, templateId: string) {
  const response = await fetch('/api/export/html', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ data, templateId })
  });

  if (!response.ok) {
    throw new Error('导出失败，请确认后端服务正在运行。');
  }

  const html = await response.text();
  const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = `${data.user.username || 'siteforge'}-${templateId}.html`;
  anchor.click();
  URL.revokeObjectURL(url);
}
