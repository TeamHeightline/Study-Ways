import {observer} from "mobx-react";
import React from 'react';
import {CardByIDStoreObject} from "../Store/CardByIDStore";
import {Stack, Typography} from "@mui/material";
import {isMobileHook} from "../../../../../CustomHooks/isMobileHook";

interface ICardTitleProps extends React.HTMLAttributes<HTMLDivElement> {
    card_store: typeof CardByIDStoreObject
}

const CardTitleWithId = observer(({card_store, ...props}: ICardTitleProps) => {
    const isMobile = isMobileHook()

    const title = card_store?.card_data?.title
    const card_id = card_store?.card_data?.id

    return (
        <Stack direction={"row"}>
            <Typography
                component={'span'}
                // id={"card-title"}
                variant={isMobile ? "h6" : "h4"}>
                {title}
            </Typography>
            <Typography
                component={'span'}
                // id={"card-id"}
                variant={isMobile ? "subtitle2" : "subtitle1"}>
                {card_id}
            </Typography>
        </Stack>
    )
})

export default CardTitleWithId
