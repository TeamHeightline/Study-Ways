import {observer} from "mobx-react";
import React from 'react';
import {PaperProps} from "@mui/material/Paper/Paper";
import {Paper, Rating} from "@mui/material";
import {CardByIDStore} from "../Store/CardByIDStore";


interface ICardRatingProps extends PaperProps {
    card_store: CardByIDStore
}

const CardRating = observer(({card_store, ...props}: ICardRatingProps) => {
    const isRatingExist = card_store.card_data?.isExistRating
    const rating = isRatingExist ? card_store.rating : 4.0
    return (
        <Paper elevation={0} {...props}>
            <Rating
                value={rating}
                onChange={(event, newValue) => {
                    card_store.setRating(newValue);
                }}
            />
        </Paper>
    )
})

export default CardRating
