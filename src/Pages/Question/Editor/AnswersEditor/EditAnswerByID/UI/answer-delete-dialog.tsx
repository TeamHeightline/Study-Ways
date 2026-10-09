import React from 'react';
import { observer } from 'mobx-react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  PaperProps,
} from '@mui/material';
import { EditAnswerByIdStore } from '../Store/edit-answer-by-id-store';

interface AnswerDeleteDialogProps extends PaperProps {
  answer_object: EditAnswerByIdStore;
}
const AnswerDeleteDialog = observer(
  ({ answer_object: store }: AnswerDeleteDialogProps) => (
    <Dialog
      open={store.isOpenDeleteDialog}
      onClose={() => {
        store.isOpenDeleteDialog = false;
      }}
      fullWidth
      maxWidth="xs"
      aria-labelledby={`qedit-delete-title-${store.answer_id}`}
      PaperProps={{ className: 'sw-qedit-dialog' }}
    >
      <DialogTitle id={`qedit-delete-title-${store.answer_id}`}>
        Удалить вариант ответа?
      </DialogTitle>
      <DialogContent>
        <DialogContentText>
          Ответ и его подсказки больше не будут использоваться в этом вопросе.
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button
          color="inherit"
          onClick={() => {
            store.isOpenDeleteDialog = false;
          }}
        >
          Отмена
        </Button>
        <Button
          color="error"
          variant="contained"
          disableElevation
          onClick={() => {
            store.deleteAnswer();
            store.isOpenDeleteDialog = false;
          }}
        >
          Удалить ответ
        </Button>
      </DialogActions>
    </Dialog>
  ),
);
export default AnswerDeleteDialog;
