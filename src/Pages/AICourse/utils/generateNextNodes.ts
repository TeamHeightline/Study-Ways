import { Node } from "@xyflow/react/dist/esm/types";
import { OFFSET_FOR_FIRST_CARDS } from "../model/const";

export function generateNextNodes(
  rootCardPosition: { x: number; y: number },
  cardIDArray: number[],
): Node[] {
  return cardIDArray.map(
    (cardID, index): Node => ({
      id: String(cardID),
      data: { value: { cardID } },
      position: {
        x: rootCardPosition.x + OFFSET_FOR_FIRST_CARDS * 2,
        y: rootCardPosition.y + index * OFFSET_FOR_FIRST_CARDS,
      },
      type: "cardNode",
    }),
  );
}
