import {observer} from "mobx-react";
import React from 'react';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import {CESObject} from "../../../../../Store/PrivateStorage/EditorsPage/CardEditorPage/CardEditorStorage";
import CardMicroView from "../../CardView/#CardMicroView";
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import ClearIcon from "@mui/icons-material/Clear";
import TransparentTooltip from "../../../../../CustomHooks/TransparentTooltip";

interface ISelectCardProps extends React.HTMLAttributes<HTMLDivElement>{
    card_direction: "cardBefore"| "cardDown" | "cardNext" | "cardUp"
}

export const SelectCard = observer(({card_direction, ...props}: ISelectCardProps) =>{
    const handleClickOpenSelectCard = () => {
        CESObject.onStartSelectCard(card_direction)
    };

    return(
        <div {...props}>
            <TransparentTooltip
                title={
                    CESObject.getField(card_direction, "") ?
                        <CardMicroView onChange={() => void(0)}
                                       cardID={CESObject.getField(card_direction, "")}/>
                         : ""}>
                <div>
                    <Button variant="outlined" onClick={handleClickOpenSelectCard}>
                        {CESObject.getField(card_direction, "") ?
                            "Выбрана карточка c ID:" + CESObject.getField(card_direction, ""):
                        "Нажмите для выбора карточки"}
                    </Button>
                    <IconButton
                        // sx={{ml: 2}}
                        onClick={()=>{CESObject.changeFieldByValue(card_direction, undefined)}}
                        size="small"
                        disabled={!CESObject.getField(card_direction, "")}>
                        <ClearIcon/>
                    </IconButton>
                    <IconButton
                        size="small"
                         onClick={() => window.open("https://www.sw-university.com/card/" +
                             CESObject.getField(card_direction, ""), "_blank")}
                         disabled={!CESObject.getField(card_direction, "")}>
                        <OpenInNewIcon />
                    </IconButton>

                </div>
            </TransparentTooltip>
        </div>
    )
})