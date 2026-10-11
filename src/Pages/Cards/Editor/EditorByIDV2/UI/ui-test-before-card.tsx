import React from 'react';
import { observer } from 'mobx-react';
import { Alert, Button, Skeleton, TextField } from '@mui/material';
import { skipToken } from '@reduxjs/toolkit/query';
import { CESObject } from '../Store/CardEditorStorage';
import { useGetQuestionPreviewQuery } from '../../../../Question/question-read-api';
export const UiTestBeforeCard = observer(() => {
  const id = Number(CESObject.getField('test_before_card_id', ''));
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
        label="ID вопроса перед ресурсом"
        inputProps={{ min: 1 }}
        value={CESObject.getField('test_before_card_id', '') || ''}
        onChange={CESObject.changeField('test_before_card_id')}
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
});
