import React from 'react';
import { PaperProps } from '@mui/material/Paper';
import { TextField } from '@mui/material';
import type { AnswerEditorController } from '../model/use-answer-editor';

interface IAnswerHelpTextV1Props extends PaperProps {
  answer_object: AnswerEditorController;
}

const AnswerHelpTextV1 = ({
  answer_object,
  ...props
}: IAnswerHelpTextV1Props) => (
  <TextField
    variant={'outlined'}
    label="Подсказка для лёгкого уровня"
    multiline
    fullWidth
    minRows={3}
    maxRows={8}
    value={answer_object.draft.helpTextv1 ?? ''}
    onChange={answer_object.changeField('helpTextv1')}
  />
);

export default AnswerHelpTextV1;
