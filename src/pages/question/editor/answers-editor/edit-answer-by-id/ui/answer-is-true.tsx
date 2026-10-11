import React from 'react';
import { PaperProps, TextField, MenuItem } from '@mui/material';
import type { AnswerEditorController } from '../model/use-answer-editor';

interface AnswerIsTrueProps extends PaperProps {
  answer_object: AnswerEditorController;
}
const AnswerIsTrue = ({ answer_object: store }: AnswerIsTrueProps) => (
  <TextField
    fullWidth
    select
    size="small"
    label="Правильность ответа"
    value={store.isTrue}
    onChange={store.changeIsTrue}
  >
    <MenuItem value="true">Верный</MenuItem>
    <MenuItem value="false">Неверный</MenuItem>
  </TextField>
);
export default AnswerIsTrue;
