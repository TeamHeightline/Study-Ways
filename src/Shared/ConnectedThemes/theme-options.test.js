import { buildThemeOptions, visibleThemeOptions } from './theme-options';

test('theme hierarchy preserves sibling order and exposes descendants only when expanded', () => {
  const model = buildThemeOptions([
    { id: 2, text: 'Оптика', parentId: 1 },
    { id: 1, text: 'Физика', parentId: null },
    { id: 3, text: 'Волны', parentId: 2 },
    { id: 4, text: 'Механика', parentId: 1 },
    { id: 5, text: 'Другой корень', parentId: null },
  ]);
  expect(model.options.map(option => [option.id, option.depth])).toEqual([
    [1, 0],
    [2, 1],
    [3, 2],
    [4, 1],
    [5, 0],
  ]);
  expect(
    visibleThemeOptions(model, new Set(), '').map(option => option.id),
  ).toEqual([1, 5]);
  expect(
    visibleThemeOptions(model, new Set([1]), '').map(option => option.id),
  ).toEqual([1, 2, 4, 5]);
  expect(
    visibleThemeOptions(model, new Set(), 'ВОЛНЫ').map(option => option.id),
  ).toEqual([1, 2, 3]);
});

test('twenty thousand nested themes and malformed historical relationships remain searchable', () => {
  const deep = Array.from({ length: 20000 }, (_, index) => ({
    id: index + 1,
    parentId: index || null,
    text: index === 19999 ? 'Последняя тема' : String(index),
  }));
  const model = buildThemeOptions(deep);
  expect(model.options).toHaveLength(20000);
  expect(model.options[19999].depth).toBe(19999);
  expect(visibleThemeOptions(model, new Set(), 'последняя')).toHaveLength(
    20000,
  );
  const historical = buildThemeOptions([
    { id: 1, text: 'A', parentId: 2 },
    { id: 2, text: 'B', parentId: 1 },
    { id: 2, text: 'Duplicate', parentId: 1 },
    { id: 3, text: 'Orphan', parentId: 99 },
    { id: 4, text: 'Self', parentId: 4 },
  ]);
  expect(new Set(historical.options.map(option => option.id)).size).toBe(4);
  expect(
    visibleThemeOptions(historical, new Set(), 'B').map(option => option.text),
  ).toEqual(['A', 'B']);
});
