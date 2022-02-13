import {observer} from "mobx-react";
import React from 'react';
import {PaperProps} from "@mui/material/Paper/Paper";
import {Grid, Paper, Stack} from "@mui/material";
import {CardByIDStoreObject} from "../Store/CardByIDStore";
import CardAuthorNavigation from "./card-author-navigation";
import CardRating from "./card-rating";
import CardFindInCourse from "./card-find-in-course";
import CardBookmark from "./card-bookmark";


interface ICardNavigationRatingFindProps extends PaperProps {
    card_store: typeof CardByIDStoreObject

}

const CardNavigationRatingFind = observer(({card_store, ...props}: ICardNavigationRatingFindProps) => {
    return (
        <Paper elevation={0} {...props}>
            <Grid container>
                <Grid item xs={12} md={6}>
                    <CardAuthorNavigation card_store={card_store}/>
                </Grid>
                <Grid item xs={12} md={6}>
                    <Stack direction={"row"} alignItems={"center"}>
                        <CardRating/>
                        <CardBookmark/>
                    </Stack>
                    <CardFindInCourse card_store={card_store}/>
                </Grid>
            </Grid>
        </Paper>
    )
})

export default CardNavigationRatingFind