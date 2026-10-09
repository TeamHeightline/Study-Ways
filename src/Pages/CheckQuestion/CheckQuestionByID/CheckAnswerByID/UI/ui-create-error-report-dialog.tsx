import { observer } from 'mobx-react';
import React from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  PaperProps,
  TextField,
} from '@mui/material';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import SendRoundedIcon from '@mui/icons-material/SendRounded';
import { CheckAnswerByIdStore } from '../Store/check-answer-by-id-store';
import ReviewAnswerContent from './review-answer-content';

interface IUICreateErrorReportDialogProps extends PaperProps {
  answerStore: CheckAnswerByIdStore;
}

const UICreateErrorReportDialog = observer(
  ({ answerStore }: IUICreateErrorReportDialogProps) => (
    <Dialog
      open={answerStore.isOpenAnswerReportDialog}
      onClose={answerStore.closeAnswerReportDialog}
      fullWidth
      maxWidth="sm"
      aria-labelledby={`review-report-title-${answerStore.answerID}`}
      aria-describedby={`review-report-description-${answerStore.answerID}`}
      PaperProps={{ className: 'sw-review-report-dialog' }}
    >
      <DialogTitle id={`review-report-title-${answerStore.answerID}`}>
        Замечание к ответу
        <IconButton
          aria-label="Закрыть"
          onClick={answerStore.closeAnswerReportDialog}
        >
          <CloseRoundedIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <DialogContentText
          id={`review-report-description-${answerStore.answerID}`}
        >
          Опишите неточность и, если возможно, предложите исправление.
        </DialogContentText>
        {answerStore.answerData && (
          <div className="sw-review-report-answer">
            <ReviewAnswerContent answer={answerStore.answerData} />
          </div>
        )}
        <TextField
          id={`review-report-text-${answerStore.answerID}`}
          label="Описание ошибки"
          placeholder="Что нужно исправить в ответе или подсказках?"
          value={answerStore.answerReportText}
          onChange={answerStore.changeAnswerReportText}
          multiline
          minRows={4}
          autoFocus
          fullWidth
          variant="outlined"
        />
      </DialogContent>
      <DialogActions>
        <Button color="inherit" onClick={answerStore.closeAnswerReportDialog}>
          Отмена
        </Button>
        <Button
          variant="contained"
          disableElevation
          endIcon={<SendRoundedIcon />}
          disabled={!answerStore.answerReportText.trim()}
          onClick={answerStore.onSendAnswerReportButtonClick}
        >
          Отправить замечание
        </Button>
      </DialogActions>
    </Dialog>
  ),
);

export default UICreateErrorReportDialog;
