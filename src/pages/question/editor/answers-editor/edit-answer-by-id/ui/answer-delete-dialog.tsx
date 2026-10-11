import React from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  PaperProps,
} from '@mui/material';
import type { AnswerEditorController } from '../model/use-answer-editor';

interface AnswerDeleteDialogProps extends PaperProps {
  answer_object: AnswerEditorController;
}
const AnswerDeleteDialog = ({
  answer_object: store,
}: AnswerDeleteDialogProps) => (
  <Dialog
    open={store.isOpenDeleteDialog}
    onClose={() => {
      store.setOpenDeleteDialog(false);
    }}
    fullWidth
    maxWidth="xs"
    aria-labelledby={`qedit-delete-title-${store.answer_id}`}
    slotProps={{
      paper: { className: 'sw-qedit-dialog' },
    }}
  >
    <DialogTitle id={`qedit-delete-title-${store.answer_id}`}>
      Удалить вариант ответа?
    </DialogTitle>
    <DialogContent>
      {store.hasSaveError && (
        <p role="alert">Не удалось удалить ответ. Повторите попытку.</p>
      )}
      <DialogContentText>
        Ответ и его подсказки больше не будут использоваться в этом вопросе.
      </DialogContentText>
    </DialogContent>
    <DialogActions>
      <Button
        color="inherit"
        disabled={store.saveState === 'saving'}
        onClick={() => {
          store.setOpenDeleteDialog(false);
        }}
      >
        Отмена
      </Button>
      <Button
        color="error"
        variant="contained"
        disableElevation
        loading={store.saveState === 'saving'}
        onClick={() => {
          void store.deleteAnswer();
        }}
      >
        Удалить ответ
      </Button>
    </DialogActions>
  </Dialog>
);
export default AnswerDeleteDialog;
