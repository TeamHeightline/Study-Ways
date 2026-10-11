import { useEffect, useState } from 'react';
import { Button } from '@mui/material';
import OpenInFullRoundedIcon from '@mui/icons-material/OpenInFullRounded';
import CloseFullscreenRoundedIcon from '@mui/icons-material/CloseFullscreenRounded';
import { Background, Controls, ReactFlow, useReactFlow } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { CardNode } from './card-node';
import { useAICourse } from '../model/store';
import { isMobileHook } from '../../../shared/custom-hooks/isMobileHook';
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
const Flow = (props: IProps) => {
  const course = useAICourse();
  const [expanded, setExpanded] = useState(false);
  const nodes = course.nodes;
  const edges = course.edges;
  const selectedNodeID = course.selectedCardId;
  const isMobile = isMobileHook();
  const { setCenter } = useReactFlow();
  useEffect(() => {
    const selectedNode = nodes.find(node => node.id === String(selectedNodeID));
    if (!selectedNode) {
      return;
    }
    const x = selectedNode.position.x + NODE_CENTER_OFFSET_LEFT;
    const y = selectedNode.position.y + NODE_CENTER_OFFSET_BOTTOM;
    const zoom = isMobile ? MOBILE_ZOOM : PC_ZOOM;
    setCenter(x, y, { zoom, duration: 1000 });
  }, [selectedNodeID, nodes.length]);
  return (
    <section className="sw-ai-map-panel">
      <div className="sw-ai-map-heading">
        <div>
          <h2>Ваша траектория</h2>
          <p>
            Выберите карточку — рекомендации продолжат маршрут. Материал
            откроется ниже.
          </p>
        </div>
        <Button
          size="small"
          aria-expanded={expanded}
          startIcon={
            expanded ? (
              <CloseFullscreenRoundedIcon />
            ) : (
              <OpenInFullRoundedIcon />
            )
          }
          onClick={() => setExpanded(value => !value)}
        >
          {expanded ? 'Свернуть поле' : 'Расширить поле'}
        </Button>
      </div>
      <div className={'sw-ai-course-flow' + (expanded ? ' is-expanded' : '')}>
        <ReactFlow
          minZoom={isMobile ? MOBILE_MAX_ZOOM : PC_MAX_ZOOM}
          nodeTypes={nodeTypes}
          nodes={nodes}
          edges={edges}
          fitView
        >
          <Background />
          <Controls showInteractive={false} />
        </ReactFlow>
      </div>
    </section>
  );
};
export { Flow };
