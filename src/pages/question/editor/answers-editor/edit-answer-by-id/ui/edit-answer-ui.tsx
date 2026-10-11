import React from 'react';
import { Alert, Button, Paper, PaperProps } from '@mui/material';
import type { AnswerEditorController } from '../model/use-answer-editor';
import AnswerDeleteDialog from './answer-delete-dialog';
import AnswerTitle from './answer-title';
import AnswerPreviewSwitch from './answer-preview-switch';
import IsEditAnswer from './is-edit-answer';
import AnswerContent from './answer-content';
import AnswerPreview from './answer-preview';
import UIAnswerErrorsButton from './answer-errors-button';
import AnswerErrorDialog from './answe-error-dialog';
import AnswerErrorClosedMessage from './answer-error-closed-message';

interface EditAnswerUIProps extends PaperProps {
  answerStore: AnswerEditorController;
  answer_index?: number;
}
const EditAnswerUI = ({
  answerStore,
  answer_index,
  className = '',
  ...props
}: EditAnswerUIProps) => {
  if (answerStore.draft.isDeleted && answerStore.saveState === 'saved')
    return null;
  return (
    <Paper
      elevation={0}
      component="article"
      {...props}
      className={`sw-qedit-answer${answerStore.isOpenForEdit ? ' is-expanded' : ''} ${className}`}
    >
      {answerStore.operationError && (
        <Alert
          severity="error"
          onClose={answerStore.dismissOperationError}
          action={
            answerStore.canRetryUpload ? (
              <Button onClick={answerStore.retryUpload}>Повторить</Button>
            ) : undefined
          }
        >
          {answerStore.operationError}
        </Alert>
      )}
      <AnswerDeleteDialog answer_object={answerStore} />
      <AnswerErrorClosedMessage answer_object={answerStore} />
      <AnswerTitle answer_object={answerStore} answer_index={answer_index} />
      <div className="sw-qedit-answer-toolbar">
        <div>
          <IsEditAnswer answer_object={answerStore} />
          <AnswerPreviewSwitch answer_object={answerStore} />
        </div>
        <UIAnswerErrorsButton answer_object={answerStore} />
      </div>
      <AnswerContent answer_object={answerStore} />
      <AnswerPreview answer_object={answerStore} />
      <AnswerErrorDialog answer_object={answerStore} />
    </Paper>
  );
};
export default EditAnswerUI;
