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
import CheckQuestionTitle from './qcheck-question-title';
import { useQuestionPreview } from '../../../Question/QuestionNanoViewByID/Store/use-question-preview';
import { useGetReviewAnswersQuery } from '../../../Question/question-read-api';
import { UserStorage } from '../../../../Shared/Store/UserStore/UserStore';
import QuestionTextAndImage from './question-text-and-image';
import CheckAnswerIndex from '../CheckAnswerByID/UI';
import UIEditQuestionButton from './ui-edit-question-button';
import '../../check-question.css';

interface ICheckQuestionByIDProps extends PaperProps {
  question_id: string;
}

const CheckQuestionByID = observer(
  ({ question_id, className = '', ...props }: ICheckQuestionByIDProps) => {
    const question = useQuestionPreview(Number(question_id));
    const answers = useGetReviewAnswersQuery({
      id: Number(question_id),
      userId: UserStorage.user_data?.id,
    });
    const CQStore = {
      question_id,
      isLoading: answers.isFetching && !answers.currentData,
      hasLoadError: answers.isError,
      answersIDArray: answers.currentData?.map(answer => answer.id) ?? [],
      LoadQuestionAnswersIDArray: answers.refetch,
    };

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
        <CheckQuestionTitle
          questionId={question_id}
          QuestionDataStore={question}
        />
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
              {answers.currentData?.map((answerData, answerIndex) => (
                <CheckAnswerIndex
                  key={answerData.id}
                  answerID={answerData.id}
                  answerData={answerData}
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
