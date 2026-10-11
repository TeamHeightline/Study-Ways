import React from 'react';
import { TextField } from '@mui/material';
import { useQuestionEditor } from '../store/use-question-editor';
export const QuestionText = () => {
  const editor = useQuestionEditor();
  return (
    <TextField
      label="Формулировка вопроса"
      placeholder="Сформулируйте вопрос для ученика"
      multiline
      fullWidth
      minRows={4}
      maxRows={12}
      variant="outlined"
      value={editor.selectedQuestionText || ''}
      onChange={event => {
        editor.changeFields({ text: event.target.value });
      }}
    />
  );
};
