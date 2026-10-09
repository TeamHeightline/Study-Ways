import React from 'react';
import { observer } from 'mobx-react';
import { TextField } from '@mui/material';
import { QuestionEditorStorage } from '../Store/QuestionEditorStorage';

export const QuestionText = observer(() => (
  <TextField
    label="Формулировка вопроса"
    placeholder="Сформулируйте вопрос для ученика"
    multiline
    fullWidth
    minRows={4}
    maxRows={12}
    variant="outlined"
    value={QuestionEditorStorage.selectedQuestionText || ''}
    onChange={event => {
      QuestionEditorStorage.selectedQuestionText = event.target.value;
    }}
  />
));
