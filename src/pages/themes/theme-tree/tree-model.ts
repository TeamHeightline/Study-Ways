import { buildThemeOptions } from '../../../shared/connected-themes/theme-options';

export interface ThemeTreeNode {
  id: string;
  parent: string | 0;
  text: string;
}
export type DropPosition = 'before' | 'after' | 'inside' | 'root';

export function themeTreeModel(tree: readonly ThemeTreeNode[]) {
  return buildThemeOptions(
    tree.map(node => ({
      id: Number(node.id),
      parentId: node.parent === 0 ? null : Number(node.parent),
      text: node.text,
    })),
  );
}

export function subtreeIds(tree: readonly ThemeTreeNode[], id: string) {
  const children = new Map<string, string[]>();
  for (const node of tree) {
    const list = children.get(String(node.parent)) || [];
    list.push(node.id);
    children.set(String(node.parent), list);
  }
  const result = new Set<string>();
  const pending = [id];
  while (pending.length) {
    const current = pending.pop()!;
    if (result.has(current)) continue;
    result.add(current);
    pending.push(...(children.get(current) || []));
  }
  return result;
}

export function moveThemeNode(
  tree: readonly ThemeTreeNode[],
  id: string,
  targetId: string | null,
  position: DropPosition,
): ThemeTreeNode[] | null {
  const model = themeTreeModel(tree);
  const source = model.byId.get(Number(id));
  const target =
    targetId === null ? undefined : model.byId.get(Number(targetId));
  if (!source || (position !== 'root' && !target)) return null;
  const ordered = model.options.map(node => ({
    id: String(node.id),
    parent: node.parentId === null ? (0 as const) : String(node.parentId),
    text: node.text,
  }));
  const subtree = subtreeIds(ordered, id);
  if (target && subtree.has(String(target.id))) return null;
  const parent: ThemeTreeNode['parent'] =
    position === 'root'
      ? 0
      : position === 'inside'
        ? String(target!.id)
        : target!.parentId === null
          ? 0
          : String(target!.parentId);
  const moving = ordered
    .filter(node => subtree.has(node.id))
    .map(node => (node.id === id ? { ...node, parent } : node));
  const remaining = ordered.filter(node => !subtree.has(node.id));
  let index = remaining.length;
  if (target) {
    index = remaining.findIndex(node => node.id === String(target.id));
    if (position !== 'before') {
      const targetSubtree = subtreeIds(remaining, String(target.id));
      while (index < remaining.length && targetSubtree.has(remaining[index].id))
        index++;
    }
  }
  const originalParents = new Map<string, string | 0>();
  for (const node of tree)
    if (!originalParents.has(node.id))
      originalParents.set(node.id, node.parent);
  const result = [
    ...remaining.slice(0, index),
    ...moving,
    ...remaining.slice(index),
  ].map(node =>
    node.id === id ? node : { ...node, parent: originalParents.get(node.id)! },
  );
  return result.every(
    (node, i) =>
      node.id === ordered[i].id && node.parent === originalParents.get(node.id),
  )
    ? null
    : result;
}

export function keyboardMove(
  tree: readonly ThemeTreeNode[],
  id: string,
  key: string,
) {
  const model = themeTreeModel(tree);
  const node = model.byId.get(Number(id));
  if (!node) return null;
  const siblings = model.options.filter(
    item => item.parentId === node.parentId,
  );
  const index = siblings.findIndex(item => item.id === node.id);
  if (key === 'ArrowUp' && index > 0)
    return moveThemeNode(tree, id, String(siblings[index - 1].id), 'before');
  if (key === 'ArrowDown' && index < siblings.length - 1)
    return moveThemeNode(tree, id, String(siblings[index + 1].id), 'after');
  if (key === 'ArrowRight' && index > 0)
    return moveThemeNode(tree, id, String(siblings[index - 1].id), 'inside');
  if (key === 'ArrowLeft' && node.parentId !== null)
    return moveThemeNode(tree, id, String(node.parentId), 'after');
  return null;
}
