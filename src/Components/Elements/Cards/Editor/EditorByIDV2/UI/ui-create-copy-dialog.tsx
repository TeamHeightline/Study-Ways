import {observer} from "mobx-react";
import React from 'react';
import {PaperProps} from "@mui/material/Paper/Paper";
import {Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Paper,} from "@mui/material";
import {CESObject} from "../Store/CardEditorStorage";
import CloseIcon from '@mui/icons-material/Close';
import AddIcon from '@mui/icons-material/Add';
import {LoadingButton} from "@mui/lab";
import {useNavigate} from "react-router-dom";

interface IUICreateCopyDialogProps extends PaperProps {

}

const UICreateCopyDialog = observer(({...props}: IUICreateCopyDialogProps) => {
    const navigate = useNavigate()
    const createCardCopy = async () => {
        CESObject.createCopyCard()
            .then((res) => {
                if (!!res?.data?.id) {
                    navigate("/editor/card2/card/" + res.data.id)
                }
            })
    }

    return (
        <Paper elevation={0} {...props}>
            <Dialog
                open={CESObject.isOpenCopyCardDialog}
                onClose={CESObject.closeCopyCardDialog}
            >
                <DialogTitle>
                    {"Создать копию?"}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Вы уверены, что хотите создать копию данной карточки?
                        Если вы согласитесь, то перейдете в редактор новой карточки.
                        О том, что она является копией можно узнать по приписки (копия).
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button
                        color={"error"}
                        onClick={CESObject.closeCopyCardDialog}
                        startIcon={<CloseIcon/>}>
                        Отмена
                    </Button>
                    <LoadingButton
                        loading={CESObject.isPendingCreateCopy}
                        onClick={createCardCopy}
                        autoFocus
                        startIcon={<AddIcon/>}
                    >
                        Создать
                    </LoadingButton>
                </DialogActions>
            </Dialog>
        </Paper>
    )
})

export default UICreateCopyDialog
