import React from 'react';
import { PaperProps } from '@mui/material';
import { useParams } from 'react-router-dom';
import CheckQuestionByID from '../../check-question-by-id/ui/check-question-by-id';

export default function CheckQuestionByURL(props: PaperProps) {
  const { id } = useParams();
  return id ? <CheckQuestionByID key={id} question_id={id} {...props} /> : null;
}
