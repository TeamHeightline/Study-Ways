import {observer} from "mobx-react";
import React from 'react';
import {PaperProps} from "@mui/material/Paper/Paper";
import {Button, Paper} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import {useHistory} from "react-router-dom";
import {isMobileHook} from "../../../../../CustomHooks/isMobileHook";


interface IGoBackButtonProps extends PaperProps {

}

const GoBackButton = observer(({...props}: IGoBackButtonProps) => {
    const history = useHistory()
    const isMobile = isMobileHook()
    return (
        <Paper elevation={0} {...props}>
            <Button
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
        </Paper>
    )
})

export default GoBackButton