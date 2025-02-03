import {observer} from "mobx-react";
import React, {useState} from 'react';
import ReactPlayer from "react-player";
import {Button, ButtonGroup, Stack, TextField, ToggleButton, ToggleButtonGroup} from "@mui/material";
import {isMobileHook} from "../../../../../Shared/CustomHooks/isMobileHook";
import {CESObject} from "../Store/CardEditorStorage";
import urlParser from "js-video-url-parser";
import "js-video-url-parser/lib/provider/youtube";
import YouTubeIcon from '@mui/icons-material/YouTube';
import {UiYoutube} from "./ui-youtube";
import {UiVkVideo} from "./ui-vk-video";
import {UiRutube} from "./ui-rutube";

interface IYouTubeVideoProps extends React.HTMLAttributes<HTMLDivElement> {

}

export const UiVideo = observer(({...props}: IYouTubeVideoProps) => {
    const [videoHosting, setVideoHosting] = useState<'VK' | 'Youtube' | 'Rutube'>('VK')

    return (
        <div {...props}>
            <Stack direction={'row'} spacing={1}>
                <Stack sx={{justifyContent: 'center'}}>
                    <ToggleButtonGroup
                        exclusive
                        size={'small'}
                        orientation={'vertical'}
                        onChange={(e, value) => setVideoHosting(value)}
                        value={videoHosting}>
                        <ToggleButton value="VK">VK</ToggleButton>
                        <ToggleButton value="Youtube"><YouTubeIcon/></ToggleButton>
                        <ToggleButton value="Rutube">RU</ToggleButton>
                    </ToggleButtonGroup>
                </Stack>
                <div style={{width: '100%', display: 'flex', flexDirection: 'column'}}>
                    {
                        videoHosting === 'VK' ?
                            <UiVkVideo/> :
                            videoHosting === 'Youtube' ?
                                <UiYoutube/> :
                                <UiRutube/>
                    }
                </div>
            </Stack>


        </div>
    )
})
