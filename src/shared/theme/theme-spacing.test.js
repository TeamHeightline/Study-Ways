const fs = require('fs');
const path = require('path');
const postcss = require('postcss');
const tailwind = require('tailwindcss');
const config = require('../../../tailwind.config');
const { themes, spacing, themeVariables } = require('./theme-tokens');

test.each(Object.entries(themes))(
  '%s defines every spacing variable referenced by Tailwind',
  (_, definition) => {
    const variables = themeVariables(definition);
    for (const [name, value] of Object.entries(config.theme.spacing)) {
      const reference = /^var\((--[^)]+)\)$/.exec(value);
      if (reference) expect(variables[reference[1]]).toBe(spacing[name]);
    }
    expect(
      Object.keys(variables).filter(name => !/^--[a-z0-9_-]+$/.test(name)),
    ).toEqual([]);
  },
);

test('compiled application styles have no unresolved spacing variables', async () => {
  const entry = path.resolve(__dirname, '../../App.css');
  const input = fs
    .readFileSync(entry, 'utf8')
    .replace(/@import\s+['"](.+?)['"];?/g, (rule, file) =>
      file.startsWith('.')
        ? fs.readFileSync(path.resolve(path.dirname(entry), file), 'utf8')
        : rule,
    );
  const output = await postcss([
    tailwind({ ...config, content: [{ raw: '', extension: 'html' }] }),
  ]).process(input, { from: entry });
  const defaults = themeVariables();
  const references = [
    ...output.css.matchAll(/var\((--sw-space-[a-z0-9_]+)\)/g),
  ].map(match => match[1]);
  expect(references.length).toBeGreaterThan(100);
  expect([...new Set(references)].filter(name => !defaults[name])).toEqual([]);
  expect(output.css).not.toContain('@apply');
});
