import {observer} from "mobx-react";
import React from 'react';
import {PaperProps} from "@mui/material/Paper/Paper";
import {Grid, Paper, Stack} from "@mui/material";
import {CardByIDStore} from "../Store/CardByIDStore";
import CardAuthorNavigation from "./card-author-navigation";
import CardRating from "./card-rating";
import CardFindInCourse from "./card-find-in-course";
import CardBookmark from "./card-bookmark";
import {useAuth0} from "@auth0/auth0-react";


interface ICardNavigationRatingFindProps extends PaperProps {
    card_store: CardByIDStore

}

const CardNavigationRatingFind = observer(({card_store, ...props}: ICardNavigationRatingFindProps) => {
    const {isAuthenticated} = useAuth0();
    return (
        <Paper elevation={0} {...props}>
            <Grid container>
                <Grid item xs={12} md={6}>
                    <CardAuthorNavigation card_store={card_store}/>
                </Grid>
                <Grid item xs={12} md={6}>
                    {isAuthenticated &&
                        <Stack direction={"row"} alignItems={"center"}>
                            <CardRating card_store={card_store}/>
                            <CardBookmark card_store={card_store}/>
                        </Stack>}
                    <CardFindInCourse card_store={card_store}/>
                </Grid>
            </Grid>
        </Paper>
    )
})

export default CardNavigationRatingFind
