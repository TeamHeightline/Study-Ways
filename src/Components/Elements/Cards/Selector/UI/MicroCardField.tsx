import Grid from "@mui/material/Grid/Grid";
import {observer} from "mobx-react";
import React from 'react';
import {CSSObject} from "../Store/CardSelectorStore";
import CardMicroView from "../../CardView/#CardMicroView";
import {CreateCard} from "./CreateCard";

interface IMicroCardFieldProps extends React.HTMLAttributes<HTMLDivElement> {
    showCreateNewCard?: boolean
}

export const MicroCardField = observer(({showCreateNewCard, ...props}: IMicroCardFieldProps) => {
    return (
        <Grid container {...props} spacing={2} justifyContent="space-evenly">
            {showCreateNewCard &&
                <Grid item xs={12} md={"auto"}>
                    <CreateCard/>
                </Grid>}
            {CSSObject.cards_id_array?.map((card_id) => {
                return (
                    <Grid
                        key={card_id + "CardMicroView"}
                        item xs={12} md={"auto"} onClick={() => {
                        CSSObject.selectCard(card_id)
                    }}>
                        <CardMicroView cardID={Number(card_id)} onChange={() => void (0)}/>
                    </Grid>
                )
            })}
        </Grid>
    )
})