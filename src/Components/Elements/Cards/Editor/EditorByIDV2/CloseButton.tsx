import {observer} from "mobx-react";
import React from 'react';
import {useHistory} from "react-router-dom";
import {isMobileHook} from "../../../../../CustomHooks/isMobileHook";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import {Button} from "@mui/material";
import {CESObject} from "../../../../../Store/PrivateStorage/EditorsPage/CardEditorPage/CardEditorStorage";
interface ICloseButtonProps extends React.HTMLAttributes<HTMLDivElement>{

}
export const CloseButton = observer(({...props}: ICloseButtonProps) =>{
    const history = useHistory()
    const isMobile = isMobileHook()
    return(
        <div {...props}>
            <Button
                fullWidth={isMobile}
                variant="outlined" color="primary"
                startIcon={<ArrowBackIcon/>}
                disabled={!CESObject.stateOfSave}
                onClick={() => {history.goBack()}}
            >
                Назад
            </Button>
        </div>
    )
})
