import React, { memo, useEffect, useMemo, useRef, useState } from 'react';
import { SimpleTreeView } from '@mui/x-tree-view/SimpleTreeView';
import { TreeItem } from '@mui/x-tree-view/TreeItem';
import {
  Alert,
  Button,
  ButtonBase,
  Card,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  IconButton,
  LinearProgress,
  Tooltip,
  Typography,
} from '@mui/material';
import DragIndicator from '@mui/icons-material/DragIndicator';
import ArrowUpward from '@mui/icons-material/ArrowUpward';
import ArrowDownward from '@mui/icons-material/ArrowDownward';
import DriveFileMoveOutlined from '@mui/icons-material/DriveFileMoveOutlined';
import { useSaveThemeMutation } from '../../../Shared/ServerLayer/QueryLayer/write-api';
import { ThemeSelect } from '../../../Shared/ConnectedThemes/ThemeSelect';
import {
  DropPosition,
  keyboardMove,
  moveThemeNode,
  subtreeIds,
  ThemeTreeNode,
  themeTreeModel,
} from './tree-model';
import './theme-tree.css';

type Props = {
  treeData?: ThemeTreeNode[];
  setTreeData: React.Dispatch<
    React.SetStateAction<ThemeTreeNode[] | undefined>
  >;
  selectedThemeID?: string;
  setSelectedThemeID: React.Dispatch<React.SetStateAction<string | undefined>>;
  disabled?: boolean;
  onBusyChange?: (busy: boolean) => void;
};
type Target = { id: string | null; position: DropPosition };
const EMPTY_TREE: ThemeTreeNode[] = [];

export const ThemeTreeView = memo(function ThemeTreeView({
  treeData = EMPTY_TREE,
  setTreeData,
  selectedThemeID,
  setSelectedThemeID,
  disabled = false,
  onBusyChange,
}: Props) {
  const [updateTheme, { isLoading, isError, reset }] = useSaveThemeMutation();
  const [expanded, setExpanded] = useState<string[]>([]);
  const [dragging, setDragging] = useState<string | null>(null);
  const dragId = useRef<string | null>(null);
  const [target, setTarget] = useState<Target | null>(null);
  const [announcement, setAnnouncement] = useState('');
  const [moveDialog, setMoveDialog] = useState(false);
  const [atRoot, setAtRoot] = useState(true);
  const [parentId, setParentId] = useState<string | undefined>();
  const pending = useRef(false);
  const model = useMemo(() => themeTreeModel(treeData), [treeData]);
  const busy = disabled || isLoading;
  const selected = selectedThemeID
    ? model.byId.get(Number(selectedThemeID))
    : undefined;
  const excluded = useMemo(
    () =>
      selectedThemeID
        ? subtreeIds(treeData, selectedThemeID)
        : new Set<string>(),
    [treeData, selectedThemeID],
  );
  const parentOptions = useMemo(
    () => model.options.filter(node => !excluded.has(String(node.id))),
    [model, excluded],
  );

  useEffect(() => {
    if (!dragging || target?.position !== 'inside' || !target.id) return;
    const id = target.id;
    const timer = setTimeout(
      () =>
        setExpanded(current =>
          current.includes(id) ? current : [...current, id],
        ),
      650,
    );
    return () => clearTimeout(timer);
  }, [dragging, target?.id, target?.position]);

  function clearDrag() {
    dragId.current = null;
    setDragging(null);
    setTarget(null);
  }

  async function saveMove(next: ThemeTreeNode[] | null) {
    if (!next || busy || pending.current) return false;
    pending.current = true;
    onBusyChange?.(true);
    reset();
    const changed = next.find(
      node => treeData.find(old => old.id === node.id)?.parent !== node.parent,
    );
    try {
      if (changed)
        await updateTheme({
          id: Number(changed.id),
          parentId: Number(changed.parent) || null,
          text: changed.text,
        }).unwrap();
      setTreeData(next);
      if (changed?.parent)
        setExpanded(current =>
          current.includes(String(changed.parent))
            ? current
            : [...current, String(changed.parent)],
        );
      setAnnouncement('Тема перемещена.');
      return true;
    } catch {
      setAnnouncement('Не удалось переместить тему.');
      return false;
    } finally {
      pending.current = false;
      onBusyChange?.(false);
    }
  }

  function dragOver(event: React.DragEvent, id: string | null) {
    event.stopPropagation();
    if (!dragId.current || busy) return;
    const rect = event.currentTarget.getBoundingClientRect();
    const offset = event.clientY - rect.top;
    const position: DropPosition =
      id === null
        ? 'root'
        : offset < rect.height * 0.25
          ? 'before'
          : offset > rect.height * 0.75
            ? 'after'
            : 'inside';
    if (!moveThemeNode(treeData, dragId.current, id, position)) {
      event.dataTransfer.dropEffect = 'none';
      setTarget(null);
      return;
    }
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
    setTarget(current =>
      current?.id === id && current.position === position
        ? current
        : { id, position },
    );
  }

  function drop(event: React.DragEvent, id: string | null) {
    event.preventDefault();
    event.stopPropagation();
    const sourceId = dragId.current;
    const destination = target;
    clearDrag();
    if (sourceId && destination?.id === id)
      void saveMove(
        moveThemeNode(treeData, sourceId, id, destination.position),
      );
  }

  // Build JSX from the leaves upward, so malformed or deeply nested data cannot
  // cause recursion in our renderer. MUI supplies focus and arrow navigation.
  const children = new Map<number | null, number[]>();
  for (const node of model.options) {
    const list = children.get(node.parentId) || [];
    list.push(node.id);
    children.set(node.parentId, list);
  }
  const items = new Map<number, React.ReactNode>();
  for (let i = model.options.length - 1; i >= 0; i--) {
    const node = model.options[i];
    const id = String(node.id);
    items.set(
      node.id,
      <TreeItem
        key={id}
        itemId={id}
        label={node.text}
        data-theme-id={id}
        onKeyDown={event => {
          if (
            !event.altKey ||
            !['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(
              event.key,
            )
          )
            return;
          event.preventDefault();
          event.stopPropagation();
          void saveMove(keyboardMove(treeData, id, event.key));
        }}
        slotProps={{
          content: {
            draggable: !busy,
            className: `sw-theme-tree-row${dragging === id ? ' is-dragging' : ''}${target?.id === id ? ` drop-${target.position}` : ''}`,
            onDragStart: event => {
              if (busy) {
                event.preventDefault();
                return;
              }
              event.stopPropagation();
              dragId.current = id;
              setDragging(id);
              setSelectedThemeID(id);
              event.dataTransfer.effectAllowed = 'move';
              event.dataTransfer.setData('text/plain', id);
            },
            onDragEnd: clearDrag,
            onDragOver: event => dragOver(event, id),
            onDrop: event => drop(event, id),
          },
        }}
      >
        {(children.get(node.id) || []).map(childId => items.get(childId))}
      </TreeItem>,
    );
  }

  return (
    <div className="sw-theme-tree">
      <div className="sw-theme-tree-controls">
        <Typography component="p">
          <DragIndicator fontSize="small" />
          Перетащите тему между строками или внутрь другой темы.
        </Typography>
        <div>
          <Tooltip title="Выше (Alt + ↑)">
            <span>
              <IconButton
                aria-label="Переместить тему выше"
                disabled={
                  busy ||
                  !selectedThemeID ||
                  !keyboardMove(treeData, selectedThemeID, 'ArrowUp')
                }
                onClick={() =>
                  void saveMove(
                    keyboardMove(treeData, selectedThemeID!, 'ArrowUp'),
                  )
                }
              >
                <ArrowUpward />
              </IconButton>
            </span>
          </Tooltip>
          <Tooltip title="Ниже (Alt + ↓)">
            <span>
              <IconButton
                aria-label="Переместить тему ниже"
                disabled={
                  busy ||
                  !selectedThemeID ||
                  !keyboardMove(treeData, selectedThemeID, 'ArrowDown')
                }
                onClick={() =>
                  void saveMove(
                    keyboardMove(treeData, selectedThemeID!, 'ArrowDown'),
                  )
                }
              >
                <ArrowDownward />
              </IconButton>
            </span>
          </Tooltip>
          <Button
            startIcon={<DriveFileMoveOutlined />}
            disabled={busy || !selected}
            onClick={() => {
              setAtRoot(selected?.parentId === null);
              setParentId(
                selected?.parentId === null
                  ? undefined
                  : String(selected?.parentId),
              );
              setMoveDialog(true);
            }}
          >
            Переместить
          </Button>
        </div>
      </div>
      {isError && (
        <Alert severity="error">
          Не удалось переместить тему. Изменения не сохранены. Повторите
          действие.
        </Alert>
      )}
      {busy && <LinearProgress aria-label="Сохранение дерева тем" />}
      <Card variant="outlined" className="sw-theme-tree-card" aria-busy={busy}>
        <SimpleTreeView
          aria-label="Иерархия тем"
          selectedItems={selectedThemeID || null}
          onSelectedItemsChange={(_, id) => setSelectedThemeID(id || undefined)}
          expandedItems={expanded}
          onExpandedItemsChange={(_, ids) => setExpanded(ids)}
          expansionTrigger="iconContainer"
        >
          {(children.get(null) || []).map(id => items.get(id))}
        </SimpleTreeView>
        {!treeData.length && (
          <Typography className="sw-theme-tree-empty">
            Тем пока нет. Добавьте первую тему.
          </Typography>
        )}
        <ButtonBase
          className={`sw-theme-tree-root-drop${target?.position === 'root' ? ' is-active' : ''}`}
          disabled={
            busy || (!dragging && (!selected || selected.parentId === null))
          }
          onDragOver={event => dragOver(event, null)}
          onDrop={event => drop(event, null)}
          onClick={() =>
            selectedThemeID &&
            void saveMove(
              moveThemeNode(treeData, selectedThemeID, null, 'root'),
            )
          }
        >
          На верхний уровень
        </ButtonBase>
      </Card>
      <p className="sw-theme-tree-help">
        Alt + ↑ / ↓ — порядок. Alt + → / ← — вложенность. На телефоне
        используйте кнопку «Переместить».
      </p>
      <span
        className="sw-theme-tree-announcement"
        role="status"
        aria-live="polite"
      >
        {announcement}
      </span>
      <Dialog
        open={moveDialog}
        onClose={() => !busy && setMoveDialog(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Переместить тему «{selected?.text}»</DialogTitle>
        <DialogContent>
          {isError && (
            <Alert severity="error">
              Не удалось переместить тему. Повторите попытку.
            </Alert>
          )}
          <FormControlLabel
            control={
              <Checkbox
                checked={atRoot}
                disabled={busy || !parentOptions.length}
                onChange={(_, checked) => setAtRoot(checked)}
              />
            }
            label="На верхний уровень"
          />
          <ThemeSelect
            label="Новая родительская тема"
            themes={parentOptions}
            selectedIds={parentId ? [parentId] : []}
            onChange={ids => setParentId(ids[0])}
            disabled={busy || atRoot}
          />
        </DialogContent>
        <DialogActions>
          <Button disabled={busy} onClick={() => setMoveDialog(false)}>
            Отмена
          </Button>
          <Button
            variant="contained"
            disabled={busy || (!atRoot && !parentId)}
            onClick={async () => {
              if (!selectedThemeID) return;
              const next = moveThemeNode(
                treeData,
                selectedThemeID,
                atRoot ? null : parentId || null,
                atRoot ? 'root' : 'inside',
              );
              if (!next || (await saveMove(next))) setMoveDialog(false);
            }}
          >
            Переместить тему
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
});
