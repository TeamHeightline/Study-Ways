import {Box, Checkbox, FormControlLabel} from "@mui/material";
import {BoxProps} from "@mui/material/Box/Box";
import React from "react";
import {RootState, useAppDispatch} from "../../../../../ReduxStore/RootStore";
import {useSelector} from "react-redux";
import {changeIsEnableHelpText} from "../redux-store/examEditorSlice";

interface IUIIsEnableHelpTextProps extends BoxProps {

}

export default function UIIsEnableHelpText({...props}: IUIIsEnableHelpTextProps) {
    const is_enable_help_text = useSelector((state: RootState) => state?.examEditor?.exam_data?.is_enable_help_text) || false;
    const dispatch = useAppDispatch()

    return (
        <Box {...props}>
            <FormControlLabel control={
                <Checkbox
                    onChange={() => {
                        dispatch(changeIsEnableHelpText())
                    }}
                    checked={is_enable_help_text}/>
            } label="Включить подсказки"/>
        </Box>
    )
}
