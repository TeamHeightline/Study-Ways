import React from 'react';
import { observer } from 'mobx-react';
import { PaperProps, TextField, MenuItem } from '@mui/material';
import { EditAnswerByIdStore } from '../Store/edit-answer-by-id-store';

interface AnswerIsTrueProps extends PaperProps {
  answer_object: EditAnswerByIdStore;
}
const AnswerIsTrue = observer(({ answer_object: store }: AnswerIsTrueProps) => (
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
));
export default AnswerIsTrue;
