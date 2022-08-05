import {Box, Checkbox, FormControlLabel} from "@mui/material";
import {BoxProps} from "@mui/material/Box/Box";
import React from "react";
import {RootState, useAppDispatch} from "../../../../../../root-redux-store/RootStore";
import {useSelector} from "react-redux";
import {changeIsEnableMaxQuestionAttempts} from "../redux-store/examEditorSlice";

interface IUIIsEnableMaxQuestionAttemptsProps extends BoxProps {

}

export default function UIIsEnableMaxQuestionAttempts({...props}: IUIIsEnableMaxQuestionAttemptsProps) {
    const dispatch = useAppDispatch()
    const is_enable_max_question_attempts = useSelector((state: RootState) => state?.examEditor?.exam_data?.is_enable_max_question_attempts) || false;

    return (
        <Box {...props}>
            <FormControlLabel control={<Checkbox
                onChange={() => {
                    dispatch(changeIsEnableMaxQuestionAttempts())
                }}
                checked={is_enable_max_question_attempts}/>}
                              label="Ограничить максимальное число попыток для каждого вопроса"/>
        </Box>
    )
}
