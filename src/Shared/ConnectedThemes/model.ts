export interface ConnectedTheme {
  id: number;
  text: string;
  parentId: number | null;
}

export function toThemeTreeData(themes: readonly ConnectedTheme[]) {
  return themes.map(theme => ({
    id: String(theme.id),
    value: String(theme.id),
    title: theme.text,
    pId: theme.parentId === null ? 0 : String(theme.parentId),
  }));
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
