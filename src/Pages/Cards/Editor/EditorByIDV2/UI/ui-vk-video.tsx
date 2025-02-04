import {observer} from "mobx-react";
import {CESObject} from "../Store/CardEditorStorage";
import {Alert, AlertTitle, Card, Stack, TextField} from "@mui/material";
import React from "react";
import {isMobileHook} from "../../../../../Shared/CustomHooks/isMobileHook";


function getIframeURL(vkVideoURL) {
    if (!vkVideoURL) {
        return ''
    }
    const oidAndID = vkVideoURL.split('/video')[1]
    if (!oidAndID) {
        return ''
    }
    const oid = oidAndID.split('_')[0]
    const id = oidAndID.split('_')[1]

    return `https://vk.com/video_ext.php?oid=${oid}&id=${id}&hd=2`
}

export const UiVkVideo = observer(() => {
    const isMobile = isMobileHook()
    const value = CESObject.getField("vk_video_url", "")
    const iFrameUrl = getIframeURL(value)
    return (
        <div>
            {!!iFrameUrl ?
                <iframe src={getIframeURL(value)} width="100%"
                        height={isMobile ? window.innerWidth / 16 * 9 : 384}
                        allow="autoplay; encrypted-media; fullscreen; picture-in-picture;" frameBorder="0"
                        allowFullScreen></iframe> :

                <Card variant={'outlined'} sx={{
                    height: isMobile ? window.innerWidth / 16 * 9 : 390,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}>
                    <div style={{width: '75%'}}>
                        <Alert severity={'info'} variant={'outlined'}>
                            <AlertTitle>Внимание</AlertTitle>
                            Ссылка на видео VK должна быть вида https://vkvideo.ru/video4604580_456240803
                        </Alert>
                    </div>
                </Card>

            }
            <TextField
                sx={{mt: 1}}
                label="Ссылка на VK video"
                fullWidth
                variant="filled"
                onChange={CESObject.changeField("vk_video_url")}
                value={CESObject.getField("vk_video_url", "")}
            />
        </div>
    )
})