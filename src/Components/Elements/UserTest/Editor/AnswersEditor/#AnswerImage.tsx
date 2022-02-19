import {observer} from "mobx-react";
import React, {useState} from "react";
import {Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Stack} from "@mui/material";
import ClearIcon from "@mui/icons-material/Clear";
import IconButton from "@mui/material/IconButton";
import {
    AnswerStorageType
} from "../../../../../Store/PrivateStorage/EditorsPage/QuestionEditorPage/AnswersStorage";

type AnswerImageProp = {
    answer: AnswerStorageType
}


export const AnswerImage = observer(({answer}: AnswerImageProp) => {
    const [isOpenDeleteDialog, setOpenDeleteDialog] = useState(false)
    const closeDeleteDialog = () => {
        setOpenDeleteDialog(false)
    }
    const openDeleteDialog = () => {
        setOpenDeleteDialog(true)
    }
    return (
        <>
            <Stack direction={"row"} alignItems={"center"}>
                <Button
                    color="primary"
                    variant="outlined"
                    component="label"
                >
                    <input type="file" hidden name="file"
                           onChange={(e: any) => {
                               answer.isImageDeleted = false
                               answer.updateImage(e)
                           }}/>
                    Изображение для ответа
                </Button>
                <IconButton onClick={openDeleteDialog}>
                    <ClearIcon/>
                </IconButton>
            </Stack>

            <div>
                {!answer.isImageDeleted && (answer?.imageName?.length > 30 ? answer.imageName.slice(0, 27) + "..." : answer.imageName)}
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
                        answer.isImageDeleted = true
                        closeDeleteDialog()
                    }} variant={"outlined"} color={"secondary"}>Удалить</Button>
                    <Button onClick={closeDeleteDialog} autoFocus>
                        Закрыть
                    </Button>
                </DialogActions>
            </Dialog>

        </>
    )
})