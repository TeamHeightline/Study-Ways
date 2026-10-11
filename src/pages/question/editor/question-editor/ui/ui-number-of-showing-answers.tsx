import React from 'react';
import { MenuItem, TextField } from '@mui/material';
import { useQuestionEditor } from '../store/use-question-editor';
export const UiNumberOfShowingAnswers = () => {
  const editor = useQuestionEditor();
  return (
    <TextField
      select
      fullWidth
      size="small"
      label="Количество вариантов при прохождении"
      helperText="В каждом наборе от 2 до 12 вариантов ответа"
      value={editor.selectedQuestionNumberOfShowingAnswers}
      onChange={event => {
        editor.changeFields({
          numberOfShowingAnswers: String(event.target.value),
        });
      }}
    >
      {Array.from({ length: 11 }, (_, index) => index + 2).map(value => (
        <MenuItem key={value} value={String(value)}>
          {value}
        </MenuItem>
      ))}
    </TextField>
  );
};
