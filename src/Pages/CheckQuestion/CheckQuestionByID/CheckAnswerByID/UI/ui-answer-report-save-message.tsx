import {observer} from "mobx-react";
import React from 'react';
import {PaperProps} from "@mui/material/Paper/Paper";
import {Alert, Paper, Snackbar} from "@mui/material";
import {CheckAnswerByIdStore} from "../Store/check-answer-by-id-store";


interface IUIAnswerReportSaveMessageProps extends PaperProps {
    answerStore: CheckAnswerByIdStore
}

const UIAnswerReportSaveMessage = observer(({answerStore, ...props}: IUIAnswerReportSaveMessageProps) => {
    return (
        <Paper elevation={0} {...props}>
            <Snackbar open={answerStore.answerReportSavedMessageArray.length > 0} autoHideDuration={6000}
                      onClose={answerStore.removeAnswerReportSavedMessage}>
                <div>
                    {answerStore?.answerReportSavedMessageArray?.map((isSuccess, index) =>
                        <Alert severity={isSuccess ? "success" : "error"}
                               sx={{width: '100%'}}
                               key={index}
                               variant={"filled"}>
                            {isSuccess ? "Отчет об ошибке отправлен" : "Ошибка при отправке отчета об ошибке"}
                        </Alert>
                    )
                    }
                </div>
            </Snackbar>
        </Paper>
    )
})

export default UIAnswerReportSaveMessage
