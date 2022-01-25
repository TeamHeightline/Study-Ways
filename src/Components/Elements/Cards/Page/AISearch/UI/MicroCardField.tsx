import {observer} from "mobx-react";
import React from 'react';
import {Grid} from "@mui/material";
import CardMicroView from "../../../CardView/#CardMicroView";

interface IMicoCardsFieldProps extends React.HTMLAttributes<HTMLDivElement>{
    cards_id: number[] | string[],
    onCardSelect: (card_id: number) => void;
}
export const MicoCardsField = observer(({cards_id, onCardSelect, ...props}: IMicoCardsFieldProps) =>{
    return(
        <Grid container {...props} spacing={2} justifyContent="space-evenly">
            {cards_id?.map((card_id) =>{
                return(
                    <Grid item xs={12} md={"auto"} onClick={()=>{onCardSelect(card_id)}}>
                        <CardMicroView cardID={Number(card_id)} onChange={() =>void(0)}/>
                    </Grid>
                )
            })}
        </Grid>
    )
})