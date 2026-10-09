import React, { useMemo } from 'react';
import { PaperProps } from '@mui/material';
import { EditAnswerByIdStore } from '../Store/edit-answer-by-id-store';
import EditAnswerUI from './edit-answer-ui';

interface EditAnswerByIDProps extends PaperProps {
  answer_id: number;
  answer_index?: number;
}
export default function EditAnswerByID({
  answer_id,
  answer_index,
  ...props
}: EditAnswerByIDProps) {
  const store = useMemo(() => new EditAnswerByIdStore(answer_id), [answer_id]);
  return (
    <EditAnswerUI {...props} answerStore={store} answer_index={answer_index} />
  );
}
