import {observer} from "mobx-react";
import React from 'react';
import {CardByIDStore} from "../Store/CardByIDStore";
import {Chip, Stack, Typography} from "@mui/material";
import {isMobileHook} from "../../../../Shared/CustomHooks/isMobileHook";

interface ICardTitleProps extends React.HTMLAttributes<HTMLDivElement> {
    card_store: CardByIDStore
}

const CardTitleWithId = observer(({card_store, ...props}: ICardTitleProps) => {
    const isMobile = isMobileHook()

    const title = card_store?.card_data?.title
    const card_id = card_store?.card_data?.id

    return (
        <Typography
            component={"div"}
            variant={"h5"}>
            {title}
            <Chip sx={{ml: 1}} label={card_id} variant={"outlined"} color={"info"} size={"small"}/>
        </Typography>
    )
})

export default CardTitleWithId
