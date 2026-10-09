import { observer } from 'mobx-react';
import React, { useMemo } from 'react';
import {
  Alert,
  Button,
  Paper,
  PaperProps,
  Skeleton,
  Typography,
} from '@mui/material';
import GoBackButton from './go-back-button';
import { CheckQuestionByIdStore } from '../Store/check-question-by-id-store';
import CheckQuestionTitle from './qcheck-question-title';
import { QuestionNanoViewByIdStore } from '../../../Question/QuestionNanoViewByID/Store/question-nano-view-by-id-store';
import QuestionTextAndImage from './question-text-and-image';
import CheckAnswerIndex from '../CheckAnswerByID/UI';
import UIEditQuestionButton from './ui-edit-question-button';
import '../../check-question.css';

interface ICheckQuestionByIDProps extends PaperProps {
  question_id: string;
}

const CheckQuestionByID = observer(
  ({ question_id, className = '', ...props }: ICheckQuestionByIDProps) => {
    const CQStore = useMemo(
      () => new CheckQuestionByIdStore(question_id),
      [question_id],
    );
    const question = useMemo(
      () => new QuestionNanoViewByIdStore(Number(question_id)),
      [question_id],
    );

    return (
      <Paper
        elevation={0}
        {...props}
        className={`sw-review-detail ${className}`}
      >
        <div className="sw-review-detail-navigation">
          <GoBackButton />
          <UIEditQuestionButton question_id={question_id} />
        </div>
        <CheckQuestionTitle CQStore={CQStore} QuestionDataStore={question} />
        <QuestionTextAndImage QuestionDataStore={question} />

        <section
          className="sw-review-answers-section"
          aria-labelledby="review-answers-heading"
        >
          <div className="sw-review-section-heading">
            <div>
              <Typography component="h2" id="review-answers-heading">
                Ответы и подсказки
              </Typography>
              <Typography component="p">
                Проверьте каждый вариант ответа и объяснения к нему.
              </Typography>
            </div>
            {!CQStore.isLoading && !CQStore.hasLoadError && (
              <span className="sw-review-count">
                {CQStore.answersIDArray.length}
              </span>
            )}
          </div>
          {CQStore.hasLoadError ? (
            <Alert
              severity="error"
              action={
                <Button
                  color="inherit"
                  onClick={() => CQStore.LoadQuestionAnswersIDArray()}
                >
                  Повторить
                </Button>
              }
            >
              Не удалось загрузить ответы.
            </Alert>
          ) : CQStore.isLoading ? (
            <div
              className="sw-review-answers"
              aria-busy="true"
              aria-label="Загрузка ответов"
            >
              <Skeleton variant="rounded" height={280} />
              <Skeleton variant="rounded" height={280} />
            </div>
          ) : CQStore.answersIDArray.length === 0 ? (
            <div className="sw-review-empty" role="status">
              <Typography component="h3">Ответы пока не добавлены</Typography>
              <Typography component="p">
                В этом вопросе ещё нет вариантов для проверки.
              </Typography>
            </div>
          ) : (
            <div className="sw-review-answers">
              {CQStore.answersIDArray.map((answerID, answerIndex) => (
                <CheckAnswerIndex
                  key={answerID}
                  answerID={answerID}
                  answerIndex={answerIndex}
                />
              ))}
            </div>
          )}
        </section>
      </Paper>
    );
  },
);

export default CheckQuestionByID;
