import {Box, Checkbox, FormControlLabel} from "@mui/material";
import {BoxProps} from "@mui/material/Box/Box";
import React from "react";
import {useSelector} from "react-redux";
import {RootState, useAppDispatch} from "../../../../../ReduxStore/RootStore";
import {changeIsEnablePasswordCheck} from "../redux-store/examEditorSlice";

interface IUIIsEnablePasswordCheckProps extends BoxProps {

}

export default function UIIsEnablePasswordCheck({...props}: IUIIsEnablePasswordCheckProps) {
    const dispatch = useAppDispatch()
    const is_enable_password_check = useSelector((state: RootState) => state?.examEditor?.exam_data?.is_enable_password_check) || false;

    return (
        <Box {...props}>
            <FormControlLabel control={
                <Checkbox
                    onChange={() => {
                        dispatch(changeIsEnablePasswordCheck())
                    }}

                    checked={is_enable_password_check}
                />
            } label="Доступ оп паролю"/>
        </Box>
    )
}
