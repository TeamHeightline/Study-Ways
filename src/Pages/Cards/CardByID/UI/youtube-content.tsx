import {observer} from "mobx-react";
import React from 'react';
import {PaperProps} from "@mui/material/Paper/Paper";
import {Paper} from "@mui/material";
import {CardByIDStore} from "../Store/CardByIDStore";
import ReactPlayer from "react-player";
import {isMobileHook} from "../../../../Shared/CustomHooks/isMobileHook";
import GoToTestDialog from "./go-to-test-dialog";


interface IYoutubeContentProps extends PaperProps {
    card_store: CardByIDStore

}

function getVkVideoIframeUrl(defaultVideoURL: string) {
    const iframeTransformedURL = defaultVideoURL.split('video')?.[1].split('_')
    const oid = iframeTransformedURL[0]
    const id = iframeTransformedURL[1]
    const iframeVideoURL = `https://vk.com/video_ext.php?oid=${oid}&id=${id}hd=1&autoplay=1`
    return iframeVideoURL
}

const YoutubeContent = observer(({card_store, ...props}: IYoutubeContentProps) => {
    const youtubeVideoURL = card_store?.card_data?.video_url || ""
    const showVideo = !!youtubeVideoURL
    const isMobile = isMobileHook()

    // TODO когда в редакторе карточек закончу с добавлением типа карточки VK, нужно вернуться к этому месту
    const vkVideoUrl = 'https://vk.com/video4604580_456240597'
    const isVkVideo = false

    const onEndVideoWatch = () => {
        card_store.isOpenGoToTestDialogAfterVideo = true
    }

    const test_after_card_id = card_store.card_data?.test_in_card_id

    return (
        <Paper elevation={0} {...props}>
            <div style={{position: "relative"}}>
                <div style={{
                    position: "absolute", left: 0,
                    right: 0,
                    width: isMobile ? "95vw" : "auto",
                    height: isMobile ? "53vw" : 540,
                    display: 'flex'
                }}>
                    {isVkVideo ?
                        <iframe src={getVkVideoIframeUrl(vkVideoUrl)}
                                style={{flex: 1}}
                                allow="autoplay; encrypted-media; fullscreen; picture-in-picture; screen-wake-lock;"
                                frameBorder="0" allowFullScreen></iframe> :
                        showVideo ?
                            <ReactPlayer
                                // style={{flex: 1}}
                                width={isMobile ? "95vw" : "100%"}
                                height={isMobile ? "53vw" : 540}
                                controls
                                url={youtubeVideoURL}
                                onEnded={onEndVideoWatch}
                            /> : null
                    }
                </div>
                {card_store.card_data?.is_card_use_test_in_card && card_store.isOpenGoToTestDialogAfterVideo && test_after_card_id &&
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
