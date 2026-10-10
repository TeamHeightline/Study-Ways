import React, { useState } from 'react';
import { observer } from 'mobx-react';
import {
  Button,
  Card,
  CardActionArea,
  Skeleton,
  Typography,
} from '@mui/material';
import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded';
import { QuestionNanoViewByIdStore } from '../../../Question/QuestionNanoViewByID/Store/question-nano-view-by-id-store';

interface ReviewQuestionCardProps {
  questionId: string;
  onOpen: () => void;
}

const ReviewQuestionCard = observer(
  ({ questionId, onOpen }: ReviewQuestionCardProps) => {
    const [question] = useState(
      () => new QuestionNanoViewByIdStore(Number(questionId)),
    );

    if (!question.dataHasBeenLoaded) {
      return question.hasLoadError ? (
        <Card
          variant="outlined"
          className="sw-review-question-card sw-review-card-error"
        >
          <Typography>Не удалось загрузить вопрос №{questionId}</Typography>
          <Button onClick={() => question.loadQuestionTextNanoViewByID(false)}>
            Повторить
          </Button>
        </Card>
      ) : (
        <Skeleton
          variant="rounded"
          height={210}
          className="sw-review-card-skeleton"
        />
      );
    }

    return (
      <Card variant="outlined" className="sw-review-question-card">
        <CardActionArea onClick={onOpen} className="sw-review-question-action">
          <span className="sw-review-question-id">Вопрос №{questionId}</span>
          <Typography component="h2" className="sw-review-question-text">
            {question.text || 'Вопрос без текста'}
          </Typography>
          <div className="sw-review-question-author">
            <span className="sw-review-avatar" aria-hidden="true">
              {(question.owner_username || '?').slice(0, 1).toUpperCase()}
            </span>
            <span>{question.owner_username || 'Автор не указан'}</span>
          </div>
          <div className="sw-review-question-footer">
            <span>Открыть для проверки</span>
            <ArrowForwardRoundedIcon />
          </div>
        </CardActionArea>
      </Card>
    );
  },
);

export default ReviewQuestionCard;
