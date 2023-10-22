import {observer} from "mobx-react";
import React from 'react';
import {PaperProps} from "@mui/material/Paper/Paper";
import {IconButton, Paper, Tooltip} from "@mui/material";
import ReportIcon from "@mui/icons-material/Report";
import {CheckAnswerByIdStore} from "../Store/check-answer-by-id-store";


interface IUICreateErrorReportProps extends PaperProps {
    answerStore: CheckAnswerByIdStore
}

const UICreateErrorReport = observer(({answerStore, ...props}: IUICreateErrorReportProps) => {
    return (
        <Paper elevation={0} {...props}>
            <Tooltip title={"Сообщить об ошибке в ответе"}>
                <IconButton onClick={() => answerStore.openAnswerReportDialog()}>
                    <ReportIcon fontSize={"large"}/>
                </IconButton>
            </Tooltip>
        </Paper>
    )
})

export default UICreateErrorReport
