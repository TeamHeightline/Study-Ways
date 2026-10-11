import type { ConnectedTheme } from './model';

export interface ThemeOption extends ConnectedTheme {
  depth: number;
  hasChildren: boolean;
}

// Normalize a forest iteratively. Old orphaned, duplicate and cyclic records
// stay selectable without recursion or a fixed nesting limit.
export function buildThemeOptions(themes: readonly ConnectedTheme[]) {
  const records = new Map<number, ConnectedTheme>();
  for (const theme of themes)
    if (!records.has(theme.id)) records.set(theme.id, theme);
  const children = new Map<number, ConnectedTheme[]>();
  const roots: ConnectedTheme[] = [];
  for (const theme of records.values()) {
    if (
      theme.parentId === null ||
      theme.parentId === theme.id ||
      !records.has(theme.parentId)
    ) {
      roots.push(theme);
    } else {
      const siblings = children.get(theme.parentId) ?? [];
      siblings.push(theme);
      children.set(theme.parentId, siblings);
    }
  }
  const options: ThemeOption[] = [];
  const byId = new Map<number, ThemeOption>();
  const visit = (root: ConnectedTheme) => {
    const pending = [
      { theme: root, parentId: null as number | null, depth: 0 },
    ];
    while (pending.length) {
      const { theme, parentId, depth } = pending.pop()!;
      if (byId.has(theme.id)) continue;
      const option = { ...theme, parentId, depth, hasChildren: false };
      byId.set(theme.id, option);
      options.push(option);
      const descendants = children.get(theme.id) ?? [];
      for (let i = descendants.length - 1; i >= 0; i--) {
        pending.push({
          theme: descendants[i],
          parentId: theme.id,
          depth: depth + 1,
        });
      }
    }
  };
  roots.forEach(visit);
  for (const theme of records.values()) if (!byId.has(theme.id)) visit(theme);
  for (const option of options) {
    if (option.parentId !== null) byId.get(option.parentId)!.hasChildren = true;
  }
  return { options, byId };
}

export function visibleThemeOptions(
  model: ReturnType<typeof buildThemeOptions>,
  expanded: ReadonlySet<number>,
  search: string,
) {
  const query = search.trim().toLocaleLowerCase('ru');
  if (query) {
    const included = new Set<number>();
    for (const option of model.options) {
      if (!option.text.toLocaleLowerCase('ru').includes(query)) continue;
      let cursor: ThemeOption | undefined = option;
      while (cursor && !included.has(cursor.id)) {
        included.add(cursor.id);
        cursor =
          cursor.parentId === null
            ? undefined
            : model.byId.get(cursor.parentId);
      }
    }
    return model.options.filter(option => included.has(option.id));
  }
  let collapsedDepth: number | null = null;
  return model.options.filter(option => {
    if (collapsedDepth !== null && option.depth > collapsedDepth) return false;
    collapsedDepth =
      option.hasChildren && !expanded.has(option.id) ? option.depth : null;
    return true;
  });
}
