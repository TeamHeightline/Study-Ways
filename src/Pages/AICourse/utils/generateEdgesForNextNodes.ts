import { Edge } from "@xyflow/react/dist/esm/types";

export function generateEdgesForNextNodes(
  rootNodeID: number,
  nextNodeIDs: number[],
): Edge[] {
  return nextNodeIDs.map((nodeID) => ({
    id: `${String(rootNodeID)}---${nodeID}`,
    source: String(rootNodeID),
    target: String(nodeID),
    style: { stroke: "#2196f3" },
  }));
}
