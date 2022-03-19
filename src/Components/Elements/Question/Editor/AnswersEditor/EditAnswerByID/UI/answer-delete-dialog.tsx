import {observer} from "mobx-react";
import React from 'react';
import {PaperProps} from "@mui/material/Paper/Paper";
import {Paper} from "@mui/material";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import {answer_object_type} from "../Store/edit-answer-by-id-store";


interface IAnswerDeleteDialogProps extends PaperProps {
    answer_object: answer_object_type

}

const AnswerDeleteDialog = observer(({answer_object, ...props}: IAnswerDeleteDialogProps) => {
    return (
        <Paper elevation={0} {...props}>
            <Dialog
                open={answer_object.isOpenDeleteDialog}
            >
                <DialogTitle>{"Вы уверены что хотите удалить ответ?"}</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Это действие будет невозможно отменить, вы удалите этот ответ раз и навсегда, если вы случайно
                        открыли это меню, просто нажмите кнопку ОТМЕНА.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => answer_object.isOpenDeleteDialog = !answer_object.isOpenDeleteDialog}
                            color="primary">
                        Отмена
                    </Button>
                    <Button onClick={() => {
                        answer_object.deleteAnswer()
                        answer_object.isOpenDeleteDialog = !answer_object.isOpenDeleteDialog
                    }} color="primary" autoFocus>
                        Удалить
                    </Button>
                </DialogActions>
            </Dialog>
        </Paper>
    )
})

export default AnswerDeleteDialog