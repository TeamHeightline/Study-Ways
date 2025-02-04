import {observer} from "mobx-react";
import React from 'react';
import {PaperProps} from "@mui/material/Paper/Paper";
import {Box, Paper} from "@mui/material";
import {CardByIDStore} from "../Store/CardByIDStore";
import VideoContent from "./video-content";
import CardImage from "./card-image";
import GoToTestButton from "./go-to-test-button";
import Card from "@mui/material/Card";


interface ICardMainContentProps extends PaperProps {
    card_store: CardByIDStore
}

const CardMainContent = observer(({card_store, ...props}: ICardMainContentProps) => {
    const isYoutubeContentType = card_store?.card_data?.card_content_type == 0
    const isRemoteResourceContentType = card_store?.card_data?.card_content_type == 1
    const isSimpleImageContentType = card_store?.card_data?.card_content_type == 2

    const isShowImageContent = isRemoteResourceContentType || isSimpleImageContentType

    return (
        <Box>
            <GoToTestButton card_store={card_store}/>
            <Box sx={{height: {xs: "53vw", md: 540}}} {...props}>
                {isYoutubeContentType &&
                    <VideoContent card_store={card_store}/>}
                {isShowImageContent &&
                    <CardImage card_store={card_store}/>
                }
            </Box>
        </Box>
    )
})

export default CardMainContent
