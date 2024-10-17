import {toJS} from "mobx";
import {observer} from "mobx-react";
import {useCallback} from 'react';
import {applyEdgeChanges, applyNodeChanges, Background, Controls, ReactFlow, useReactFlow} from "@xyflow/react";
import '@xyflow/react/dist/style.css';
import {CardNode} from "./card-node";
import {AICourseStore} from "../model/store";


interface IProps {
    defaultCardsID?: number[]
}

const nodeTypes = {cardNode: CardNode}

const Flow = observer((props: IProps) => {
    const nodes = toJS(AICourseStore.nodes)
    const edges = toJS(AICourseStore.edges)

    const {fitView} = useReactFlow();


    const onNodesChange = useCallback(
        (changes) => AICourseStore.setUINodes((nds) => applyNodeChanges(changes, nds)),
        [],
    );
    const onEdgesChange = useCallback(
        (changes) => AICourseStore.setUiEdges((eds) => applyEdgeChanges(changes, eds)),
        [],
    );


    return (
        <div style={{height: '80vh', width: '100vw'}}>
            <ReactFlow
                // maxZoom={100}
                // minZoom={0.0000005}
                nodeTypes={nodeTypes}
                nodes={nodes}
                onNodesChange={onNodesChange}
                edges={edges}
                onEdgesChange={onEdgesChange}
                fitView
            >
                <Background/>
                <Controls/>
            </ReactFlow>
        </div>

    );
})


export {Flow};
