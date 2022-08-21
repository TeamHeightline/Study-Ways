import {observer} from "mobx-react";
import React from 'react';
import {PaperProps} from "@mui/material/Paper/Paper";
import {Paper, Tooltip, Typography} from "@mui/material";
import {CardByIDStore} from "../Store/CardByIDStore";
import {UnstructuredThemesNode} from "../../../../../SchemaTypes";


interface IThemeWithAncestorProps extends PaperProps {
    card_store: CardByIDStore
    themeObject: UnstructuredThemesNode
}

const ThemeWithAncestor = observer(({themeObject, card_store, ...props}: IThemeWithAncestorProps) => {
    return (
        <Paper elevation={0} {...props}>
            <Tooltip
                title={
                    <Typography>
                        {card_store
                            .onThemeHover(String(themeObject.id))
                            ?.map((theme) => theme?.text)
                            ?.join(" / ")}
                    </Typography>}>
                <Typography sx={{hyphens: "auto"}}>
                    {themeObject.text}
                </Typography>
            </Tooltip>
        </Paper>
    )
})

export default ThemeWithAncestor
