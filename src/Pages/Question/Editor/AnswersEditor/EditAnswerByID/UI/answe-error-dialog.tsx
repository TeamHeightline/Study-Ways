import React from 'react';
import { observer } from 'mobx-react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  BoxProps,
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import DoneRoundedIcon from '@mui/icons-material/DoneRounded';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import { EditAnswerByIdStore } from '../Store/edit-answer-by-id-store';

interface AnswerErrorDialogProps extends BoxProps {
  answer_object: EditAnswerByIdStore;
}
const AnswerErrorDialog = observer(
  ({ answer_object: store }: AnswerErrorDialogProps) => (
    <Dialog
      open={
        store.isOpenAnswerErrorMessageDialog &&
        store.answerErrorMessage.length > 0
      }
      onClose={store.closeAnswerErrorMessageDialog}
      fullWidth
      maxWidth="sm"
      aria-labelledby={`qedit-reports-title-${store.answer_id}`}
      PaperProps={{ className: 'sw-qedit-dialog' }}
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
              <LoadingButton
                startIcon={<DoneRoundedIcon />}
                loading={message.id === store.updatingAnswerErrorMessageID}
                onClick={() => store.onCloseAnswerReportClick(message.id)}
                variant="outlined"
                size="small"
              >
                Отметить обработанным
              </LoadingButton>
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
  ),
);
export default AnswerErrorDialog;
