import {observer} from "mobx-react";
import React from 'react';
import {Button} from "@mui/material";
import {useHistory} from "react-router-dom";

interface ICloseButtonProps extends React.HTMLAttributes<HTMLDivElement>{

}
export const CloseButton = observer(({...props}: ICloseButtonProps) =>{
    const history = useHistory();
    return(
        <div {...props}>
            <Button
                fullWidth
                variant="outlined" color="primary"
                onClick={() => {history.push(".")}}>
                Вернуться к выбору серии вопросов
            </Button>
        </div>
    )
})