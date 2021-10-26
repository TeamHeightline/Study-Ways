import React, { useState } from "react";
import { StylesProvider, ThemeProvider } from "@material-ui/core/styles";
import CssBaseLine from "@material-ui/core/CssBaseline";
import { Tree, NodeModel } from "@minoru/react-dnd-treeview";
import { CustomData } from "./types";
import { CustomNode } from "./CustomNode";
import { theme } from "./theme";
import { Placeholder } from "./Placeholder";
import styles from "./App.module.css";
import SampleData from "./sample_data.json";
import { CustomDragPreview } from "./CustomDragPreview";
import {GET_ALL_UNSTRUCTURED_THEME} from "./Struct";
import {useQuery} from "@apollo/client";

function ThemeTree() {
  const [treeData, setTreeData] = useState<NodeModel<CustomData>[]>(SampleData);
  const {data, loading} = useQuery(GET_ALL_UNSTRUCTURED_THEME)
  
  const handleDrop = (newTree: NodeModel<CustomData>[]) => setTreeData(newTree);

  console.log(treeData)
  return (
        <StylesProvider injectFirst>
          <ThemeProvider theme={theme}>
            <CssBaseLine />
            <div className={styles.app}>
              <Tree
                tree={treeData}
                rootId={0}
                render={(node, { depth, isOpen, onToggle }) => (
                  <CustomNode
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
                  placeholder: styles.placeholder
                }}
                sort={false}
                insertDroppableFirst={false}
                canDrop={(tree, { dragSource, dropTargetId, dropTarget }) => {
                  if (dragSource?.parent === dropTargetId) {
                    return true;
                  }
                }}
                dropTargetOffset={10}
                placeholderRender={(node, { depth }) => (
                  <Placeholder node={node} depth={depth} />
                )}
              />
            </div>
          </ThemeProvider>
        </StylesProvider>
  );
}

export default ThemeTree;
