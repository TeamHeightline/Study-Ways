import { toJS } from "mobx";
import { observer } from "mobx-react";
import { useEffect } from "react";
import { Background, Controls, ReactFlow, useReactFlow } from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { CardNode } from "./card-node";
import { AICourseStore } from "../model/store";
import { isMobileHook } from "../../../Shared/CustomHooks/isMobileHook";

interface IProps {
  defaultCardsID?: number[];
}

const nodeTypes = { cardNode: CardNode };

const NODE_CENTER_OFFSET_LEFT = 600;
const NODE_CENTER_OFFSET_BOTTOM = 300;

const PC_ZOOM = 0.5;
const PC_MAX_ZOOM = 0.25;

const MOBILE_ZOOM = 0.3;
const MOBILE_MAX_ZOOM = 0.15;

const Flow = observer((props: IProps) => {
  const nodes = toJS(AICourseStore.nodes);
  const edges = toJS(AICourseStore.edges);
  const selectedNodeID = toJS(AICourseStore.selectedCardId);
  const isMobile = isMobileHook();

  const { setCenter } = useReactFlow();

  useEffect(() => {
    const selectedNode = nodes.find(
      (node) => node.id === String(selectedNodeID),
    );
    if (!selectedNode) {
      return;
    }
    const x = selectedNode.position.x + NODE_CENTER_OFFSET_LEFT;
    const y = selectedNode.position.y + NODE_CENTER_OFFSET_BOTTOM;
    const zoom = isMobile ? MOBILE_ZOOM : PC_ZOOM;
    setCenter(x, y, { zoom, duration: 1000 });
  }, [selectedNodeID, nodes.length]);

  return (
    <div style={{ height: "75svh", width: "100vw" }}>
      <ReactFlow
        minZoom={isMobile ? MOBILE_MAX_ZOOM : PC_MAX_ZOOM}
        nodeTypes={nodeTypes}
        nodes={nodes}
        edges={edges}
        fitView
      >
        <Background />
        <Controls />
      </ReactFlow>
    </div>
  );
});

export { Flow };
