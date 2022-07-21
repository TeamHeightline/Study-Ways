import {observer} from "mobx-react";
import React from 'react';
import {PaperProps} from "@mui/material/Paper/Paper";
import {Paper} from "@mui/material";
import {CardByIDStore} from "../Store/CardByIDStore";


interface ICardDescriptionProps extends PaperProps {
    card_store: CardByIDStore

}

const CardDescription = observer(({card_store, ...props}: ICardDescriptionProps) => {
    const description = card_store?.card_data?.text
    return (
        <Paper elevation={0} {...props}>
            {description &&
                <div dangerouslySetInnerHTML={{__html: description}}/>}
        </Paper>
    )
})

export default CardDescription
