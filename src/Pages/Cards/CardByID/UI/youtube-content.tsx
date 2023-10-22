import {observer} from "mobx-react";
import React from 'react';
import {PaperProps} from "@mui/material/Paper/Paper";
import {Paper} from "@mui/material";
import {CardByIDStore} from "../Store/CardByIDStore";
import ReactPlayer from "react-player";
import {isMobileHook} from "../../../../CustomHooks/isMobileHook";
import GoToTestDialog from "./go-to-test-dialog";


interface IYoutubeContentProps extends PaperProps {
    card_store: CardByIDStore

}

const YoutubeContent = observer(({card_store, ...props}: IYoutubeContentProps) => {
    const youtubeVideoURL = String(card_store?.card_data?.videoUrl)
    const showVideo = youtubeVideoURL !== "null"
    const isMobile = isMobileHook()
    const onEndVideoWatch = () => {
        card_store.isOpenGoToTestDialogAfterVideo = true
    }

    const test_after_card_id = card_store.card_data?.testInCard?.id

    return (
        <Paper elevation={0} {...props}>
            <div style={{position: "relative"}}>
                <div style={{
                    position: "absolute", left: 0,
                    right: 0
                }}>
                    {showVideo &&
                        <ReactPlayer width="auto"
                                     height={isMobile ? 200 : 540}
                                     controls
                                     url={youtubeVideoURL}
                                     onEnded={onEndVideoWatch}
                        />
                    }
                </div>
                {card_store.card_data?.isCardUseTestInCard && card_store.isOpenGoToTestDialogAfterVideo && test_after_card_id &&
                    <div style={{
                        position: "absolute", left: 0,
                        right: 0, zIndex: 1
                    }}>
                        <GoToTestDialog card_store={card_store}/>
                    </div>}
            </div>

        </Paper>
    )
})

export default YoutubeContent
