import {observer} from "mobx-react";
import React from 'react';
import {AISObject} from "../Store/AISearch";
import {MicoCardsField} from "./MicroCardField";
import {AISearchString} from "./AISearchString";

interface IAIHomePageProps extends React.HTMLAttributes<HTMLDivElement> {
    onCardSelect: (card_id: number) => void;
}

export const AICardSelector = observer(({onCardSelect, ...props}: IAIHomePageProps) => {
    // useEffect(()=>AISObject.loadPersonalHomePage(), [])
    return (
        <div {...props}>
            <AISearchString/>
            <MicoCardsField cards_id={AISObject.cardsIDArray} onCardSelect={onCardSelect}/>
        </div>
    )
})
