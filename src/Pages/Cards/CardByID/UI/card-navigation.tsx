import {observer} from "mobx-react";
import React from 'react';
import {PaperProps} from "@mui/material/Paper/Paper";
import {Grid, Paper} from "@mui/material";
import {CardByIDStore} from "../Store/CardByIDStore";
import CardAuthorNavigation from "./card-author-navigation";


interface ICardNavigationRatingFindProps extends PaperProps {
    card_store: CardByIDStore

}

const AuthorNavigation = observer(({card_store, ...props}: ICardNavigationRatingFindProps) => {
    return (
        <Paper elevation={0} {...props}>
            <Grid container>
                <Grid item xs={12} md={6}>
                    <CardAuthorNavigation card_store={card_store}/>
                </Grid>
            </Grid>
        </Paper>
    )
})

export default AuthorNavigation
