import {observer} from "mobx-react";
import React from 'react';
import {PaperProps} from "@mui/material/Paper/Paper";
import {Helmet} from "react-helmet";
import {CardByIDStore} from "../Store/CardByIDStore";

interface ICardBrowserIndexingProps extends PaperProps {
    card_store: CardByIDStore
}

const CardBrowserIndexing = observer(({card_store, ...props}: ICardBrowserIndexingProps) => {
    return (
        <>
            <Helmet>
                <title>{card_store.card_data?.title}</title>
                <meta name="description" content={card_store?.card_data?.text}/>
                <meta name="twitter:title" content={card_store.card_data?.title}/>
                <meta name="twitter:description" content={card_store?.card_data?.text}/>
                <meta property="og:title" content={card_store.card_data?.title}/>
                <meta property="og:description" content={card_store?.card_data?.text}/>
            </Helmet>
        </>
    )
})

export default CardBrowserIndexing
