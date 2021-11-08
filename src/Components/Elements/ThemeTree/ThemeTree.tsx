import React, { useState } from "react";
import { ThemeProvider, Theme, StyledEngineProvider } from "@mui/material/styles";
import StylesProvider from '@mui/styles/StylesProvider';
import CssBaseLine from "@mui/material/CssBaseline";
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


declare module '@mui/styles/defaultTheme' {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  interface DefaultTheme extends Theme {}
}


function ThemeTree() {
  const [treeData, setTreeData] = useState<NodeModel<CustomData>[]>(SampleData);
  const {data, loading} = useQuery(GET_ALL_UNSTRUCTURED_THEME)
  
  const handleDrop = (newTree: NodeModel<CustomData>[]) => setTreeData(newTree);

  console.log(treeData)
  return (
    <StylesProvider injectFirst>
      <StyledEngineProvider injectFirst>
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
      </StyledEngineProvider>
    </StylesProvider>
  );
}

export default ThemeTree;
