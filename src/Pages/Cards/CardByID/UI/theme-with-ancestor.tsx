import {observer} from "mobx-react";
import React from 'react';
import {PaperProps} from "@mui/material/Paper/Paper";
import {Paper, Tooltip, Typography} from "@mui/material";
import {CardByIDStore} from "../Store/CardByIDStore";
import {UnstructuredThemesNode} from "../../../../SchemaTypes";
import {CardsUnstructuredtheme} from "../TYPES/card-data";


interface IThemeWithAncestorProps extends PaperProps {
    card_store: CardByIDStore
    theme: CardsUnstructuredtheme
}

const ThemeWithAncestor = observer(({theme, card_store, ...props}: IThemeWithAncestorProps) => {
    return (
        <Paper elevation={0} {...props}>
            <Tooltip
                title={card_store
                    .onThemeHover(String(theme.id))
                    ?.map((theme) => theme?.text)
                    ?.join(" / ")}>
                <Typography sx={{hyphens: "auto"}} variant={"body2"}>
                    {theme.text}
                </Typography>
            </Tooltip>
        </Paper>
    )
})

export default ThemeWithAncestor
