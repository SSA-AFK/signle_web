import { describe, expect, it } from 'vitest';
import { defaultSiteData } from '@siteforge/shared';
import { renderStaticHtml } from './renderStaticHtml.js';

describe('renderStaticHtml', () => {
  it('exports Snowly HTML with user content and interactions', () => {
    const html = renderStaticHtml(defaultSiteData, 'snowly');

    expect(html).toContain(defaultSiteData.user.displayName);
    expect(html).toContain('Vortex Quantum Dashboard');
    expect(html).toContain('Awwwards Honorable Mention');
    expect(html).toContain('award-grid');
    expect(html).toContain('Portfolio Walkthrough');
    expect(html).toContain('Interface system overview');
    expect(html).toContain('hero-slide');
    expect(html).toContain('padding-left: clamp(24px, 7vw, 160px)');
    expect(html).toContain('margin: 80px auto 80px 0');
    expect(html).toContain('hero-dots');
    expect(html).toContain('hero-arrows');
    expect(html).toContain('prevHero');
    expect(html).toContain('image-preview-trigger');
    expect(html).toContain('imageLightbox');
    expect(html).not.toContain('Before / After Results');
    expect(html).not.toContain('calculateEstimate');
    expect(html).toContain('--primary: #3b0764');
  });

  it('rejects unsupported templates', () => {
    expect(() => renderStaticHtml(defaultSiteData, 'unknown')).toThrow('Unsupported template');
  });
});
