import {observer} from "mobx-react";
import React, {useEffect} from 'react';
import {MicroCardField} from "./MicroCardField";
import {CleverSearching} from "./CleverSearching";
import {CSSObject} from "../Store/CardSelectorStore";
import {Stack} from "@mui/material";
import {HardLevel} from "./HardLevel";
import {ContentType} from "./ContentType";
import {ConnectedThemes} from "./ConnectedThemes";
import {Pages} from "./Pages";

interface ICardSelectorProps extends React.HTMLAttributes<HTMLDivElement>{
    mode?: "onlyCreatedByMe" | "standard";
    onCardSelect: (card_id: number) => void;
    showCreateNewCard?: boolean
}
export const CardSelector = observer(({onCardSelect, mode="standard", showCreateNewCard, ...props}: ICardSelectorProps) =>{
    useEffect(()=>CSSObject.setMode(mode), [mode])
    useEffect(()=> {
        if(CSSObject.selectedCardID){
            onCardSelect(Number(CSSObject.selectedCardID))
            CSSObject.selectedCardID=undefined
        }
    }, [CSSObject.selectedCardID])
    return(
        <div {...props}>
            <CleverSearching/>
            <Stack sx={{pt: 2, pr: 4, pl:4, pb:1}}
                   direction={{ xs: 'column', md: 'row' }}
                   spacing={{ xs: 1, md: 4 }}>
                <ConnectedThemes/>
                <HardLevel/>
                <ContentType/>
                <div/>
                <div/>
            </Stack>
            <MicroCardField showCreateNewCard={showCreateNewCard}/>
            <Pages/>
        </div>
    )
})