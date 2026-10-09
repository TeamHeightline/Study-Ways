import React from 'react';
import { Button, BoxProps } from '@mui/material';
import { observer } from 'mobx-react';
import ChatBubbleOutlineRoundedIcon from '@mui/icons-material/ChatBubbleOutlineRounded';
import { EditAnswerByIdStore } from '../Store/edit-answer-by-id-store';

interface AnswerErrorsButtonProps extends BoxProps {
  answer_object: EditAnswerByIdStore;
}
const UIAnswerErrorsButton = observer(
  ({ answer_object: store }: AnswerErrorsButtonProps) =>
    store.answerErrorMessage.length > 0 ? (
      <Button
        startIcon={<ChatBubbleOutlineRoundedIcon />}
        className="sw-qedit-answer-reports"
        onClick={store.openAnswerErrorMessageDialog}
      >
        Замечания · {store.answerErrorMessage.length}
      </Button>
    ) : null,
);
export default UIAnswerErrorsButton;
