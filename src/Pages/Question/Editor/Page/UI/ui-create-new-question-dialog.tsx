import React, { useState } from 'react';
import {
  Alert,
  Box,
  BoxProps,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
} from '@mui/material';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import { LoadingButton } from '@mui/lab';
import {
  useAppDispatch,
  useAppSelector,
} from '../../../../../App/ReduxStore/RootStore';
import {
  closeCreateQuestionDialog,
  finishCreatingNewQuestion,
  startCreatingNewQuestion,
} from '../redux-store/QuestionEditorPageSlice';
import { QuestionEditorStorage } from '../../QuestionEditor/Store/QuestionEditorStorage';
import { useNavigate } from 'react-router-dom';

export default function UICreateNewQuestionDialog(props: BoxProps) {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const page = useAppSelector(state => state.questionEditorPage);
  const [hasError, setHasError] = useState(false);
  const close = () => {
    if (!page.is_new_question_now_creating) {
      setHasError(false);
      dispatch(closeCreateQuestionDialog());
    }
  };
  async function create() {
    setHasError(false);
    dispatch(startCreatingNewQuestion());
    try {
      const id = await QuestionEditorStorage.createNewQuestion();
      if (!id) throw new Error('Question was not created');
      dispatch(closeCreateQuestionDialog());
      navigate(`selected/${id}`);
    } catch {
      setHasError(true);
    } finally {
      dispatch(finishCreatingNewQuestion());
    }
  }
  return (
    <Box {...props}>
      <Dialog
        open={page.is_open_create_question_dialog}
        onClose={close}
        fullWidth
        maxWidth="xs"
        aria-labelledby="qedit-create-title"
        PaperProps={{ className: 'sw-qedit-dialog' }}
      >
        <DialogTitle id="qedit-create-title">
          Новый вопрос
          <IconButton
            aria-label="Закрыть"
            onClick={close}
            disabled={page.is_new_question_now_creating}
          >
            <CloseRoundedIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Создадим пустой вопрос и откроем редактор. В нём можно добавить
            текст, ответы и подсказки.
          </DialogContentText>
          {hasError && (
            <Alert severity="error">
              Не удалось создать вопрос. Попробуйте ещё раз.
            </Alert>
          )}
        </DialogContent>
        <DialogActions>
          <Button
            color="inherit"
            onClick={close}
            disabled={page.is_new_question_now_creating}
          >
            Отмена
          </Button>
          <LoadingButton
            variant="contained"
            disableElevation
            loading={page.is_new_question_now_creating}
            onClick={create}
            startIcon={<AddRoundedIcon />}
          >
            Создать вопрос
          </LoadingButton>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
