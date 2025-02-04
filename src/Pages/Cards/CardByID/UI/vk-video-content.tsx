import {observer} from "mobx-react";
import React from "react";
import {isMobileHook} from "../../../../Shared/CustomHooks/isMobileHook";

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

interface Props {
    videoURL: string
}

export const VkVideoContent = observer((props: Props) => {
    const {videoURL} = props
    const isMobile = isMobileHook()

    return (
        <iframe src={getIframeURL(videoURL)}
                style={{
                    flex: 1, width: isMobile ? "95vw" : "auto",
                    height: isMobile ? "53vw" : 540,
                }}
                allow="autoplay; encrypted-media; fullscreen; picture-in-picture; screen-wake-lock;"
                frameBorder="0" allowFullScreen></iframe>
    )
})