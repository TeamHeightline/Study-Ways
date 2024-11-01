import {observer} from "mobx-react";
import React from 'react';
import {useNavigate} from "react-router-dom";
import {isMobileHook} from "../../../../../Shared/CustomHooks/isMobileHook";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import {Button} from "@mui/material";
import {CESObject} from "../Store/CardEditorStorage";

interface ICloseButtonProps extends React.HTMLAttributes<HTMLDivElement> {

}

export const UiCloseButton = observer(({...props}: ICloseButtonProps) => {
    const navigate = useNavigate();
    const isMobile = isMobileHook()
    return (
        <div {...props}>
            <Button
                fullWidth={isMobile}
                variant="outlined" color="primary"
                startIcon={<ArrowBackIcon/>}
                disabled={!CESObject.stateOfSave}
                onClick={() => {
                    navigate(-1)
                }}
            >
                Назад
            </Button>
        </div>
    )
})
