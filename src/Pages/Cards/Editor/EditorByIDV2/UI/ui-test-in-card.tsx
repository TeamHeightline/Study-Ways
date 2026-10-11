import React from 'react';
import { Alert, Button, Skeleton, TextField } from '@mui/material';
import { skipToken } from '@reduxjs/toolkit/query';
import { useCardEditor } from '../model/use-card-editor';
import { useGetQuestionPreviewQuery } from '../../../../Question/question-read-api';
export const UiTestInCard = () => {
  const editor = useCardEditor();
  const id = Number(editor.draft.test_in_card_id ?? '');
  const {
    currentData: question,
    isFetching,
    isError,
    refetch,
  } = useGetQuestionPreviewQuery(
    Number.isInteger(id) && id > 0 ? id : skipToken,
  );
  return (
    <div className="sw-cedit-question-fields">
      <TextField
        fullWidth
        size="small"
        type="number"
        label="ID вопроса после ресурса"
        value={(editor.draft.test_in_card_id ?? '') || ''}
        onChange={editor.changeField('test_in_card_id')}
        slotProps={{
          htmlInput: { min: 1 },
        }}
      />
      {isFetching && !question && <Skeleton height={70} />}
      {isError && (
        <Alert
          severity="error"
          action={<Button onClick={() => refetch()}>Повторить</Button>}
        >
          Не удалось загрузить вопрос.
        </Alert>
      )}
      {question === null && <Alert severity="info">Вопрос не найден.</Alert>}
      {question && (
        <div className="sw-cedit-question-preview">
          <span>Вопрос №{question.id}</span>
          <p>{question.text}</p>
        </div>
      )}
    </div>
  );
};
