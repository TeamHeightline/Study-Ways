import { NodeModel, Tree } from "@minoru/react-dnd-treeview";
import { CustomNode } from "./CustomNode";
import { CustomDragPreview } from "./CustomDragPreview";
import styles from "./App.module.css";
import { Placeholder } from "./Placeholder";
import { Card } from "@mui/material";
import React, { memo, useEffect, useState } from "react";
import { differenceWith } from "lodash";
import { useMutation } from "@apollo/client";
import { Mutation } from "../../../SchemaTypes";
import { UpdateTheme } from "./Struct";

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
  const [updateData, setUpdateData] = useState<{
    id: number;
    parent: number;
    text: string;
  }>({ id: 0, parent: 0, text: "_" });

  useEffect(() => {
    if (updateData.id !== 0) {
      updateTheme();
    }
  }, [updateData]);

  const [updateTheme] = useMutation<Mutation>(UpdateTheme, {
    variables: {
      id: updateData.id,
      parent: updateData.parent,
      text: updateData.text,
    },
  });

  const handleDrop = (newTree: NodeModel[]) => {
    const diff: NodeModel = differenceWith(newTree, treeData)[0];
    if (diff?.id && diff?.id !== 0) {
      setUpdateData({
        id: Number(diff.id),
        parent: Number(diff.parent),
        text: diff.text,
      });
    }
    setTreeData(newTree);
  };
  useEffect(() => {
    void 0;
  }, [manualUpdate]);
  return (
    <Card variant="outlined" style={{ height: 650, overflow: "auto" }}>
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
        dragPreviewRender={(monitorProps) => (
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
        canDrop={(tree, { dragSource, dropTargetId }) => {
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
