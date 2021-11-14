import {NodeModel, Tree} from "@minoru/react-dnd-treeview";
import {CustomNode} from "./CustomNode";
import {CustomDragPreview} from "./CustomDragPreview";
import styles from "./App.module.css";
import {Placeholder} from "./Placeholder";
import {Card} from "@mui/material";
import React, {memo, useEffect} from "react";

type IThemeTreeViewProps = {
    treeData?: NodeModel[],
    setTreeData: React.Dispatch<React.SetStateAction<NodeModel[] | undefined>>,
    selectedThemeID: string | undefined,
    setSelectedThemeID: React.Dispatch<React.SetStateAction<string | undefined>>,
    manualUpdate: boolean
}

export const ThemeTreeView = memo(function ThemeTreeView({
                                                             treeData,
                                                             setTreeData,
                                                             selectedThemeID,
                                                             setSelectedThemeID,
                                                             manualUpdate
                                                         }: IThemeTreeViewProps) {
    const handleDrop = (newTree: NodeModel[]) => setTreeData(newTree);
    useEffect(() => {
        void (0)
    }, [manualUpdate])
    return (
        <Card variant="outlined" style={{height: 402}}>
            <Tree
                tree={treeData || []}
                rootId={0}
                render={(node, {depth, isOpen, onToggle}) => (
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
                    <CustomDragPreview monitorProps={monitorProps}/>
                )}
                onDrop={handleDrop}
                classes={{
                    root: styles.treeRoot,
                    draggingSource: styles.draggingSource,
                    placeholder: styles.placeholder
                }}
                sort={false}
                insertDroppableFirst={false}
                canDrop={(tree, {dragSource, dropTargetId}) => {
                    if (dragSource?.parent === dropTargetId) {
                        return true;
                    }
                }}
                dropTargetOffset={10}
                placeholderRender={(node, {depth}) => (
                    <Placeholder node={node} depth={depth}/>
                )}
            />
        </Card>
    )
})