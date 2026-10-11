import { observer } from 'mobx-react';
import React from 'react';
import { Paper, PaperProps, Typography } from '@mui/material';
import { NanoQuestionStoreType } from '../../../Question/QuestionNanoViewByID/Store/question-nano-view-by-id-store';

interface ICheckQuestionTitleProps extends PaperProps {
  questionId: string;
  QuestionDataStore: NanoQuestionStoreType;
}

const CheckQuestionTitle = observer(
  ({
    questionId,
    QuestionDataStore,
    className = '',
    ...props
  }: ICheckQuestionTitleProps) => (
    <Paper
      elevation={0}
      {...props}
      className={`sw-review-heading sw-review-detail-heading sw-card-library-heading ${className}`}
    >
      <div>
        <Typography component="h1" className="sw-card-library-title">
          Проверка вопроса №{questionId}
        </Typography>
        <Typography component="p" className="sw-review-description">
          Оцените формулировку, правильность ответов и подсказки. Замечание
          можно отправить к любому ответу.
        </Typography>
      </div>
      {QuestionDataStore.owner_username && (
        <div className="sw-review-author-badge">
          <span className="sw-review-avatar" aria-hidden="true">
            {QuestionDataStore.owner_username.slice(0, 1).toUpperCase()}
          </span>
          <div>
            <span>Автор вопроса</span>
            <strong>{QuestionDataStore.owner_username}</strong>
          </div>
        </div>
      )}
    </Paper>
  ),
);

export default CheckQuestionTitle;
