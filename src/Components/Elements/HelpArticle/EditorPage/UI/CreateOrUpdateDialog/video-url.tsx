import {Box, Stack, TextField} from "@mui/material";
import {BoxProps} from "@mui/material/Box/Box";
import {useAppDispatch, useAppSelector} from "../../../../../../root-redux-store/RootStore";
import {changeCreateArticleData} from "../../redux-store";
import YouTubeIcon from '@mui/icons-material/YouTube';
import urlParser from "js-video-url-parser";

interface ITitleProps extends BoxProps {

}

export default function VideoUrl({...props}: ITitleProps) {
    const {
        video_url
    } = useAppSelector(store => store.helpArticleEditor.create_or_update_article_data)
    const dispatch = useAppDispatch()

    function handleChange(e) {
        const value = e.target.value || ""
        dispatch(changeCreateArticleData({
            field: "video_url",
            value
        }))
    }

    const isVideoURLNOTValid = !!video_url && !urlParser.parse(video_url)?.provider

    return (
        <Box {...props}>
            <Stack direction={"row"} sx={{mt: 1}} spacing={1} alignItems={"center"}>
                <YouTubeIcon fontSize="large"/>

                <TextField value={video_url} onChange={handleChange} variant={"outlined"}
                           sx={{width: 550}}
                           label={"Ссылка на видео"}
                           error={isVideoURLNOTValid}
                           helperText={isVideoURLNOTValid ? "Ссылка не распознана как видео-источник" : ""}
                >
                </TextField>
            </Stack>
        </Box>
    )
}
