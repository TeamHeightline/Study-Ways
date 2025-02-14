import {observer} from "mobx-react";
import React from 'react';
import {PaperProps} from "@mui/material/Paper/Paper";
import {Paper, TextField} from "@mui/material";
import {useDispatch, useSelector} from "react-redux";
import {changeExamName} from "../redux-store/examEditorSlice";
import {RootState} from "../../../../../App/ReduxStore/RootStore";


interface IExamNameProps extends PaperProps {

}

const ExamName = observer(({...props}: IExamNameProps) => {
    const examName = useSelector((state: RootState) => state?.examEditor?.exam_data?.name)
    const dispatch: any = useDispatch()
    return (
        <Paper elevation={0} {...props}>
            <TextField
                value={examName || ""}
                onChange={(e) =>
                    dispatch(changeExamName(e.target.value))}
                fullWidth
                variant="filled"
                multiline
                label={"Название экзамена"}/>
        </Paper>
    )
})

export default ExamName
