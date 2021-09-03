import {observer} from "mobx-react";
import React from "react";
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';

export const AnswerDeleteDialog = observer(({answer}) =>{


    return(
        <div>
            <Dialog
                open={answer.openDeleteDialog}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">{"Вы уверены что хотите удалить ответ?"}</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        Это действие будет невозможно отменить, вы удалите этот ответ раз и навсегда, если вы случайно
                        открыли это меню, просто нажмите кнопку ОТМЕНА.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => answer.openDeleteDialog =! answer.openDeleteDialog} color="primary">
                        Отмена
                    </Button>
                    <Button onClick={() => {
                        answer.deleteAnswer()
                        answer.openDeleteDialog =! answer.openDeleteDialog
                    }} color="primary" autoFocus>
                        Удалить
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    )
})