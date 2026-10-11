import React from 'react';
import { PaperProps } from '@mui/material/Paper';
import {
  Checkbox,
  FormControlLabel,
  FormHelperText,
  Paper,
} from '@mui/material';
import type { AnswerEditorController } from '../model/use-answer-editor';

interface IAnswerIsRequiredProps extends PaperProps {
  answer_object: AnswerEditorController;
}

const AnswerIsRequired = ({
  answer_object,
  ...props
}: IAnswerIsRequiredProps) => (
  <Paper elevation={0} {...props}>
    <FormControlLabel
      control={
        <Checkbox
          checked={answer_object.draft.isRequired}
          onChange={answer_object.changeIsRequired}
          color="primary"
        />
      }
      label="Обязательный вариант"
    />
    <FormHelperText>
      Случайные наборы ответов всегда будут содержать этот ответ
    </FormHelperText>
  </Paper>
);

export default AnswerIsRequired;
