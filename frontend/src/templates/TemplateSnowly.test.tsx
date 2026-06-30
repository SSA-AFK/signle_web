import { cleanup, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import { afterEach, describe, expect, it } from 'vitest';
import { defaultSiteData, type SiteData } from '@siteforge/shared';
import { TemplateSnowly } from './TemplateSnowly';

afterEach(() => {
  cleanup();
});

describe('TemplateSnowly', () => {
  it('renders default profile and Snowly interaction blocks', () => {
    render(<TemplateSnowly data={defaultSiteData} />);

    expect(screen.getAllByText(defaultSiteData.user.displayName)[0]).toBeInTheDocument();
    expect(screen.getByText('Before / After Results')).toBeInTheDocument();
    expect(screen.getByText('Interactive pricing model')).toBeInTheDocument();
    expect(screen.getByText('Vortex Quantum Dashboard')).toBeInTheDocument();
  });

  it('hides optional sections when toggles and arrays are empty', () => {
    const data: SiteData = {
      ...defaultSiteData,
      projects: [],
      skills: [],
      experiences: [],
      config: {
        ...defaultSiteData.config,
        showExperience: false,
        showSkills: false
      }
    };

    render(<TemplateSnowly data={data} />);

    expect(screen.queryByText('Selected Work')).not.toBeInTheDocument();
    expect(screen.queryByText('Tools and strengths.')).not.toBeInTheDocument();
    expect(screen.queryByText('Experience')).not.toBeInTheDocument();
    expect(screen.getByText('Before / After Results')).toBeInTheDocument();
  });
});
