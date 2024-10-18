import {observer} from "mobx-react";
import React from 'react';
import {PaperProps} from "@mui/material/Paper/Paper";
import {Box, Grid, Paper, Stack} from "@mui/material";
import CardMainContent from "./card-main-content";
import {CardByIDStore} from "../Store/CardByIDStore";
import CardDescription from "./card-description";
import CardGoToResource from "./card-go-to-resourse";
import TestBeforeCard from "./test-before-card";
import CardHistoryDrawer from "../../../CardHistory/UI/card-history-drawer";
import CardFindInCourse from "./card-find-in-course";
import {UserStorage} from "../../../../Store/UserStore/UserStore";
import CardRating from "./card-rating";
import CardBookmark from "./card-bookmark";
import {useAuth0} from "@auth0/auth0-react";
import CardViews from "./card-views";


interface ICardContentAndDescriptionProps extends PaperProps {
    card_store: CardByIDStore

}

const CardContentAndDescription = observer(({card_store, ...props}: ICardContentAndDescriptionProps) => {
    const {isAuthenticated} = useAuth0();

    return (
        <Paper elevation={0} {...props}>
            <Grid container spacing={1}>
                <Grid item xs={12} md={6}>
                    <CardMainContent card_store={card_store}/>
                    <Stack direction={"row"} alignItems={"center"} justifyContent={"space-between"}>
                        <CardViews card_id={card_store.id}/>
                        <Box>
                            {isAuthenticated &&
                                <Stack direction={"row"} alignItems={"center"}>
                                    <CardRating card_store={card_store}/>
                                    <CardBookmark card_store={card_store}/>
                                </Stack>}
                        </Box>
                    </Stack>
                </Grid>
                <Grid item xs={12} md={6}>
                    <Stack direction={"column"} spacing={1}>
                        <TestBeforeCard card_store={card_store}/>
                        <CardGoToResource card_store={card_store}/>
                        {UserStorage.isLogin &&
                            <CardHistoryDrawer/>}
                        <CardDescription card_store={card_store}/>
                        <CardFindInCourse card_store={card_store}/>
                    </Stack>
                </Grid>
            </Grid>
        </Paper>
    )
})

export default CardContentAndDescription
