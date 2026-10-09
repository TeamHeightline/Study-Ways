import React from 'react';
import { Paper, PaperProps } from '@mui/material';
import { Route, Routes } from 'react-router-dom';
import SelectQuestionAndOpenIt from './select-question-and-open-it';
import CheckQuestionByURL from '../../CheckQuestionByURL/UI/check-question-by-url';
import '../../check-question.css';

export default function CheckQuestionPage({
  className = '',
  ...props
}: PaperProps) {
  return (
    <Paper elevation={0} {...props} className={`sw-review-page ${className}`}>
      <Routes>
        <Route path="question/:id" element={<CheckQuestionByURL />} />
        <Route path="*" element={<SelectQuestionAndOpenIt />} />
      </Routes>
    </Paper>
  );
}
