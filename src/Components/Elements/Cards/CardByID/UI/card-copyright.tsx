import {observer} from "mobx-react";
import React from 'react';
import {Tooltip, Typography} from "@mui/material";
import CopyrightIcon from "@mui/icons-material/Copyright";
import {CardByIDStoreObject} from "../Store/CardByIDStore";

interface ICardCopyrightProps extends React.HTMLAttributes<HTMLDivElement>{
    card_store: typeof CardByIDStoreObject
}

const CardCopyright = observer(({card_store, ...props}: ICardCopyrightProps) =>{
    const copyright = card_store?.card_data?.copyright
    const showCopyright = card_store?.card_data?.isCardUseCopyright && copyright

    return(
        <div {...props}>
            {showCopyright &&
                <Typography variant="h6">
                    <Tooltip title={
                        <Typography>
                            {"Правообладателем изложенного материала является: " + copyright}
                        </Typography>}>
                        <CopyrightIcon/>
                    </Tooltip>
                    {copyright}
                </Typography>}
        </div>
    )
})

export default CardCopyright