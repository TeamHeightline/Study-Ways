import React from 'react';
import { Card, CardActionArea, Typography } from '@mui/material';
import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded';
import { ReviewQuestionSummary } from '../Store/question-review-api';

interface ReviewQuestionCardProps {
  question: ReviewQuestionSummary;
  onOpen: () => void;
}

export default function ReviewQuestionCard({
  question,
  onOpen,
}: ReviewQuestionCardProps) {
  return (
    <Card variant="outlined" className="sw-review-question-card">
      <CardActionArea onClick={onOpen} className="sw-review-question-action">
        <span className="sw-review-question-id">Вопрос №{question.id}</span>
        <Typography component="h2" className="sw-review-question-text">
          {question.text || 'Вопрос без текста'}
        </Typography>
        <div className="sw-review-question-author">
          <span className="sw-review-avatar" aria-hidden="true">
            {(question.ownerUsername || '?').slice(0, 1).toUpperCase()}
          </span>
          <span>{question.ownerUsername || 'Автор не указан'}</span>
        </div>
        <div className="sw-review-question-footer">
          <span>Открыть для проверки</span>
          <ArrowForwardRoundedIcon />
        </div>
      </CardActionArea>
    </Card>
  );
}
