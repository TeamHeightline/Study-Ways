export function shuffle<T>(items: readonly T[] | null | undefined): T[] {
  const result = [...(items ?? [])];

  for (let index = result.length - 1; index > 0; index--) {
    const randomIndex = Math.floor(Math.random() * (index + 1));
    [result[index], result[randomIndex]] = [result[randomIndex], result[index]];
  }

  return result;
}

type ItemWithId = { id?: string | number | null } | null | undefined;

export function compareByIdDescending(a: ItemWithId, b: ItemWithId): number {
  const aId = a?.id;
  const bId = b?.id;

  if (aId === null || aId === undefined) {
    return bId === null || bId === undefined ? 0 : 1;
  }
  if (bId === null || bId === undefined) {
    return -1;
  }

  return aId < bId ? 1 : aId > bId ? -1 : 0;
}
