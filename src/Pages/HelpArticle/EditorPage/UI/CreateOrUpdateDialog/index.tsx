import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogTitle,
  DialogContent,
} from "@mui/material";
import { BoxProps } from "@mui/material/Box/Box";
import {
  useAppDispatch,
  useAppSelector,
} from "../../../../../App/ReduxStore/RootStore";
import { closeCreateDialog } from "../../redux-store";
import CloseIcon from "@mui/icons-material/Close";
import { LoadingButton } from "@mui/lab";
import AddIcon from "@mui/icons-material/Add";
import React from "react";
import {
  createHelpArticle,
  updateHelpArticle,
} from "../../redux-store/async-actions";
import URL from "./url";
import Title from "./title";
import VideoUrl from "./video-url";
import Content from "./content";
import { getArticles } from "../../../HelpArticleByURL/redux-store/async-actions";

type ICreateHelpArticleDialogProps = BoxProps;

export default function CreateHelpArticleDialog({
  ...props
}: ICreateHelpArticleDialogProps) {
  const dispatch = useAppDispatch();

  const {
    is_open_create_dialog,
    is_loading_create_article,
    create_or_update_article_data,
  } = useAppSelector((store) => store.helpArticleEditor);

  function handleClose() {
    dispatch(closeCreateDialog());
  }

  const isEditDialog = !!create_or_update_article_data.id;

  function handleCreate() {
    if (isEditDialog) {
      dispatch(updateHelpArticle(create_or_update_article_data)).then(() => {
        dispatch(getArticles());
      });
    } else {
      dispatch(createHelpArticle(create_or_update_article_data)).then(() => {
        dispatch(getArticles());
      });
    }
  }

  const isCanNOTCreate =
    !create_or_update_article_data.title || !create_or_update_article_data.url;

  return (
    <Box {...props}>
      <Dialog
        fullWidth
        maxWidth={"md"}
        open={is_open_create_dialog}
        onClose={handleClose}
      >
        <DialogTitle>
          {isEditDialog ? "Редактирование справки" : "Создание справки"}
        </DialogTitle>
        <DialogContent>
          <URL />
          <Title />
          <VideoUrl />
          <Content />
        </DialogContent>
        <DialogActions>
          <Button
            color={"error"}
            onClick={handleClose}
            startIcon={<CloseIcon />}
          >
            Отмена
          </Button>
          <LoadingButton
            disabled={isCanNOTCreate}
            loading={is_loading_create_article}
            onClick={handleCreate}
            autoFocus
            startIcon={<AddIcon />}
          >
            {isEditDialog ? "Сохранить" : "Создать"}
          </LoadingButton>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
