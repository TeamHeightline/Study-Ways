import {observer} from "mobx-react";
import React from 'react';
import {PaperProps} from "@mui/material/Paper/Paper";
import {Paper, TextField} from "@mui/material";
import {RootState} from "../../../../../../redux-store/RootReducer";
import {useSelector} from "react-redux";


interface IExamNameProps extends PaperProps {

}

const ExamName = observer(({...props}: IExamNameProps) => {
    const examName = useSelector((state: RootState) => state.examEditorReducer.exam_data.name)
    return (
        <Paper elevation={0} {...props}>
            <TextField
                value={examName}
                fullWidth
                variant="filled"
                multiline
                label={"Название экзамена"}/>
        </Paper>
    )
})

export default ExamName
