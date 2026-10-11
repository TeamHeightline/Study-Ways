import React from 'react';
import { PaperProps } from '@mui/material/Paper';
import { Chip, Paper } from '@mui/material';
import type { AnswerEditorController } from '../model/use-answer-editor';
import SchoolIcon from '@mui/icons-material/School';
import ArchitectureIcon from '@mui/icons-material/Architecture';

interface ITitleRequireTagProps extends PaperProps {
  answer_object: AnswerEditorController;
}

const TitleOnlyInExam = ({
  answer_object,
  ...props
}: ITitleRequireTagProps) => {
  const onlyInExam = answer_object.draft.onlyForExam;
  return (
    <Paper elevation={0} {...props}>
      <Chip
        variant="outlined"
        onClick={answer_object.changeOnlyForExam}
        icon={onlyInExam ? <SchoolIcon /> : <ArchitectureIcon />}
        color={onlyInExam ? 'primary' : 'warning'}
        label={onlyInExam ? 'Только экзамен' : 'В подготовке'}
      />
    </Paper>
  );
};

export default TitleOnlyInExam;
