import { cleanup, fireEvent, render, screen, within } from '@testing-library/react';
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
    expect(screen.getByText(/图片轮播/)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Previous hero image' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Next hero image' })).toBeInTheDocument();
    expect(screen.getByText('Vortex Quantum Dashboard')).toBeInTheDocument();
    expect(screen.getAllByText('Awards')[0]).toBeInTheDocument();
    expect(screen.getByText('Awwwards Honorable Mention')).toBeInTheDocument();
    expect(screen.getByText('Portfolio Walkthrough')).toBeInTheDocument();
    expect(screen.getByText('Interface system overview')).toBeInTheDocument();

    fireEvent.click(screen.getByLabelText('预览 Vortex Quantum Dashboard'));
    const dialog = screen.getByRole('dialog', { name: '图片预览' });
    expect(dialog).toBeInTheDocument();
    expect(within(dialog).getByRole('img', { name: 'Vortex Quantum Dashboard' })).toHaveAttribute('src', defaultSiteData.projects[0].coverImage);
    fireEvent.click(screen.getByRole('button', { name: '关闭' }));
    expect(screen.queryByRole('dialog', { name: '图片预览' })).not.toBeInTheDocument();
  });

  it('hides optional sections when toggles and arrays are empty', () => {
    const data: SiteData = {
      ...defaultSiteData,
      projects: [],
      skills: [],
      awards: [],
      experiences: [],
      videos: [],
      config: {
        ...defaultSiteData.config,
        heroImages: [defaultSiteData.config.heroImages[0]],
        showExperience: false,
        showSkills: false,
        showAwards: false,
        showVideos: false
      }
    };

    render(<TemplateSnowly data={data} />);

    expect(screen.queryByText('Selected Work')).not.toBeInTheDocument();
    expect(screen.queryByText('Tools and strengths.')).not.toBeInTheDocument();
    expect(screen.queryByText('Awards')).not.toBeInTheDocument();
    expect(screen.queryByText('Stories, demos, and walkthroughs.')).not.toBeInTheDocument();
    expect(screen.queryByText('Experience')).not.toBeInTheDocument();
    expect(screen.getByText(/静态封面/)).toBeInTheDocument();
  });
});
