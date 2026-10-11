import React from 'react';
import { Paper, PaperProps, Typography } from '@mui/material';

interface ReviewHelpTextProps extends PaperProps {
  level: 1 | 2 | 3;
  text?: string | null;
}

export default function ReviewHelpText({
  level,
  text,
  className = '',
  ...props
}: ReviewHelpTextProps) {
  const difficulty = { 1: 'Лёгкий', 2: 'Средний', 3: 'Высокий' }[level];
  return (
    <Paper
      elevation={0}
      {...props}
      className={`sw-review-hint ${!text?.trim() ? 'is-empty' : ''} ${className}`}
    >
      <span className="sw-review-hint-level" aria-hidden="true">
        {['Л', 'С', 'В'][level - 1]}
      </span>
      <div>
        <Typography component="h4">
          Подсказка · {difficulty.toLowerCase()} уровень сложности
        </Typography>
        <Typography component="p">
          {text?.trim() ? text : 'Не добавлена'}
        </Typography>
      </div>
    </Paper>
  );
}
