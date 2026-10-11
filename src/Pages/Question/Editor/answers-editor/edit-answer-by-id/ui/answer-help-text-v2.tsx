import React from 'react';
import { PaperProps } from '@mui/material/Paper';
import { TextField } from '@mui/material';
import type { AnswerEditorController } from '../model/use-answer-editor';

interface IAnswerHelpTextV2Props extends PaperProps {
  answer_object: AnswerEditorController;
}

const AnswerHelpTextV2 = ({
  answer_object,
  ...props
}: IAnswerHelpTextV2Props) => (
  <TextField
    variant={'outlined'}
    label="Подсказка для среднего уровня"
    multiline
    fullWidth
    minRows={3}
    maxRows={8}
    value={answer_object.draft.helpTextv2 ?? ''}
    onChange={answer_object.changeField('helpTextv2')}
  />
);

export default AnswerHelpTextV2;
