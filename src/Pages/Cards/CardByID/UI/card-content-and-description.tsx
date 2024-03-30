import {observer} from "mobx-react";
import React from 'react';
import {PaperProps} from "@mui/material/Paper/Paper";
import {Grid, Paper, Stack} from "@mui/material";
import CardMainContent from "./card-main-content";
import {CardByIDStore} from "../Store/CardByIDStore";
import CardDescription from "./card-description";
import CardGoToResource from "./card-go-to-resourse";
import TestBeforeCard from "./test-before-card";
import CardHistoryDrawer from "../../../CardHistory/UI/card-history-drawer";
import CardFindInCourse from "./card-find-in-course";
import {UserStorage} from "../../../../Store/UserStore/UserStore";


interface ICardContentAndDescriptionProps extends PaperProps {
    card_store: CardByIDStore

}

const CardContentAndDescription = observer(({card_store, ...props}: ICardContentAndDescriptionProps) => {
    return (
        <Paper elevation={0} {...props}>
            <Grid container spacing={1}>
                <Grid item xs={12} md={8}>
                    <CardMainContent card_store={card_store}/>
                    <CardDescription card_store={card_store}/>
                </Grid>
                <Grid item xs={12} md={4}>
                    <Stack direction={"column"} spacing={1}>
                        <TestBeforeCard card_store={card_store}/>
                        <CardFindInCourse card_store={card_store}/>
                        <CardGoToResource card_store={card_store}/>
                        {UserStorage.isLogin &&
                            <CardHistoryDrawer/>}
                    </Stack>
                </Grid>
            </Grid>
        </Paper>
    )
})

export default CardContentAndDescription
