import {observer} from "mobx-react";
import React from 'react';
import {PaperProps} from "@mui/material/Paper/Paper";
import {Paper, Tooltip, Typography} from "@mui/material";
import {CardByIDStoreObject} from "../Store/CardByIDStore";
import AccountTreeIcon from '@mui/icons-material/AccountTree';

interface ICardThemeProps extends PaperProps {
    card_store: typeof CardByIDStoreObject
}

const CardTheme = observer(({card_store, ...props}: ICardThemeProps) => {
    const isShowTheme = !!card_store?.card_data?.connectedTheme[0]?.id
    const themeArray = card_store?.card_data?.connectedTheme
    const themesText = themeArray
        ?.map((theme) => theme?.text)
        .join(", ")
    const isThemesManyThenTwo = card_store?.card_data?.connectedTheme
        && card_store?.card_data?.connectedTheme?.length > 2
    const youCanFindThisCardText = !isThemesManyThenTwo ?
        "Эту карточку можно найти в теме: " :
        "Эту карточку можно найти в темах: "

    return (
        <Paper elevation={0} {...props}>
            {isShowTheme &&
                <Typography variant="h6">
                    <Tooltip title={
                        <Typography>
                            {youCanFindThisCardText + themesText}
                        </Typography>}>
                        <AccountTreeIcon/>
                    </Tooltip>
                    {themesText}
                </Typography>}
        </Paper>
    )
})

export default CardTheme