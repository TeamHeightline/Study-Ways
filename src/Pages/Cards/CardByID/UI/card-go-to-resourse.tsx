import {observer} from "mobx-react";
import React from 'react';
import {PaperProps} from "@mui/material/Paper/Paper";
import {Alert, Box, Button, Paper} from "@mui/material";
import {CardByIDStore} from "../Store/CardByIDStore";
import Card from "@mui/material/Card";


interface ICardResourceIframeProps extends PaperProps {
    card_store: CardByIDStore
}

const CardGoToResource = observer(({card_store, ...props}: ICardResourceIframeProps) => {
    if (!card_store.card_data?.siteUrl) {
        return null
    }
    return (

        <Button
            // fullWidth
            variant="outlined"
            color="success"
            onClick={() => {
                window.open(card_store.card_data?.siteUrl, '_blank')
            }}>
            Перейти на ресурс, указанный в карточке.
        </Button>
    )
})

export default CardGoToResource
