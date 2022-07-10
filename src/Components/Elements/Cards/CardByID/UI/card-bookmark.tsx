import {observer} from "mobx-react";
import React from 'react';
import {PaperProps} from "@mui/material/Paper/Paper";
import {Paper, Tooltip} from "@mui/material";
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import IconButton from "@mui/material/IconButton";
import {CardByIDStore} from "../Store/CardByIDStore";

interface ICardBookmarkProps extends PaperProps {
    card_store: CardByIDStore
}

const CardBookmark = observer(({card_store, ...props}: ICardBookmarkProps) => {
    const isBookmarked = card_store?.isBookmarked
    const addOrRemoveMarkText = !isBookmarked ? "Добавить в закладки" : "Удалить из закладок"

    return (
        <Paper elevation={0} {...props}>
            <Tooltip title={addOrRemoveMarkText}>
                <IconButton onClick={card_store.clickToBookmarkIcon}>
                    {isBookmarked ? <BookmarkIcon/> :
                        <BookmarkBorderIcon/>}
                </IconButton>
            </Tooltip>
        </Paper>
    )
})

export default CardBookmark
