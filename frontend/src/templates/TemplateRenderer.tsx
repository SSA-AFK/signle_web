import type { SiteData } from '@siteforge/shared';
import { TemplateSnowly } from './TemplateSnowly';

interface TemplateRendererProps {
  data: SiteData;
  templateId: 'snowly';
}

export function TemplateRenderer({ data, templateId }: TemplateRendererProps) {
  if (templateId === 'snowly') {
    return <TemplateSnowly data={data} />;
  }

  return null;
}
