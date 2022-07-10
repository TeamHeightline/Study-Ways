import {observer} from "mobx-react";
import React from 'react';
import {PaperProps} from "@mui/material/Paper/Paper";
import {Grid, Paper} from "@mui/material";
import CardMainContent from "./card-main-content";
import {CardByIDStore} from "../Store/CardByIDStore";
import CardDescription from "./card-description";


interface ICardContentAndDescriptionProps extends PaperProps {
    card_store: CardByIDStore

}

const CardContentAndDescription = observer(({card_store, ...props}: ICardContentAndDescriptionProps) => {
    return (
        <Paper elevation={0} {...props}>
            <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                    <CardMainContent card_store={card_store}/>
                </Grid>
                <Grid item xs={12} md={6}>
                    <CardDescription card_store={card_store}/>
                </Grid>
            </Grid>
        </Paper>
    )
})

export default CardContentAndDescription
