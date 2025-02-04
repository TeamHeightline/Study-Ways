import {observer} from "mobx-react";
import React, {useState} from 'react';
import {Box, Stack, ToggleButton, ToggleButtonGroup} from "@mui/material";
import {CESObject} from "../Store/CardEditorStorage";
import "js-video-url-parser/lib/provider/youtube";
import YouTubeIcon from '@mui/icons-material/YouTube';
import {UiYoutube} from "./ui-youtube";
import {UiVkVideo} from "./ui-vk-video";
import {UiRutube} from "./ui-rutube";
import {isMobileHook} from "../../../../../Shared/CustomHooks/isMobileHook";

interface IYouTubeVideoProps extends React.HTMLAttributes<HTMLDivElement> {

}

function getDefaultVideoMode() {
    const isHaveVKVideo = !!CESObject.getField("vk_video_url", "")
    return isHaveVKVideo ? 'VK' : 'Youtube'
}

export const UiVideo = observer(({...props}: IYouTubeVideoProps) => {
    const [videoHosting, setVideoHosting] = useState<'VK' | 'Youtube' | 'Rutube'>(() => getDefaultVideoMode())
    const isMobile = isMobileHook()

    return (
        <div {...props}>
            <Stack direction={'row'} spacing={1}>
                <Box sx={{
                    width: '100%',
                    pl: {xs: 6, md: 0},
                    display: 'flex',
                    flexDirection: 'column',
                    position: 'relative'
                }}>
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
                            left: {
                                md: -60,
                                xs: 0
                            },
                            top: 'calc(50% - 28px)',
                            transform: 'translate(0%, -50%)'
                        }}
                        size={isMobile ? 'small' : 'medium'}
                        exclusive
                        orientation={'vertical'}
                        onChange={(e, value) => setVideoHosting(value)}
                        value={videoHosting}>
                        <ToggleButton value="VK">VK</ToggleButton>
                        <ToggleButton value="Youtube"><YouTubeIcon/></ToggleButton>
                        <ToggleButton value="Rutube">RU</ToggleButton>
                    </ToggleButtonGroup>
                </Box>
            </Stack>


        </div>
    )
})
