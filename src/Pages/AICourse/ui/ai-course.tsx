import {observer} from "mobx-react";
import {Search} from "./search";
import {Flow} from "./map";
import {Box, CircularProgress, Fade, Stack} from "@mui/material";
import CardByID from "../../Cards/CardByID/UI/card-by-id";
import {AICourseStore} from "../model/store";
import {toJS} from "mobx";
import {AnimatedTitle} from "./animated-title";
import {CardsNotLoadedIndicator} from "./cards-not-loaded-indicator";


export const AiCourse = observer(() => {
    const cardID = toJS(AICourseStore.selectedCardId)
    const isSearchButtonClicked = toJS(AICourseStore.isSearchButtonClicked)

    const isDefaultCardsLoaded = toJS(AICourseStore.isDefaultCardsLoaded)

    if (!isSearchButtonClicked) {
        return (
            <Stack sx={{height: '80dvh'}} alignItems={'center'} justifyContent={'center'}>
                <AnimatedTitle/>
                <Search/>
                <CardsNotLoadedIndicator/>
            </Stack>
        )
    }

    if (!isDefaultCardsLoaded) {
        return (
            <Stack sx={{height: '90dvh'}} alignItems={'center'} justifyContent={'center'}>
                <CircularProgress/>
            </Stack>
        )
    }

    return (
        <Box sx={{overflowX: 'hidden'}}>
            <Stack justifyContent={'center'} alignItems={'center'} sx={{p: 1}}>
                <Search/>
            </Stack>
            <Fade in timeout={1000}>
                <div>
                    <Flow/>
                </div>
            </Fade>
            {cardID && <CardByID card_id={cardID}
                                 is_hidden_navigation={true}
                                 is_hidden_similar_cards={true}
                                 is_hidden_go_back_button={true}/>}
        </Box>
    )
})