import React from 'react';
import { PaperProps } from '@mui/material/Paper';
import { Chip, Paper } from '@mui/material';
import type { AnswerEditorController } from '../model/use-answer-editor';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';

interface ITitleIsRequiredProps extends PaperProps {
  answer_object: AnswerEditorController;
}

const TitleIsRequired = ({
  answer_object,
  ...props
}: ITitleIsRequiredProps) => {
  const isRequired = answer_object.draft.isRequired;
  return (
    <Paper elevation={0} {...props}>
      <Chip
        onClick={answer_object.changeIsRequired}
        variant="outlined"
        icon={isRequired ? <CheckBoxIcon /> : <CheckBoxOutlineBlankIcon />}
        color={isRequired ? 'error' : undefined}
        label={isRequired ? 'Обязательный' : 'Необязательный'}
      />
    </Paper>
  );
};

export default TitleIsRequired;
