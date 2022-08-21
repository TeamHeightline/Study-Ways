import {observer} from "mobx-react";
import React from 'react';
import {Button, IconButton, Stack, Tooltip} from "@mui/material";
import {useLocation, useNavigate} from "react-router-dom";
import {isMobileHook} from "../../../../../CustomHooks/isMobileHook";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import {ButtonProps} from "@mui/material/Button/Button";
import HomeIcon from "@mui/icons-material/Home";

interface IGoBackButtonProps extends ButtonProps {

}

const GoBackButton = observer(({...props}: IGoBackButtonProps) => {
    const navigate = useNavigate();
    const isMobile = isMobileHook()
    const location = useLocation()
    return (
        <Stack direction={"row"} spacing={1}>
            <Button
                {...props}
                sx={{minWidth: isMobile ? "" : 300}}
                fullWidth={isMobile}
                startIcon={<ArrowBackIcon/>}
                variant="outlined"
                color="primary"
                onClick={() => {
                    navigate(-1)
                }}>
                Назад
            </Button>
            {location.pathname === "/course" &&
                <Tooltip title={"К поиску курсов"}>
                    <IconButton color={"info"} onClick={() => {
                        navigate("/courses")
                    }}>
                        <HomeIcon/>
                    </IconButton>
                </Tooltip>
            }

        </Stack>
    )
})

export default GoBackButton
