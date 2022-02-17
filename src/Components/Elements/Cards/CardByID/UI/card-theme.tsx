import {observer} from "mobx-react";
import React from 'react';
import {PaperProps} from "@mui/material/Paper/Paper";
import {Paper, Stack,} from "@mui/material";
import {CardByIDStoreObject} from "../Store/CardByIDStore";
import AccountTreeIcon from '@mui/icons-material/AccountTree';
import ThemeWithAncestor from "./theme-with-ancestor";

interface ICardThemeProps extends PaperProps {
    card_store: typeof CardByIDStoreObject
}

const CardTheme = observer(({card_store, ...props}: ICardThemeProps) => {
    const isShowTheme = !!card_store?.card_data?.connectedTheme[0]?.id
    const themeArray = card_store?.card_data?.connectedTheme


    return (
        <Paper elevation={0} {...props}>
            {isShowTheme &&
                <Stack direction={"row"}>
                    <AccountTreeIcon/>
                    {themeArray?.map((theme) => {
                        return (
                            <ThemeWithAncestor
                                key={theme.id + "ThemeKey"}
                                themeObject={theme}
                                card_store={card_store}/>
                        )
                    })}
                </Stack>}
        </Paper>
    )
})

export default CardTheme