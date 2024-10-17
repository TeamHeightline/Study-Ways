import {observer} from "mobx-react";
import {Search} from "./search";
import {Flow} from "./map";
import {Box, CircularProgress, Stack, Zoom} from "@mui/material";
import {useState} from "react";
import {getCardsBySearch} from "../model/api";
import {useQuery} from "@tanstack/react-query";
import CardByID from "../../Cards/CardByID/UI/card-by-id";
import {AICourseStore} from "../model/store";
import {toJS} from "mobx";

export const AiCourse = observer(() => {
    const cardID = toJS(AICourseStore.selectedCardId)
    const isSearchButtonClicked = toJS(AICourseStore.isSearchButtonClicked)

    const isDefaultCardsLoaded = toJS(AICourseStore.isDefaultCardsLoaded)

    if (!isSearchButtonClicked) {
        return (
            <Stack sx={{height: '80dvh', width: '100vw'}} alignItems={'center'} justifyContent={'center'}>
                <Search/>
            </Stack>
        )
    }

    if (!isDefaultCardsLoaded) {
        return (
            <Stack sx={{height: '90dvh', width: '100vw'}} alignItems={'center'} justifyContent={'center'}>
                <CircularProgress/>
            </Stack>
        )
    }

    return (
        <Box>
            <Stack justifyContent={'center'} alignItems={'center'} sx={{p: 1}}>
                <Search/>
            </Stack>
            <Zoom in timeout={1000}>
                <div>
                    <Flow/>
                </div>
            </Zoom>
            {cardID && <CardByID card_id={cardID}
                                 is_hidden_navigation={true}
                                 is_hidden_similar_cards={true}
                                 is_hidden_go_back_button={true}/>}
        </Box>
    )
})