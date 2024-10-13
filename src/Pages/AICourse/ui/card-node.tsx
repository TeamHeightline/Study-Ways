import {useCallback} from 'react';
import {Handle, Position} from '@xyflow/react';
import CardMicroView from "../../Cards/CardMicroView";
import {observer} from "mobx-react";
import {AICourseStore} from "../model/store";

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

    const selectedCardId = AICourseStore.selectedCardId

    const handleClick = useCallback(() => {
        AICourseStore.setSelectedCardID(cardID);
        AICourseStore.loadNextCards(cardID)
        if (!isDefaultCard) {
            return
        }
        AICourseStore.setDefaultCardID(cardID)
    }, []);

    return (
        <>
            <Handle type="target" position={Position.Left}/>
            <div onClick={handleClick}
                 style={{
                     borderColor: String(cardID) === String(selectedCardId) ? '#f50057' : 'transparent',
                     border: '1px',
                     borderRadius: 16
                 }}
            >
                <CardMicroView cardID={cardID}/>
            </div>
            <Handle type="source" position={Position.Right}/>
        </>
    );
})