import {useCallback} from 'react';
import {Handle, Position} from '@xyflow/react';
import CardMicroView from "../../Cards/CardMicroView";
import {observer} from "mobx-react";
import {AICourseStore} from "../model/store";
import {toJS} from "mobx";

interface IProps {
    data: {
        value: {
            cardID: number
            isDefaultCard?: boolean
        }
    }
}

export const CardNode = observer((props: IProps) => {
    const {cardID, isDefaultCard} = props.data.value

    const selectedCardId = toJS(AICourseStore.selectedCardId)

    const handleClick = useCallback(() => {
        AICourseStore.setSelectedCardID(cardID);
        AICourseStore.loadNextCards(cardID)
        if (!isDefaultCard) {
            return
        }
        AICourseStore.setDefaultCardID(cardID)
    }, []);

    const isSelected = String(cardID) === String(selectedCardId)

    return (
        <>
            <Handle type="target" position={Position.Left}/>
            <div onClick={handleClick}
                 style={{
                     border: isSelected ? '1px solid #f50057' : 'none',
                     borderRadius: 24
                 }}
            >
                <CardMicroView cardID={cardID}/>
            </div>
            <Handle type="source" position={Position.Right}/>
        </>
    );
})