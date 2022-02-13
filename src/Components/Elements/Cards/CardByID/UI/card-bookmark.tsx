import {observer} from "mobx-react";
import React, {useState} from 'react';
import {PaperProps} from "@mui/material/Paper/Paper";
import {Paper, Tooltip} from "@mui/material";
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import IconButton from "@mui/material/IconButton";

interface ICardBookmarkProps extends PaperProps {

}

const CardBookmark = observer(({...props}: ICardBookmarkProps) => {
    const [isMarked, changeIsMarked] = useState(false)
    const addOrRemoveMarkText = !isMarked ? "Добавить в закладки" : "Удалить из закладок"

    return (
        <Paper elevation={0} {...props}>
            <Tooltip title={addOrRemoveMarkText}>
                <IconButton onClick={() => changeIsMarked(!isMarked)}>
                    {isMarked ? <BookmarkIcon/> :
                        <BookmarkBorderIcon/>}
                </IconButton>
            </Tooltip>
        </Paper>
    )
})

export default CardBookmark