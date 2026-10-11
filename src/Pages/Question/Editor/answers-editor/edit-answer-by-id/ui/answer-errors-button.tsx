import React from 'react';
import { Button, BoxProps } from '@mui/material';
import ChatBubbleOutlineRoundedIcon from '@mui/icons-material/ChatBubbleOutlineRounded';
import type { AnswerEditorController } from '../model/use-answer-editor';

interface AnswerErrorsButtonProps extends BoxProps {
  answer_object: AnswerEditorController;
}
const UIAnswerErrorsButton = ({
  answer_object: store,
}: AnswerErrorsButtonProps) =>
  store.answerErrorMessage.length > 0 || store.reportsError ? (
    <Button
      startIcon={<ChatBubbleOutlineRoundedIcon />}
      className="sw-qedit-answer-reports"
      onClick={store.openAnswerErrorMessageDialog}
    >
      Замечания ·{' '}
      {store.reportsError
        ? 'Повторить загрузку'
        : store.answerErrorMessage.length}
    </Button>
  ) : null;
export default UIAnswerErrorsButton;
