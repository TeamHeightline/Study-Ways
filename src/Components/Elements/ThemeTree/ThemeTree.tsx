import React, { useState } from "react";
import { Tree, NodeModel } from "@minoru/react-dnd-treeview";
import { CustomNode } from "./CustomNode";
import { Placeholder } from "./Placeholder";
import styles from "./App.module.css";
import SampleData from "./sample_data.json";
import { CustomDragPreview } from "./CustomDragPreview";
import {GET_ALL_UNSTRUCTURED_THEME} from "./Struct";
import {useQuery} from "@apollo/client";
import {Card, CircularProgress, Fab, Grid} from "@mui/material";
import {Query} from "../../../../SchemaTypes";
import SettingsIcon from "@mui/icons-material/Settings";
import AddIcon from "@mui/icons-material/Add";
import SubdirectoryArrowRightIcon from "@mui/icons-material/SubdirectoryArrowRight";


function ThemeTree() {
  const [treeData, setTreeData] = useState<NodeModel[]>(SampleData);
  const {loading} = useQuery<Query>(GET_ALL_UNSTRUCTURED_THEME, {
      fetchPolicy: "cache-and-network",
      onCompleted: (data) =>{
          const dataForDisplay: NodeModel[] = []
          data?.unstructuredTheme?.map((theme)=>{
              dataForDisplay.push({
                  id: theme?.id || 0,
                  parent: theme?.parent?.id || 0,
                  text: theme?.text || "",
                  droppable: true,
              })
          })
          setTreeData(dataForDisplay)
      }
  })
    const [selectedThemeID, setSelectedThemeID] = useState<string | undefined>()
  
  const handleDrop = (newTree: NodeModel[]) => setTreeData(newTree);

  console.log(treeData)
  if(loading){
    return (
        <Grid container justifyContent="center">
          <CircularProgress />
        </Grid>
    )
  }
  return (
      <Grid item xs={12} md={4} >
          <Card variant="outlined" style={{height: 402}}>
            <Tree
              tree={treeData}
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
                placeholder: styles.placeholder
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
          <Grid container justifyContent={"end"} spacing={2} style={{marginTop: 1}}>
              <Grid item>
                  <Fab color="primary">
                      <SettingsIcon />
                  </Fab>
              </Grid>
              <Grid item>
                  <Fab color="primary">
                      <AddIcon/>
                  </Fab>
              </Grid>
              <Grid item>
                  <Fab color="primary">
                      <SubdirectoryArrowRightIcon/>
                  </Fab>
              </Grid>
          </Grid>
      </Grid>

  );
}

export default ThemeTree;
