import type { MouseEvent } from 'react';
import { useRef } from 'react';
import type { SiteData, TemplateId } from '@siteforge/shared';
import { TemplateAura } from './TemplateAura';
import { TemplateAqua } from './TemplateAqua';
import { TemplateElena } from './TemplateElena';
import { TemplateJakarta } from './TemplateJakarta';
import { TemplateSolace } from './TemplateSolace';
import { TemplateSnowly } from './TemplateSnowly';

interface TemplateRendererProps {
  data: SiteData;
  templateId: TemplateId;
}

export function TemplateRenderer({ data, templateId }: TemplateRendererProps) {
  const rootRef = useRef<HTMLDivElement>(null);

  const handlePreviewAnchorClick = (event: MouseEvent<HTMLDivElement>) => {
    const link = (event.target as HTMLElement | null)?.closest('a[href^="#"]');
    if (!link || !rootRef.current?.contains(link)) {
      return;
    }

    const href = link.getAttribute('href');
    const sectionId = href?.slice(1);
    if (!sectionId) {
      return;
    }

    const target = rootRef.current.querySelector<HTMLElement>(`#${sectionId}`);
    const previewScroller = rootRef.current.closest<HTMLElement>('#preview');
    if (!target || !previewScroller) {
      return;
    }

    event.preventDefault();
    const previewRect = previewScroller.getBoundingClientRect();
    const targetRect = target.getBoundingClientRect();
    const topOffset = sectionId === 'home' || sectionId === 'top' ? 0 : 88;
    previewScroller.scrollTo({
      top: previewScroller.scrollTop + targetRect.top - previewRect.top - topOffset,
      behavior: 'smooth'
    });
    window.history.replaceState(null, '', `#${sectionId}`);
  };

  const renderTemplate = () => {
  if (templateId === 'snowly') {
    return <TemplateSnowly data={data} />;
  }

  if (templateId === 'elena') {
    return <TemplateElena data={data} />;
  }

  if (templateId === 'aura') {
    return <TemplateAura data={data} />;
  }

  if (templateId === 'solace') {
    return <TemplateSolace data={data} />;
  }

  if (templateId === 'jakarta') {
    return <TemplateJakarta data={data} />;
  }

  if (templateId === 'aqua') {
    return <TemplateAqua data={data} />;
  }

  return null;
  };

  return (
    <div ref={rootRef} onClickCapture={handlePreviewAnchorClick}>
      {renderTemplate()}
    </div>
  );
}
