import { keyboardMove, moveThemeNode, themeTreeModel } from './tree-model';

const tree = [
  { id: '1', parent: 0, text: 'Физика' },
  { id: '2', parent: '1', text: 'Оптика' },
  { id: '4', parent: '2', text: 'Линзы' },
  { id: '3', parent: 0, text: 'Математика' },
  { id: '5', parent: 0, text: 'Астрономия' },
];

test('moves a whole branch inside another theme without changing descendants', () => {
  const next = moveThemeNode(tree, '1', '3', 'inside');
  expect(next.map(node => node.id)).toEqual(['3', '1', '2', '4', '5']);
  expect(next.find(node => node.id === '1').parent).toBe('3');
  expect(next.find(node => node.id === '2').parent).toBe('1');
  expect(next.find(node => node.id === '4').parent).toBe('2');
  expect(tree[0].parent).toBe(0);
});

test.each(['inside', 'before', 'after'])(
  'rejects dropping a parent %s its descendant',
  position => {
    expect(moveThemeNode(tree, '1', '4', position)).toBeNull();
    expect(moveThemeNode(tree, '2', '2', position)).toBeNull();
  },
);

test('reorders siblings, inserts after a whole target subtree, and returns a branch to root', () => {
  expect(moveThemeNode(tree, '3', '1', 'before').map(node => node.id)).toEqual([
    '3',
    '1',
    '2',
    '4',
    '5',
  ]);
  expect(moveThemeNode(tree, '5', '1', 'after').map(node => node.id)).toEqual([
    '1',
    '2',
    '4',
    '5',
    '3',
  ]);
  const next = moveThemeNode(tree, '2', null, 'root');
  expect(next.map(node => node.id)).toEqual(['1', '3', '5', '2', '4']);
  expect(next.find(node => node.id === '2').parent).toBe(0);
  expect(next.find(node => node.id === '4').parent).toBe('2');
  expect(moveThemeNode(tree, '5', null, 'root')).toBeNull();
});

test('keyboard commands change order and nesting without losing subtrees', () => {
  expect(keyboardMove(tree, '3', 'ArrowUp').map(node => node.id)).toEqual([
    '3',
    '1',
    '2',
    '4',
    '5',
  ]);
  expect(keyboardMove(tree, '1', 'ArrowDown').map(node => node.id)).toEqual([
    '3',
    '1',
    '2',
    '4',
    '5',
  ]);
  expect(
    keyboardMove(tree, '3', 'ArrowRight').find(node => node.id === '3').parent,
  ).toBe('1');
  expect(
    keyboardMove(tree, '2', 'ArrowLeft').find(node => node.id === '2').parent,
  ).toBe(0);
  expect(keyboardMove(tree, '1', 'ArrowUp')).toBeNull();
});

test('old cycles, orphans and duplicates remain visible once', () => {
  const model = themeTreeModel([
    { id: '1', parent: '2', text: 'А' },
    { id: '2', parent: '1', text: 'Б' },
    { id: '3', parent: '99', text: 'В' },
    { id: '1', parent: 0, text: 'Дубликат' },
  ]);
  expect(model.options).toHaveLength(3);
  expect(new Set(model.options.map(node => node.id)).size).toBe(3);
  expect(model.byId.get(3).parentId).toBeNull();
});

test('moving deeply nested branches has no recursive traversal limit', () => {
  const deep = Array.from({ length: 3000 }, (_, i) => ({
    id: String(i + 1),
    parent: i ? String(i) : 0,
    text: String(i),
  }));
  expect(moveThemeNode(deep, '2', '3000', 'inside')).toBeNull();
  const next = moveThemeNode(deep, '2', null, 'root');
  expect(next).toHaveLength(3000);
  expect(next[1].parent).toBe(0);
});

test('moving one theme never silently changes unrelated historical parents', () => {
  const legacy = [...tree, { id: '99', parent: '999', text: 'Старая тема' }];
  const next = moveThemeNode(legacy, '3', '1', 'inside');
  expect(next.find(node => node.id === '99').parent).toBe('999');
  expect(
    next
      .filter(
        node => node.parent !== legacy.find(old => old.id === node.id).parent,
      )
      .map(node => node.id),
  ).toEqual(['3']);
});
