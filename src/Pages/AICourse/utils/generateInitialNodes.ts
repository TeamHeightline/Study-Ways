import {OFFSET_FOR_FIRST_CARDS} from "../model/const";
import {Node} from "@xyflow/react/dist/esm/types";

export function generateInitialNodes(cardIDArray: number[]): Node[] {
    return cardIDArray.map((cardID, index): Node => {
        return {
            id: String(cardID),
            data: {value: {cardID, isDefaultCard: true}},
            position: {x: index * OFFSET_FOR_FIRST_CARDS, y: 0},
            type: 'cardNode'
        }
    })
}