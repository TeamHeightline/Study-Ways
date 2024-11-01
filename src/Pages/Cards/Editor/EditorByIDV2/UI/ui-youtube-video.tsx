import {observer} from "mobx-react";
import React from 'react';
import ReactPlayer from "react-player";
import {TextField} from "@mui/material";
import {isMobileHook} from "../../../../../Shared/CustomHooks/isMobileHook";
import {CESObject} from "../Store/CardEditorStorage";
import urlParser from "js-video-url-parser";
import "js-video-url-parser/lib/provider/youtube";

interface IYouTubeVideoProps extends React.HTMLAttributes<HTMLDivElement> {

}

export const UiYoutubeVideo = observer(({...props}: IYouTubeVideoProps) => {
    const isMobile = isMobileHook()
    return (
        <div {...props}>
            <ReactPlayer controls
                         url={CESObject.getField("videoUrl", "")}
                         height={isMobile ? window.innerWidth / 16 * 9 : 384}
                         width="100%"
            />
            <TextField
                sx={{mt: 1}}
                label="Ссылка на видео на Youtube"
                fullWidth
                variant="filled"
                value={CESObject.getField("videoUrl", "")}
                onChange={CESObject.changeYoutubeUrl}
                error={CESObject.getField("videoUrl", "") !== "" &&
                    urlParser.parse(CESObject.getField("videoUrl", ""))?.provider == undefined}
                helperText={CESObject.getField("videoUrl", "") !== "" &&
                urlParser.parse(CESObject.getField("videoUrl", ""))?.provider == undefined ?
                    "Ссылка не распознана как видео-источник" : ""}
            />

        </div>
    )
})
