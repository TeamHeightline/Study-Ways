import {observer} from "mobx-react";
import React, {useState} from 'react';
import {Stack, ToggleButton, ToggleButtonGroup} from "@mui/material";
import {CESObject} from "../Store/CardEditorStorage";
import "js-video-url-parser/lib/provider/youtube";
import YouTubeIcon from '@mui/icons-material/YouTube';
import {UiYoutube} from "./ui-youtube";
import {UiVkVideo} from "./ui-vk-video";
import {UiRutube} from "./ui-rutube";

interface IYouTubeVideoProps extends React.HTMLAttributes<HTMLDivElement> {

}

function getDefaultVideoMode() {
    const isHaveVKVideo = !!CESObject.getField("vk_video_url", "")
    return isHaveVKVideo ? 'VK' : 'Youtube'
}

export const UiVideo = observer(({...props}: IYouTubeVideoProps) => {
    const [videoHosting, setVideoHosting] = useState<'VK' | 'Youtube' | 'Rutube'>(() => getDefaultVideoMode())

    return (
        <div {...props}>
            <Stack direction={'row'} spacing={1}>
                <div style={{width: '100%', display: 'flex', flexDirection: 'column', position: 'relative'}}>
                    {
                        videoHosting === 'VK' ?
                            <UiVkVideo/> :
                            videoHosting === 'Youtube' ?
                                <UiYoutube/> :
                                <UiRutube/>
                    }
                    <ToggleButtonGroup
                        sx={{
                            position: 'absolute',
                            left: -60,
                            top: 'calc(50% - 28px)',
                            transform: 'translate(0%, -50%)'
                        }}
                        exclusive
                        orientation={'vertical'}
                        onChange={(e, value) => setVideoHosting(value)}
                        value={videoHosting}>
                        <ToggleButton value="VK">VK</ToggleButton>
                        <ToggleButton value="Youtube"><YouTubeIcon/></ToggleButton>
                        <ToggleButton value="Rutube">RU</ToggleButton>
                    </ToggleButtonGroup>
                </div>
            </Stack>


        </div>
    )
})
