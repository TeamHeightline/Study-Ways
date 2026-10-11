import { NodeModel, Tree } from '@minoru/react-dnd-treeview';
import { CustomNode } from './CustomNode';
import { CustomDragPreview } from './CustomDragPreview';
import styles from './App.module.css';
import { Placeholder } from './Placeholder';
import { Card } from '@mui/material';
import React, { memo, useEffect, useState } from 'react';
import { useSaveThemeMutation } from '../../../Shared/ServerLayer/QueryLayer/write-api';
import { Alert } from '@mui/material';

type IThemeTreeViewProps = {
  treeData?: NodeModel[];
  setTreeData: React.Dispatch<React.SetStateAction<NodeModel[] | undefined>>;
  selectedThemeID: string | undefined;
  setSelectedThemeID: React.Dispatch<React.SetStateAction<string | undefined>>;
  manualUpdate: boolean;
};

export const ThemeTreeView = memo(function ThemeTreeView({
  treeData,
  setTreeData,
  selectedThemeID,
  setSelectedThemeID,
  manualUpdate,
}: IThemeTreeViewProps) {
  const [updateTheme, { isLoading, isError }] = useSaveThemeMutation();
  const handleDrop = async (newTree: NodeModel[]) => {
    if (isLoading) return;
    const changed = newTree.find(
      node => treeData?.find(old => old.id === node.id)?.parent !== node.parent,
    );
    try {
      if (changed)
        await updateTheme({
          id: Number(changed.id),
          parentId: Number(changed.parent) || null,
          text: changed.text,
        }).unwrap();
      setTreeData(newTree);
    } catch {}
  };
  return (
    <Card variant="outlined" style={{ height: 650, overflow: 'auto' }}>
      {isError && (
        <Alert severity="error">
          Не удалось переместить тему. Изменения не сохранены.
        </Alert>
      )}
      <Tree
        tree={treeData || []}
        rootId={0}
        render={(node, { depth, isOpen, onToggle }) => (
          <CustomNode
            selectedThemeID={selectedThemeID}
            setSelectedThemeID={setSelectedThemeID}
            node={node}
            depth={depth}
            isOpen={isOpen}
            onToggle={onToggle}
          />
        )}
        dragPreviewRender={monitorProps => (
          <CustomDragPreview monitorProps={monitorProps} />
        )}
        onDrop={handleDrop}
        classes={{
          root: styles.treeRoot,
          draggingSource: styles.draggingSource,
          placeholder: styles.placeholder,
        }}
        sort={false}
        insertDroppableFirst={false}
        canDrag={() => !isLoading}
        canDrop={(tree, { dragSource, dropTargetId }) => {
          if (isLoading) return false;
          if (dragSource?.parent === dropTargetId) {
            return true;
          }
        }}
        dropTargetOffset={10}
        placeholderRender={(node, { depth }) => (
          <Placeholder node={node} depth={depth} />
        )}
      />
    </Card>
  );
});
