import React from 'react';
import { observer } from 'mobx-react';
import { PaperProps, TextField } from '@mui/material';
import { EditAnswerByIdStore } from '../Store/edit-answer-by-id-store';

interface AnswerTextProps extends PaperProps {
  answer_object: EditAnswerByIdStore;
}
const AnswerText = observer(({ answer_object: store }: AnswerTextProps) => (
  <TextField
    variant="outlined"
    label="Текст ответа"
    multiline
    fullWidth
    minRows={3}
    maxRows={10}
    value={store.getField('text')}
    onChange={store.changeField('text')}
  />
));
export default AnswerText;
