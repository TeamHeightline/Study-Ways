import {observer} from "mobx-react";
import React from 'react';
import {PaperProps} from "@mui/material/Paper/Paper";
import {Paper} from "@mui/material";
import {CardByIDStoreObject} from "../Store/CardByIDStore";
import ReactPlayer from "react-player";
import {isMobileHook} from "../../../../../CustomHooks/isMobileHook";


interface IYoutubeContentProps extends PaperProps{
    card_store: typeof CardByIDStoreObject

}

const YoutubeContent = observer(({card_store, ...props}: IYoutubeContentProps) =>{
    const youtubeVideoURL = String(card_store?.card_data?.videoUrl)
    const showVideo = youtubeVideoURL !== "null"
    const isMobile = isMobileHook()
    return(
        <Paper elevation={0} {...props}>
            {showVideo &&
                <ReactPlayer width="auto"
                             height={isMobile ? 200 : 480}
                             controls
                             url={youtubeVideoURL}
                />}
        </Paper>
    )
})

export default YoutubeContent