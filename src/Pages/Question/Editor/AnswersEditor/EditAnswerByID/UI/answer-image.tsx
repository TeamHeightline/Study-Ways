import {observer} from "mobx-react";
import React, {useState} from 'react';
import {PaperProps} from "@mui/material/Paper/Paper";
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Paper,
    Stack
} from "@mui/material";
import IconButton from "@mui/material/IconButton";
import ClearIcon from "@mui/icons-material/Clear";
import {EditAnswerByIdStore} from "../Store/edit-answer-by-id-store";


interface IAnswerImageProps extends PaperProps {
    answer_object: EditAnswerByIdStore

}

const AnswerImage = observer(({answer_object, ...props}: IAnswerImageProps) => {
    const [isOpenDeleteDialog, setOpenDeleteDialog] = useState(false)
    const closeDeleteDialog = () => {
        setOpenDeleteDialog(false)
    }
    const openDeleteDialog = () => {
        setOpenDeleteDialog(true)
    }

    const isImageDeleted = answer_object.answer_object?.isImageDeleted
    return (
        <Paper elevation={0} {...props}>
            <Stack direction={"row"} alignItems={"center"}>
                <Button
                    size={"small"}
                    color="primary"
                    variant="outlined"
                    component="label"
                >
                    <input type="file" hidden name="file"
                           onChange={(e: any) => {
                               if (answer_object.answer_object) {
                                   answer_object.answer_object.isImageDeleted = false
                                   answer_object.updateImage(e)
                               }
                           }}/>
                    Изображение для ответа
                </Button>
                <IconButton onClick={openDeleteDialog} disabled={!answer_object.imageName}>
                    <ClearIcon/>
                </IconButton>
            </Stack>

            <div>
                {!isImageDeleted && (answer_object?.imageName?.length > 30 ?
                    answer_object.imageName.slice(0, 20) + "..." : answer_object.imageName)}
            </div>

            <Dialog
                open={isOpenDeleteDialog}
                onClose={closeDeleteDialog}
            >
                <DialogTitle>
                    {"Удалить изображение для ответа?"}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Это действие невозможно отменить, изображение останется в файловом хранилище, но ответ
                        потеряет на него ссылку, если вы случайно открыли эту страницу, просто нажмите "Закрыть"
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => {
                        if (answer_object.answer_object) {
                            answer_object.answer_object.isImageDeleted = true
                            closeDeleteDialog()
                        }
                    }} variant={"outlined"} color={"secondary"}>Удалить</Button>
                    <Button onClick={closeDeleteDialog} autoFocus>
                        Закрыть
                    </Button>
                </DialogActions>
            </Dialog>
        </Paper>
    )
})

export default AnswerImage