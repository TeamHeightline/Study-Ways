import {observer} from "mobx-react";
import React from 'react';
import {PaperProps} from "@mui/material/Paper/Paper";
import {Paper} from "@mui/material";
import {CardByIDStoreObject} from "../Store/CardByIDStore";
import RichTextPreview from "../../CardView/#RichTextPreview";


interface ICardDescriptionProps extends PaperProps {
    card_store: typeof CardByIDStoreObject

}

const CardDescription = observer(({card_store, ...props}: ICardDescriptionProps) => {
    const description = card_store?.card_data?.text
    return (
        <Paper elevation={0} {...props}>
            <RichTextPreview text={description} onChange={() => void (0)}/>
        </Paper>
    )
})

export default CardDescription