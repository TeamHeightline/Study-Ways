import React from 'react';
import { PaperProps, TextField } from '@mui/material';
import type { AnswerEditorController } from '../model/use-answer-editor';

interface AnswerTextProps extends PaperProps {
  answer_object: AnswerEditorController;
}
const AnswerText = ({ answer_object: store }: AnswerTextProps) => (
  <TextField
    variant="outlined"
    label="Текст ответа"
    multiline
    fullWidth
    minRows={3}
    maxRows={10}
    value={store.draft.text ?? ''}
    onChange={store.changeField('text')}
  />
);
export default AnswerText;
