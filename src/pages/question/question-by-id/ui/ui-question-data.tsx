import React, { useState } from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material';
import QuestionPanel from '../../../../shared/question-player/ui/question-panel';
import QuestionActions from '../../../../shared/question-player/ui/question-actions';

interface Props {
  questionText: string;
  questionImgUrl?: string;
  onClick1: () => void;
  onAcceptDefeat: () => void;
}
export default function UiQuestionData({
  questionText,
  questionImgUrl,
  onClick1,
  onAcceptDefeat,
}: Props) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <QuestionPanel
        text={questionText}
        imageUrl={questionImgUrl}
        actions={
          <QuestionActions onCheck={onClick1} onGiveUp={() => setOpen(true)} />
        }
      />
      <Dialog onClose={() => setOpen(false)} open={open}>
        <DialogTitle>Вы уверены, что хотите сдаться?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Если этот вопрос является частью серии вопросов, мы советуем Вам
            заняться другими вопросами и вернуться к этому позже
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button color="secondary" onClick={onAcceptDefeat}>
            Сдаться
          </Button>
          <Button onClick={() => setOpen(false)}>Отмена</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
