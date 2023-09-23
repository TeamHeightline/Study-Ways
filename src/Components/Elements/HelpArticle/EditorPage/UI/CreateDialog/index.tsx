import {Box, Button, Dialog, DialogActions, DialogTitle, DialogContent} from "@mui/material";
import {BoxProps} from "@mui/material/Box/Box";
import {useAppDispatch, useAppSelector} from "../../../../../../root-redux-store/RootStore";
import {setIsOpenCreateDialog} from "../../redux-store";
import CloseIcon from "@mui/icons-material/Close";
import {LoadingButton} from "@mui/lab";
import AddIcon from "@mui/icons-material/Add";
import React from "react";
import {createHelpArticle} from "../../redux-store/async-actions";
import URL from "./url";
import Title from "./title";
import VideoUrl from "./video-url";
import Content from "./content";

interface ICreateHelpArticleDialogProps extends BoxProps {

}

export default function CreateHelpArticleDialog({...props}: ICreateHelpArticleDialogProps) {
    const dispatch = useAppDispatch()

    const {
        is_open_create_dialog,
        is_loading_create_article,
        create_article_data
    } = useAppSelector(store => store.helpArticleEditor)

    function handleClose() {
        dispatch(setIsOpenCreateDialog(false))
    }

    function handleCreate() {
        dispatch(createHelpArticle(create_article_data))
    }

    const isCanNOTCreate = !create_article_data.title || !create_article_data.url

    return (
        <Box {...props}>
            <Dialog
                fullWidth
                maxWidth={"md"}
                open={is_open_create_dialog}
                onClose={handleClose}
            >
                <DialogTitle>
                    Создание справки
                </DialogTitle>
                <DialogContent>
                    <URL/>
                    <Title/>
                    <VideoUrl/>
                    <Content/>
                </DialogContent>
                <DialogActions>
                    <Button
                        color={"error"}
                        onClick={handleClose}
                        startIcon={<CloseIcon/>}>
                        Отмена
                    </Button>
                    <LoadingButton
                        disabled={isCanNOTCreate}
                        loading={is_loading_create_article}
                        onClick={handleCreate}
                        autoFocus
                        startIcon={<AddIcon/>}
                    >
                        Создать
                    </LoadingButton>
                </DialogActions>
            </Dialog>
        </Box>
    )
}
