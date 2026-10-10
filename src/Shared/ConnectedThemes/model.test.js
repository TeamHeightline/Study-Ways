import { getThemeDescendantIds, toThemeTreeData } from './model';

const themes = [
  { id: 1, text: 'Физика', parentId: null },
  { id: 2, text: 'Оптика', parentId: 1 },
  { id: 3, text: 'Волны', parentId: 2 },
  { id: 4, text: 'Механика', parentId: 1 },
  { id: 5, text: 'Другой корень', parentId: null },
];

test('selectors keep server order, string values and a numeric root sentinel', () => {
  expect(toThemeTreeData([themes[1], themes[0]])).toEqual([
    { id: '2', value: '2', title: 'Оптика', pId: '1' },
    { id: '1', value: '1', title: 'Физика', pId: 0 },
  ]);
});

test('AI filters include only the selected theme and all descendants for numeric or string IDs', () => {
  for (const id of [1, '1'])
    expect(getThemeDescendantIds(themes, id)).toEqual(['1', '2', '3', '4']);
  expect(getThemeDescendantIds(themes, 2)).toEqual(['2', '3']);
  expect(getThemeDescendantIds(themes, undefined)).toEqual([]);
  expect(getThemeDescendantIds([], 12)).toEqual(['12']);
});

test('deep trees and historical duplicate or cyclic relationships cannot overflow or loop', () => {
  const deepTree = Array.from({ length: 20000 }, (_, index) => ({
    id: index + 1,
    text: '',
    parentId: index || null,
  }));
  expect(getThemeDescendantIds(deepTree, 1)).toHaveLength(20000);
  expect(
    getThemeDescendantIds(
      [
        { id: 1, text: '', parentId: 2 },
        { id: 2, text: '', parentId: 1 },
        { id: 2, text: '', parentId: 1 },
      ],
      1,
    ),
  ).toEqual(['1', '2']);
});
