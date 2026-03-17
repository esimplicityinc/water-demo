import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

const config: Config = {
  title: 'AquaTrack Documentation',
  tagline: 'Municipal Water Infrastructure Management System',
  favicon: 'img/favicon.ico',

  url: 'https://esimplicityinc.github.io',
  baseUrl: '/water-demo/',

  organizationName: 'esimplicityinc',
  projectName: 'water-demo',
  trailingSlash: false,

  onBrokenLinks: 'warn',
  onBrokenMarkdownLinks: 'warn',

  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      {
        docs: {
          path: '.',
          routeBasePath: 'docs',
          sidebarPath: './sidebars.ts',
          editUrl: 'https://github.com/aquatrack/aquatrack/tree/main/docs/',
          include: ['ddd/**/*.md', 'ddd/**/*.mdx', 'bdd/**/*.md', 'bdd/**/*.mdx', 'plans/**/*.md', 'plans/**/*.mdx', 'roads/**/*.md', 'roads/**/*.mdx', 'changes/**/*.md', 'changes/**/*.mdx', 'agents/**/*.md', 'agents/**/*.mdx', 'adr/**/*.md', 'adr/**/*.mdx', 'nfr/**/*.md', 'nfr/**/*.mdx', 'personas/**/*.md', 'personas/**/*.mdx', 'persons/**/*.md', 'persons/**/*.mdx', 'user-stories/**/*.md', 'user-stories/**/*.mdx', 'capabilities/**/*.md', 'capabilities/**/*.mdx', 'teams/**/*.md', 'teams/**/*.mdx', 'systems/**/*.md', 'systems/**/*.mdx', 'practice-areas/**/*.md', 'practice-areas/**/*.mdx', 'tools/**/*.md', 'tools/**/*.mdx', 'users-overview.md', 'system-overview.md', 'teams-overview.md', 'ROADMAP.mdx', 'CHANGELOG.md', 'index.md', 'index.mdx'],
        },
        blog: false,
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  plugins: [
    './plugins/bdd-data-plugin.js',
    './plugins/roadmap-data-plugin.js',
  ],

  themes: ['@docusaurus/theme-mermaid'],

  markdown: {
    mermaid: true,
  },

  themeConfig: {
    image: 'img/aquatrack-social-card.jpg',
    navbar: {
      title: 'AquaTrack',
      logo: {
        alt: 'AquaTrack Logo',
        src: 'img/logo.svg',
      },
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'dddSidebar',
          position: 'left',
          label: 'Business Structure',
        },
        {
          type: 'docSidebar',
          sidebarId: 'usersSidebar',
          position: 'left',
          label: 'Users',
        },
        {
          type: 'docSidebar',
          sidebarId: 'systemSidebar',
          position: 'left',
          label: 'System',
        },
        {
          type: 'docSidebar',
          sidebarId: 'teamsSidebar',
          position: 'left',
          label: 'Teams',
        },
        {
          type: 'docSidebar',
          sidebarId: 'practiceAreasSidebar',
          position: 'left',
          label: 'Practice Areas',
        },
        {
          type: 'docSidebar',
          sidebarId: 'toolsSidebar',
          position: 'left',
          label: 'Tools',
        },
        {
          type: 'docSidebar',
          sidebarId: 'planningSidebar',
          position: 'left',
          label: 'Planning',
        },
        {
          type: 'docSidebar',
          sidebarId: 'bddSidebar',
          position: 'left',
          label: 'System Specs',
        },
        {
          to: '/docs/status',
          label: 'System Status',
          position: 'right',
        },
        {
          type: 'docSidebar',
          sidebarId: 'agentsSidebar',
          position: 'right',
          label: 'Agents',
        },
        {
          type: 'docSidebar',
          sidebarId: 'adrSidebar',
          position: 'left',
          label: 'ADRs',
        },
        {
          type: 'docSidebar',
          sidebarId: 'nfrSidebar',
          position: 'left',
          label: 'NFRs',
        },
        {
          type: 'docSidebar',
          sidebarId: 'changesSidebar',
          position: 'left',
          label: 'Changes',
        },
        {
          href: 'https://github.com/aquatrack/aquatrack',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Domain',
          items: [
            {
              label: 'Domain Overview',
              to: '/docs/ddd/domain-overview',
            },
            {
              label: 'Bounded Contexts',
              to: '/docs/ddd/bounded-contexts',
            },
            {
              label: 'Ubiquitous Language',
              to: '/docs/ddd/ubiquitous-language',
            },
            {
              label: 'Use Cases',
              to: '/docs/ddd/use-cases',
            },
            {
              label: 'Architecture Decisions',
              to: '/docs/ddd/architecture-decisions',
            },
          ],
        },
        {
          title: 'BDD Testing',
          items: [
            {
              label: 'BDD Overview',
              to: '/docs/bdd/bdd-overview',
            },
            {
              label: 'Gherkin Syntax',
              to: '/docs/bdd/gherkin-syntax',
            },
            {
              label: 'Feature Index',
              to: '/docs/bdd/feature-index',
            },
            {
              label: 'DDD-BDD Mapping',
              to: '/docs/bdd/ddd-bdd-mapping',
            },
            {
              label: 'BDD Workflow',
              to: '/docs/agents/bdd-loop',
            },
          ],
        },
        {
          title: 'Planning',
          items: [
            {
              label: 'Roadmap',
              to: '/docs/roadmap',
            },
            {
              label: 'Implementation Plans',
              to: '/docs/plans',
            },
            {
              label: 'Architecture Decisions',
              to: '/docs/adr/README',
            },
            {
              label: 'Non-Functional Requirements',
              to: '/docs/nfr/index',
            },
            {
              label: 'Change History',
              to: '/docs/changes',
            },
          ],
        },
           {
           title: 'Community',
           items: [
             {
               label: 'Discord',
               href: 'https://discord.gg/aquatrack',
             },
             {
               label: 'Twitter',
               href: 'https://twitter.com/aquatrack',
             },
             {
               label: 'GitHub',
               href: 'https://github.com/aquatrack/aquatrack',
             },
           ],
         },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} AquaTrack. Built with Docusaurus.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
      additionalLanguages: ['typescript', 'javascript', 'json', 'bash'],
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
