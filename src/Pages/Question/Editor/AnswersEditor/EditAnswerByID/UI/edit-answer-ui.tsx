import React, { useEffect } from 'react';
import { observer } from 'mobx-react';
import { Alert, Button, Paper, PaperProps, Skeleton } from '@mui/material';
import { EditAnswerByIdStore } from '../Store/edit-answer-by-id-store';
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
  answerStore: EditAnswerByIdStore;
  answer_index?: number;
}
const EditAnswerUI = observer(
  ({
    answerStore,
    answer_index,
    className = '',
    ...props
  }: EditAnswerUIProps) => {
    useEffect(() => {
      answerStore.loadAnswerErrorMessage().catch(() => void 0);
    }, [answerStore]);
    if (answerStore.hasLoadError)
      return (
        <Alert
          severity="error"
          action={
            <Button
              color="inherit"
              onClick={() => answerStore.loadAnswerData()}
            >
              Повторить
            </Button>
          }
        >
          Не удалось загрузить ответ №{answerStore.answer_id}.
        </Alert>
      );
    if (!answerStore.isAnswerDataLoaded)
      return (
        <Skeleton variant="rounded" height={210} aria-label="Загрузка ответа" />
      );
    if (answerStore.answer_object?.isDeleted) return null;
    return (
      <Paper
        elevation={0}
        component="article"
        {...props}
        className={`sw-qedit-answer${answerStore.isOpenForEdit ? ' is-expanded' : ''} ${className}`}
      >
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
  },
);
export default EditAnswerUI;
