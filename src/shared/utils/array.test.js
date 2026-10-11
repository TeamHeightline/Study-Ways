import { compareByIdDescending, shuffle } from './array';

afterEach(() => jest.restoreAllMocks());

test('shuffle accepts missing and empty arrays', () => {
  expect(shuffle(undefined)).toEqual([]);
  expect(shuffle(null)).toEqual([]);
  expect(shuffle([])).toEqual([]);
});

test('shuffle preserves elements and leaves the source array unchanged', () => {
  const items = Object.freeze([{ id: 1 }, { id: 2 }, { id: 3 }]);
  jest.spyOn(Math, 'random').mockReturnValue(0);

  const result = shuffle(items);

  expect(result).not.toBe(items);
  expect(items.map(item => item.id)).toEqual([1, 2, 3]);
  expect(result.map(item => item.id).sort()).toEqual([1, 2, 3]);
  expect(result.every(item => items.includes(item))).toBe(true);
});

test('shuffle can produce each permutation of three items equally often', () => {
  const random = jest.spyOn(Math, 'random');
  const permutations = new Set();

  for (const first of [0, 0.4, 0.8]) {
    for (const second of [0, 0.8]) {
      random.mockReturnValueOnce(first).mockReturnValueOnce(second);
      permutations.add(shuffle([1, 2, 3]).join(','));
    }
  }

  expect(permutations.size).toBe(6);
});

test('shuffle copies a single element without drawing a random number', () => {
  const random = jest.spyOn(Math, 'random');
  const items = [1];
  expect(shuffle(items)).toEqual(items);
  expect(shuffle(items)).not.toBe(items);
  expect(random).not.toHaveBeenCalled();
});

test('descending IDs preserve string comparison and stable ties', () => {
  const first = { id: '2', name: 'first' };
  const second = { id: '2', name: 'second' };
  const items = [first, { id: '10' }, { id: '9' }, second];
  expect([...items].sort(compareByIdDescending)).toEqual([
    items[2],
    first,
    second,
    items[1],
  ]);
});

test('descending IDs sort numbers numerically and put missing IDs last', () => {
  const items = [{ id: null }, { id: 2 }, null, { id: 10 }, {}, { id: 9 }];
  expect([...items].sort(compareByIdDescending)).toEqual([
    items[3],
    items[5],
    items[1],
    items[0],
    null,
    items[4],
  ]);
});
