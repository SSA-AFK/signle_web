import { describe, expect, it } from 'vitest';
import { defaultSiteData } from '@siteforge/shared';
import { renderStaticHtml } from './renderStaticHtml.js';

describe('renderStaticHtml', () => {
  it('exports Snowly HTML with user content and interactions', () => {
    const html = renderStaticHtml(defaultSiteData, 'snowly');

    expect(html).toContain(defaultSiteData.user.displayName);
    expect(html).toContain('Vortex Quantum Dashboard');
    expect(html).toContain('Before / After Results');
    expect(html).toContain('calculateEstimate');
    expect(html).toContain('--primary: #3b0764');
  });

  it('rejects unsupported templates', () => {
    expect(() => renderStaticHtml(defaultSiteData, 'unknown')).toThrow('Unsupported template');
  });
});
