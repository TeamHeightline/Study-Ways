import {observer} from "mobx-react";
import React from 'react';
import {PaperProps} from "@mui/material/Paper/Paper";
import {Paper} from "@mui/material";
import {CardByIDStore} from "../Store/CardByIDStore";
import {MainDirection} from "../../../Direction/UI/MainDirection";


interface ISimilarCardsProps extends PaperProps {
    card_store: CardByIDStore

}

const SimilarCards = observer(({card_store, ...props}: ISimilarCardsProps) => {
    return (
        <Paper elevation={0} {...props}>
            {card_store.dataForDirection &&
                <MainDirection directionDataProps={card_store.dataForDirection}/>}
        </Paper>
    )
})

export default SimilarCards
