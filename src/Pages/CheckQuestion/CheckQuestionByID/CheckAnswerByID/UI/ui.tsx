import { observer } from 'mobx-react';
import React from 'react';
import { Alert, Button, Paper, PaperProps, Skeleton } from '@mui/material';
import CheckCircleOutlineRoundedIcon from '@mui/icons-material/CheckCircleOutlineRounded';
import HighlightOffRoundedIcon from '@mui/icons-material/HighlightOffRounded';
import { CheckAnswerByIdStore } from '../Store/check-answer-by-id-store';
import ReviewAnswerContent from './review-answer-content';
import UIHelpTextV1 from './ui-help-text-v1';
import UIHelpTextV2 from './ui-help-text-v2';
import UIHelpTextV3 from './ui-help-text-v3';
import UIAnswerNumber from './ui-answer-number';
import UICreateErrorReport from './ui-create-error-report';
import UICreateErrorReportDialog from './ui-create-error-report-dialog';
import UIAnswerReportSaveMessage from './ui-answer-report-save-message';

interface ICheckAnswerUIProps extends PaperProps {
  answerStore: CheckAnswerByIdStore;
  answerIndex: number;
}

const CheckAnswerUI = observer(
  ({
    answerStore,
    answerIndex,
    className = '',
    ...props
  }: ICheckAnswerUIProps) => (
    <Paper
      component="article"
      elevation={0}
      {...props}
      className={`sw-review-answer ${className}`}
    >
      <UICreateErrorReportDialog answerStore={answerStore} />
      <UIAnswerReportSaveMessage answerStore={answerStore} />
      <header className="sw-review-answer-heading">
        <div className="sw-review-answer-label">
          <UIAnswerNumber answerIndex={answerIndex} />
          {answerStore.isAnswerDataLoaded && answerStore.answerData && (
            <span
              className={`sw-review-answer-status ${answerStore.answerData.isTrue ? 'is-correct' : 'is-incorrect'}`}
            >
              {answerStore.answerData.isTrue ? (
                <CheckCircleOutlineRoundedIcon />
              ) : (
                <HighlightOffRoundedIcon />
              )}
              {answerStore.answerData.isTrue
                ? 'Верный ответ'
                : 'Неверный ответ'}
            </span>
          )}
        </div>
        {answerStore.isAnswerDataLoaded && (
          <UICreateErrorReport answerStore={answerStore} />
        )}
      </header>
      {answerStore.hasLoadError ? (
        <Alert
          severity="error"
          action={
            <Button
              color="inherit"
              onClick={() => answerStore.loadAnswerData()}
            >
              Повторить
            </Button>
          }
        >
          Не удалось загрузить ответ.
        </Alert>
      ) : answerStore.isAnswerDataLoaded && answerStore.answerData ? (
        <div className="sw-review-answer-grid">
          <ReviewAnswerContent answer={answerStore.answerData} />
          <div className="sw-review-hints">
            <UIHelpTextV1 answerStore={answerStore} />
            <UIHelpTextV2 answerStore={answerStore} />
            <UIHelpTextV3 answerStore={answerStore} />
          </div>
        </div>
      ) : (
        <div
          className="sw-review-answer-grid"
          aria-busy="true"
          aria-label="Загрузка ответа"
        >
          <Skeleton variant="rounded" height={200} />
          <div>
            <Skeleton height={60} />
            <Skeleton height={60} />
            <Skeleton height={60} />
          </div>
        </div>
      )}
    </Paper>
  ),
);

export default CheckAnswerUI;
