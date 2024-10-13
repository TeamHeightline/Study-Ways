import {Node} from "@xyflow/react/dist/esm/types";
import {DEFAULT_NODE_PREFIX, OFFSET_FOR_FIRST_CARDS} from "../model/const";

export function generateNextNodes(rootCardPosition: { x: number, y: number }, cardIDArray: number[]): Node[] {
    return cardIDArray.map((cardID, index): Node => {
        return {
            id: String(cardID),
            data: {value: {cardID}},
            position: {
                x: rootCardPosition.x + OFFSET_FOR_FIRST_CARDS * 2,
                y: rootCardPosition.y + index * OFFSET_FOR_FIRST_CARDS
            },
            type: 'cardNode'
        }
    })
}