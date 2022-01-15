import {observer} from "mobx-react";
import React from 'react';
import {Button} from "@mui/material";
import {SQSObject} from "../../../question-selector/Store/SelectQuestionStore";

interface ICloseButtonProps extends React.HTMLAttributes<HTMLDivElement>{

}
export const CloseButton = observer(({...props}: ICloseButtonProps) =>{
    return(
        <div {...props}>
            <Button
                fullWidth
                variant="outlined" color="primary"
                onClick={() => {SQSObject.sequenceHasBeenSelected = false}}>
                Вернуться к выбору серии вопросов
            </Button>
        </div>
    )
})