import {observer} from "mobx-react";
import React from 'react';
import {Button} from "@mui/material";
import {useHistory} from "react-router-dom";
import {isMobileHook} from "../../../../../CustomHooks/isMobileHook";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import {ButtonProps} from "@mui/material/Button/Button";

interface IGoBackButtonProps extends ButtonProps {

}

const GoBackButton = observer(({...props}: IGoBackButtonProps) => {
    const history = useHistory()
    const isMobile = isMobileHook()
    return (
        <Button
            {...props}
            sx={{minWidth: isMobile ? "" : 300}}
            fullWidth={isMobile}
            startIcon={<ArrowBackIcon/>}
            variant="outlined"
            color="primary"
            onClick={() => {
                history.goBack()
            }}>
            Назад
        </Button>
    )
})

export default GoBackButton