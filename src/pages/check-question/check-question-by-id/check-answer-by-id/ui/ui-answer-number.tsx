import React from 'react';
import { Paper, PaperProps, Typography } from '@mui/material';

interface IUIAnswerNumberProps extends PaperProps {
  answerIndex: number;
}

export default function UIAnswerNumber({
  answerIndex,
  className = '',
  ...props
}: IUIAnswerNumberProps) {
  return (
    <Paper
      elevation={0}
      {...props}
      className={`sw-review-action-wrapper ${className}`}
    >
      <Typography component="h3" className="sw-review-answer-title">
        Ответ {answerIndex + 1}
      </Typography>
    </Paper>
  );
}
