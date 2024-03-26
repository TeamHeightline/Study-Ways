import {observer} from "mobx-react";
import React from 'react';
import {PaperProps} from "@mui/material/Paper/Paper";
import {Grid, Paper, Stack, Typography} from "@mui/material";
import {CardByIDStore} from "../Store/CardByIDStore";
import CardMicroView from "../../CardMicroView";
import {useNavigate} from "react-router-dom";


interface ISimilarCardsProps extends PaperProps {
    card_store: CardByIDStore

}

const SimilarCards = observer(({card_store, ...props}: ISimilarCardsProps) => {
    const navigate = useNavigate()

    const onCardClick = (cardID) => () => {
        window.scrollTo(0, 0);
        navigate("/card/" + cardID)
    }
    return (
        <Paper elevation={0} {...props}>
            <Stack alignItems={"center"} sx={{mt: 2}}>
                <Typography variant={"h3"}>
                    Похожие карточки
                </Typography>
            </Stack>
            <Grid container spacing={2} justifyContent={"space-around"}>
                {card_store.similarCardsID?.map((cardID) =>
                    <Grid item xs={12} sm={6} md={"auto"} key={cardID}>
                        <CardMicroView cardID={Number(cardID)} onClick={onCardClick(cardID)} onChange={() => {
                        }}/>
                    </Grid>
                )}
            </Grid>
        </Paper>
    )
})

export default SimilarCards
