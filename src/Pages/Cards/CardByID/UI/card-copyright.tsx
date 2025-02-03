import {observer} from "mobx-react";
import React from 'react';
import {Tooltip, Typography} from "@mui/material";
import CopyrightIcon from "@mui/icons-material/Copyright";
import {CardByIDStore} from "../Store/CardByIDStore";

interface ICardCopyrightProps extends React.HTMLAttributes<HTMLDivElement> {
    card_store: CardByIDStore
}

const CardCopyright = observer(({card_store, ...props}: ICardCopyrightProps) => {
    const copyright = card_store?.card_data?.copyright
    const showCopyright = card_store?.card_data?.is_card_use_copyright && copyright

    return (
        <div {...props}>
            {showCopyright &&
                <Typography variant="body2" sx={{hyphens: "auto", display: "flex", alignItems: "center"}}>
                    <Tooltip title={"Правообладателем изложенного материала является: " + copyright}>
                        <CopyrightIcon sx={{mr: 1}} fontSize={"small"}/>
                    </Tooltip>
                    {copyright}
                </Typography>}
        </div>
    )
})

export default CardCopyright
