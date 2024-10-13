import {observer} from "mobx-react";
import {Search} from "./search";
import {Flow} from "./map";
import {Box, Stack} from "@mui/material";
import {useState} from "react";
import {getCardsBySearch} from "../model/api";
import {useQuery} from "@tanstack/react-query";
import CardByID from "../../Cards/CardByID/UI/card-by-id";
import {AICourseStore} from "../model/store";
import {toJS} from "mobx";

export const AiCourse = observer(() => {
    const cardID = toJS(AICourseStore.selectedCardId)
    return (
        <Box>
            <Stack justifyContent={'center'} alignItems={'center'} sx={{p: 1}}>
                <Search/>
            </Stack>
            <Flow/>
            {cardID && <CardByID card_id={cardID}
                                 is_hidden_navigation={true}
                                 is_hidden_similar_cards={true}
                                 is_hidden_go_back_button={true}/>}
        </Box>
    )
})