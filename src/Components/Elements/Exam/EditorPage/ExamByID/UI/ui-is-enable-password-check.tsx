import {Box, Checkbox, FormControlLabel} from "@mui/material";
import {BoxProps} from "@mui/material/Box/Box";
import React from "react";

interface IUIIsEnablePasswordCheckProps extends BoxProps {

}

export default function UIIsEnablePasswordCheck({...props}: IUIIsEnablePasswordCheckProps) {
    return (
        <Box {...props}>
            <FormControlLabel control={<Checkbox defaultChecked/>} label="Доступ оп паролю"/>
        </Box>
    )
}
