import React from 'react';
import { PaperProps } from '@mui/material/Paper';
import { Checkbox, FormControlLabel, Paper } from '@mui/material';
import type { AnswerEditorController } from '../model/use-answer-editor';

interface IAnswerOnlyInExamProps extends PaperProps {
  answer_object: AnswerEditorController;
}

const AnswerOnlyInExam = ({
  answer_object,
  ...props
}: IAnswerOnlyInExamProps) => (
  <Paper elevation={0} {...props}>
    <FormControlLabel
      control={
        <Checkbox
          checked={!answer_object.draft.onlyForExam}
          onChange={answer_object.changeOnlyForExam}
          color="primary"
        />
      }
      label="Отображать в режиме подготовки"
    />
  </Paper>
);

export default AnswerOnlyInExam;
