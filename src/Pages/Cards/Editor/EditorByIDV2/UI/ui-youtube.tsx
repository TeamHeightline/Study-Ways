import {observer} from "mobx-react";
import ReactPlayer from "react-player";
import {CESObject} from "../Store/CardEditorStorage";
import {TextField} from "@mui/material";
import urlParser from "js-video-url-parser";
import React from "react";
import {isMobileHook} from "../../../../../Shared/CustomHooks/isMobileHook";

export const UiYoutube = observer(() => {
    const isMobile = isMobileHook()

    return (
        <>
            <ReactPlayer controls
                         style={{marginTop: 8}}
                         url={CESObject.getField("video_url", "")}
                         height={isMobile ? window.innerWidth / 16 * 9 : 384}
                         width="100%"
            />
            <TextField
                sx={{mt: 1}}
                label="Ссылка на Youtube видео"
                fullWidth
                variant="filled"
                value={CESObject.getField("video_url", "")}
                onChange={CESObject.changeField("video_url")}
                error={CESObject.getField("video_url", "") !== "" &&
                    urlParser.parse(CESObject.getField("video_url", ""))?.provider == undefined}
                helperText={CESObject.getField("video_url", "") !== "" &&
                urlParser.parse(CESObject.getField("video_url", ""))?.provider == undefined ?
                    "Не распознано как ссылка на youtube" : ""}
            />
        </>
    )
})