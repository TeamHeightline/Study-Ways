export interface ConnectedTheme {
  id: number;
  text: string;
  parentId: number | null;
}

export function themeSearchUrl(id: number) {
  return `/cards?searchType=DSearch&theme=${id}`;
}

export function parseThemeId(value: string | null): number | undefined {
  if (!value || !/^\d+$/.test(value)) return undefined;
  const id = Number(value);
  return Number.isSafeInteger(id) && id > 0 && id <= 2147483647
    ? id
    : undefined;
}

export function getThemePaths(
  themes: readonly ConnectedTheme[],
  selected: readonly ConnectedTheme[],
): ConnectedTheme[][] {
  const byId = new Map(themes.map(theme => [theme.id, theme]));
  for (const theme of selected)
    if (!byId.has(theme.id)) byId.set(theme.id, theme);
  const paths: ConnectedTheme[][] = [];
  const added = new Set<number>();
  for (const leaf of selected) {
    if (added.has(leaf.id)) continue;
    added.add(leaf.id);
    const path: ConnectedTheme[] = [];
    const visited = new Set<number>();
    let theme = byId.get(leaf.id);
    while (theme && !visited.has(theme.id)) {
      visited.add(theme.id);
      path.push(theme);
      theme = theme.parentId === null ? undefined : byId.get(theme.parentId);
    }
    paths.push(path.reverse());
  }
  return paths;
}

// Iterative traversal handles deep trees and prevents repeated IDs or loops
// from malformed historical data from breaking the search filter.
export function getThemeDescendantIds(
  themes: readonly ConnectedTheme[],
  selectedId: number | string | undefined,
): string[] {
  if (selectedId === undefined) return [];
  const children = new Map<string, string[]>();
  for (const theme of themes) {
    if (theme.parentId === null) continue;
    const parent = String(theme.parentId);
    const siblings = children.get(parent) ?? [];
    siblings.push(String(theme.id));
    children.set(parent, siblings);
  }
  const visited = new Set<string>();
  const pending = [String(selectedId)];
  while (pending.length) {
    const id = pending.pop()!;
    if (visited.has(id)) continue;
    visited.add(id);
    const descendants = children.get(id);
    if (descendants) {
      for (let index = descendants.length - 1; index >= 0; index--) {
        pending.push(descendants[index]);
      }
    }
  }
  return [...visited];
}
