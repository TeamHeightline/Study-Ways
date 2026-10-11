import React from 'react';
import { PaperProps } from '@mui/material/Paper';
import { InputLabel, MenuItem, Select } from '@mui/material';
import FormControl from '@mui/material/FormControl';
import type { AnswerEditorController } from '../model/use-answer-editor';

interface IAnswerHardLevelProps extends PaperProps {
  answer_object: AnswerEditorController;
}

const AnswerHardLevel = ({
  answer_object,
  ...props
}: IAnswerHardLevelProps) => (
  <FormControl fullWidth size="small">
    <InputLabel id={`qedit-answer-level-${answer_object.answer_id}`}>
      Сложность ответа
    </InputLabel>
    <Select
      label="Сложность ответа"
      labelId={`qedit-answer-level-${answer_object.answer_id}`}
      value={answer_object.draft.hardLevelOfAnswer ?? ''}
      onChange={answer_object.changeField('hardLevelOfAnswer')}
    >
      <MenuItem value="EASY">Очевидный</MenuItem>
      <MenuItem value="MEDIUM">Нормальный</MenuItem>
      <MenuItem value="HARD">Каверзный</MenuItem>
    </Select>
  </FormControl>
);

export default AnswerHardLevel;
