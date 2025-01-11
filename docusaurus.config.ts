import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

const config: Config = {
  title: 'Frontend Style Guide',
  tagline: 'Frontend Style Guide',
  favicon: 'img/favicon.ico',

  // Set the production url of your site here
  url: 'https://docs.shtefan.me/',
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: '/style-guide/',

  // For DEV
  // baseUrl: '/',

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  // organizationName: 'dshtefan', // Usually your GitHub org/user name.
  // projectName: 'style-guide', // Usually your repo name.

  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',

  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'ru',
    locales: ['ru'],
  },

  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.ts',
          showLastUpdateAuthor: true,
          showLastUpdateTime: true,
          routeBasePath: '/',
          editUrl:
            'https://github.com/dshtefan/style-guide',
        },
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    image: 'img/social-card.png',
    colorMode: {
      defaultMode: 'dark',
      disableSwitch: true,
    },
    navbar: {
      title: 'Frontend Style Guide',
      logo: {
        alt: 'Logo',
        src: 'img/logo.svg',
      },
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'tutorialSidebar',
          position: 'left',
          label: 'Руководство',
        },
        {
          href: 'https://github.com/dshtefan/style-guide',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      links: [
        {
          title: 'Docs',
          items: [
            {
              label: 'Руководство',
              to: '/',
            },
          ],
        },
        {
          title: 'Contacts',
          items: [
            {
              label: 'Email',
              href: 'mailto:shtefan.den@gmail.com',
            },
          ],
        },
        {
          title: 'More',
          items: [
            {
              label: 'GitHub',
              href: 'https://github.com/dshtefan',
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} | <a href="https://github.com/dshtefan" target="_blank"><b>Denis Shtefan</b></a>`,
    },
    prism: {
      theme: prismThemes.jettwaveLight,
      darkTheme: prismThemes.oneDark,
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
