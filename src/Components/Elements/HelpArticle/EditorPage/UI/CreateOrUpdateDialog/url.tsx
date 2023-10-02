import {Box, Button, Stack, TextField} from "@mui/material";
import {BoxProps} from "@mui/material/Box/Box";
import {useAppDispatch, useAppSelector} from "../../../../../../root-redux-store/RootStore";
import {useState} from "react";
import {changeCreateArticleData} from "../../redux-store";
import LinkIcon from '@mui/icons-material/Link';

interface IURLProps extends BoxProps {

}

export default function URLInDialog({...props}: IURLProps) {
    const {
        url
    } = useAppSelector(store => store.helpArticleEditor.create_or_update_article_data)
    const dispatch = useAppDispatch()


    function handleChange(e) {
        let value = e.target.value || ""
        // От ссылки остается только путь на уровне сайта (то есть вырезается https://www.сайт.com) остается только /путь/к/странице
        // Из ссылки удаляется все, что находится после знака вопроса (то есть все GET параметры)
        try {
            const urlObj = new URL(value)
            value = urlObj.pathname
        } catch {
        }

        dispatch(changeCreateArticleData({
            field: "url",
            value
        }))
    }

    return (
        <Box {...props}>
            <Stack direction={"row"} sx={{mt: 1}} spacing={1} alignItems={"center"}>
                <LinkIcon fontSize="large"/>
                <TextField value={url} onChange={handleChange} variant={"filled"}
                           sx={{width: 550}}
                           label={"Относительная ссылка на страницу для которой создается статья"}>
                </TextField>
            </Stack>
        </Box>
    )
}
