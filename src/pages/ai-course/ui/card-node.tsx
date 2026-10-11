import { useCallback } from 'react';
import { Handle, Position } from '@xyflow/react';
import CardMicroView from '../../cards/card-micro-view';
import { useAICourse } from '../model/store';
interface IProps {
  data: {
    value: {
      cardID: number;
      isDefaultCard?: boolean;
    };
  };
}
const CARD_WIDTH = 342;
export const CardNode = (props: IProps) => {
  const course = useAICourse();
  const { cardID, isDefaultCard } = props.data.value;
  const selectedCardId = course.selectedCardId;
  const handleClick = useCallback(() => {
    course.setSelectedCardID(cardID);
    course.loadNextCards(cardID);
    if (!isDefaultCard) {
      return;
    }
    course.setDefaultCardID(cardID);
  }, [cardID, isDefaultCard, course.searchRequest]);
  const isSelected = String(cardID) === String(selectedCardId);
  return (
    <>
      <Handle type="target" position={Position.Left} />
      <div
        className={`sw-ai-card-node${isSelected ? ' is-selected' : ''}`}
        onClick={handleClick}
        style={{
          width: CARD_WIDTH,
        }}
      >
        <CardMicroView cardID={cardID} />
      </div>
      <Handle type="source" position={Position.Right} />
    </>
  );
};
