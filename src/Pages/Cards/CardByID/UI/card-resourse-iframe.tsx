import {observer} from "mobx-react";
import React from 'react';
import {PaperProps} from "@mui/material/Paper/Paper";
import {Paper} from "@mui/material";
import {CardByIDStore} from "../Store/CardByIDStore";


interface ICardResourceIframeProps extends PaperProps {
    card_store: CardByIDStore
}

const CardResourceIframe = observer(({card_store, ...props}: ICardResourceIframeProps) => {
    return (
        <Paper elevation={0} {...props}>
            {
                card_store.card_data?.cardContentType === "A_1" && card_store?.card_data?.siteUrl &&
                <iframe
                    width={'100%'}
                    height={window.innerHeight}
                    
                    src={card_store.card_data?.siteUrl}
                />
            }
        </Paper>
    )
})

export default CardResourceIframe
