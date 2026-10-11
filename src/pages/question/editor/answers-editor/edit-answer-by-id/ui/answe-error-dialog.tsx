import React from 'react';
import {
  Alert,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  BoxProps,
} from '@mui/material';
import DoneRoundedIcon from '@mui/icons-material/DoneRounded';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import type { AnswerEditorController } from '../model/use-answer-editor';

interface AnswerErrorDialogProps extends BoxProps {
  answer_object: AnswerEditorController;
}
const AnswerErrorDialog = ({
  answer_object: store,
}: AnswerErrorDialogProps) => (
  <Dialog
    open={store.isOpenAnswerErrorMessageDialog}
    onClose={store.closeAnswerErrorMessageDialog}
    fullWidth
    maxWidth="sm"
    aria-labelledby={`qedit-reports-title-${store.answer_id}`}
    slotProps={{
      paper: { className: 'sw-qedit-dialog' },
    }}
  >
    <DialogTitle id={`qedit-reports-title-${store.answer_id}`}>
      Замечания к ответу
      <IconButton
        aria-label="Закрыть замечания"
        onClick={store.closeAnswerErrorMessageDialog}
      >
        <CloseRoundedIcon />
      </IconButton>
    </DialogTitle>
    <DialogContent>
      {store.reportsError && (
        <Alert
          severity="error"
          action={
            <Button onClick={() => store.retryReports()}>Повторить</Button>
          }
        >
          Не удалось загрузить замечания.
        </Alert>
      )}
      {!store.reportsError &&
        !store.reportsLoading &&
        !store.answerErrorMessage.length && <p>Все замечания обработаны.</p>}
      {store.answerErrorMessage.map(message => {
        const profile = message.users_customuser?.users_userprofile;
        const name =
          [profile?.firstname, profile?.lastname].filter(Boolean).join(' ') ||
          message.users_customuser?.username;
        return (
          <article key={message.id} className="sw-qedit-report-item">
            <p>{message.text}</p>
            <div className="sw-qedit-report-meta">
              <span>{name}</span>
              <span>{message.createdAt?.slice(0, 10)}</span>
            </div>
            <Button
              startIcon={<DoneRoundedIcon />}
              loading={message.id === store.updatingAnswerErrorMessageID}
              disabled={store.updatingAnswerErrorMessageID !== null}
              onClick={() => store.onCloseAnswerReportClick(message.id)}
              variant="outlined"
              size="small"
            >
              Отметить обработанным
            </Button>
          </article>
        );
      })}
    </DialogContent>
    <DialogActions>
      <Button color="inherit" onClick={store.closeAnswerErrorMessageDialog}>
        Закрыть
      </Button>
    </DialogActions>
  </Dialog>
);
export default AnswerErrorDialog;
