import {Box, Card, Stack, Typography} from "@mui/material";
import {BoxProps} from "@mui/material/Box/Box";
import {useAppDispatch, useAppSelector} from "../../../../../../root-redux-store/RootStore";
import {changeCreateArticleData} from "../../redux-store";
import YouTubeIcon from '@mui/icons-material/YouTube';
import React from "react";
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import TextSnippetIcon from '@mui/icons-material/TextSnippet';
import {CKEditor} from '@ckeditor/ckeditor5-react'

interface ITitleProps extends BoxProps {

}

export default function Content({...props}: ITitleProps) {
    const {
        content
    } = useAppSelector(store => store.helpArticleEditor.create_article_data)
    const dispatch = useAppDispatch()

    function handleChange(event, editor) {
        const value = editor.getData() || ""
        dispatch(changeCreateArticleData({
            field: "content",
            value
        }))
    }


    return (
        <Box {...props}>
            <Stack direction={"row"} sx={{mt: 1}} spacing={1} alignItems={"center"}>
                <TextSnippetIcon fontSize="large"/>

                <Stack direction={"column"} spacing={1}>
                    <Card style={{borderColor: "#2296F3", color: "black"}} variant="outlined">
                        <div style={{maxHeight: 440, overflowY: "auto", overflowX: "hidden"}}>
                            <CKEditor
                                editor={ClassicEditor}
                                data={content}
                                onChange={handleChange}
                            />
                        </div>
                    </Card>
                    <Typography variant="caption">
                        Если вы вставляете текст и он имеет странный цвет, используйте не Ctrl+V, а Ctrl+Shift+V
                    </Typography>
                </Stack>
            </Stack>
        </Box>
    )
}
