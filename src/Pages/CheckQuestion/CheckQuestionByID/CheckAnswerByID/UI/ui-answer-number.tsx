import {observer} from "mobx-react";
import React from 'react';
import {PaperProps} from "@mui/material/Paper/Paper";
import {Paper, Typography} from "@mui/material";


interface IUIAnswerNumberProps extends PaperProps {
    answerIndex: number
}

const UIAnswerNumber = observer(({answerIndex, ...props}: IUIAnswerNumberProps) => {
    return (
        <Paper elevation={0} {...props}>
            <Typography variant={"h4"}>
                Ответ №{answerIndex + 1}
            </Typography>
        </Paper>
    )
})

export default UIAnswerNumber