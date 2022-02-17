import {observer} from "mobx-react";
import React from 'react';
import {PaperProps} from "@mui/material/Paper/Paper";
import ArtTrackIcon from "@mui/icons-material/ArtTrack";
import CardMicroView from "../../Cards/CardView/#CardMicroView";
import StepLabel from "@mui/material/StepLabel";


interface ICardElementProps extends PaperProps {
    DSObject: any,
    element: any,
    maxWidthOfElement: number
}

const CardElement = observer(({DSObject, element, maxWidthOfElement, ...props}: ICardElementProps) => {
    return (
        <StepLabel
            StepIconComponent={ArtTrackIcon}
            style={{width: maxWidthOfElement, height: 180}}
            onClick={() => {
                DSObject.openCardID = Number(element?.cardID)
                DSObject.openCard()
            }}>
            <div style={{textAlign: "left", marginLeft: (maxWidthOfElement - 400) / 2}}>
                <CardMicroView cardID={element.cardID}
                               onChange={() => {
                                   DSObject.openCardID = Number(element?.cardID)
                                   DSObject.openCard()
                               }}/>
            </div>
        </StepLabel>
    )
})

export default CardElement