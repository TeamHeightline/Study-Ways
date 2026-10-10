const plugin = require('tailwindcss/plugin');
const {
  colors,
  themes,
  spacing,
  radii,
  fontSizes,
  themeVariables,
} = require('./src/Shared/Theme/theme-tokens');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./public/index.html', './src/**/*.{js,jsx,ts,tsx}'],
  prefix: 'tw-',
  // MUI and Ant Design already provide resets. Keep their form controls intact.
  corePlugins: { preflight: false },
  theme: {
    spacing: {
      ...Object.fromEntries(
        Object.keys(spacing).map(name => [
          name,
          `var(--sw-space-${name.replace('.', '_')})`,
        ]),
      ),
      px: '1px',
    },
    fontSize: Object.fromEntries(
      fontSizes.map(size => [`ui-${size}`, `var(--sw-font-size-${size})`]),
    ),
    extend: {
      colors: Object.fromEntries(
        Object.keys(colors).map(name => [
          name,
          `rgb(var(--sw-${name}-rgb) / <alpha-value>)`,
        ]),
      ),
      fontFamily: { sans: ['var(--sw-font-sans)'] },
      borderRadius: Object.fromEntries(
        radii.map(size => [`ui-${size}`, `var(--sw-radius-${size})`]),
      ),
      spacing: {
        sidebar: 'var(--sw-sidebar-width)',
        'sidebar-compact': 'var(--sw-sidebar-compact-width)',
        topbar: 'var(--sw-topbar-height)',
        'topbar-mobile': 'var(--sw-topbar-mobile-height)',
      },
    },
  },
  plugins: [
    plugin(({ addBase }) => {
      const definitions = {};
      for (const [id, definition] of Object.entries(themes)) {
        definitions[
          id === 'sage' ? `:root, [data-theme="${id}"]` : `[data-theme="${id}"]`
        ] = themeVariables(definition);
      }
      addBase(definitions);
    }),
  ],
};
