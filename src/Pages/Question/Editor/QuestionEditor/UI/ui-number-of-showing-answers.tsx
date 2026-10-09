import React from 'react';
import { observer } from 'mobx-react';
import { MenuItem, TextField } from '@mui/material';
import { QuestionEditorStorage } from '../Store/QuestionEditorStorage';

export const UiNumberOfShowingAnswers = observer(() => (
  <TextField
    select
    fullWidth
    size="small"
    label="Количество вариантов при прохождении"
    helperText="В каждом наборе от 2 до 12 вариантов ответа"
    value={QuestionEditorStorage.selectedQuestionNumberOfShowingAnswers}
    onChange={event => {
      QuestionEditorStorage.selectedQuestionNumberOfShowingAnswers = String(
        event.target.value,
      );
    }}
  >
    {Array.from({ length: 11 }, (_, index) => index + 2).map(value => (
      <MenuItem key={value} value={String(value)}>
        {value}
      </MenuItem>
    ))}
  </TextField>
));
