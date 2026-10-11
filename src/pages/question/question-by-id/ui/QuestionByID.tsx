import { useUserSession } from '../../../../shared/store/user-store/user-session';
import React, { useEffect, useState } from 'react';
import { useQuestionPlayer } from '../store/QuestionPlayerStore';
import UiQuestionData from './ui-question-data';
import { Alert, Button, Box, CircularProgress, Stack } from '@mui/material';
import { useLocation, useParams } from 'react-router-dom';
import { RequireLogInAlert } from '../../../../app/shared-components/notifications/RequireLogInAlert';
import UiCreateAnswerErrorReport from './ui-create-answer-error-report';
import UISelectHardLevel from './ui-select-hard-level';
import UIAnswers from './ui-answers';
import UIStatistic from './ui-statistic';
import UIHelpText from './ui-help-text';
import UIAnswerReportSuccessSavedMessage from './ui-answer-report-success-saved-message';
import { NoAnswers } from './no-answers';
import { useGetQuestionPlayerDataQuery } from '../../question-read-api';
export const QuestionByID = (props: any) => {
  const session = useUserSession();
  const slug = useLocation();
  const { id } = useParams();
  const questionId = Number(id ?? props.id);
  const examMode = new URLSearchParams(slug.search).get('exam') === 'true';
  const userId = session.user?.id;
  const [restart, setRestart] = useState(0);
  const query = useGetQuestionPlayerDataQuery(
    { id: questionId, examMode, userId },
    {
      skip: !session.isLogin || !Number.isInteger(questionId) || questionId < 1,
    },
  );
  const questionStore = useQuestionPlayer(
    questionId,
    examMode,
    restart,
    query.currentData,
  );
  useEffect(() => {
    if (questionStore.questionHasBeenCompleted)
      props.questionHasBeenCompleted?.(true);
  }, [questionStore.questionHasBeenCompleted, props.questionHasBeenCompleted]);
  const restartQuestion = () => setRestart(value => value + 1);
  if (!session.isLogin) {
    return <RequireLogInAlert requireShow />;
  }
  if (query.isError)
    return (
      <Alert
        severity="error"
        action={<Button onClick={() => query.refetch()}>Повторить</Button>}
      >
        Не удалось загрузить вопрос.
      </Alert>
    );
  if (!questionStore?.isDataLoaded) {
    return (
      <Stack
        sx={{
          alignItems: 'center',
        }}
      >
        <CircularProgress />
      </Stack>
    );
  }
  if (!questionStore?.answersArray?.length) {
    return <NoAnswers />;
  }
  if (!questionStore?.questionHasBeenStarted) {
    return <UISelectHardLevel questionStore={questionStore} />;
  }
  if (
    questionStore?.questionHasBeenCompleted ||
    questionStore?.isAcceptDefeat
  ) {
    return (
      <UIStatistic
        questionStore={questionStore}
        restartQuestion={restartQuestion}
      />
    );
  }
  return (
    <Box>
      <UiQuestionData
        ignoreAspectRatio={true}
        onChange1={e => {
          questionStore?.changeHardLevelOfHelpText(e.target.value);
        }}
        onClick1={() => questionStore?.checkErrors()}
        height={window.innerHeight}
        width={window.innerWidth - 100}
        urlHasBeenPassed={true}
        questionText={questionStore?.questionText}
        questionImgUrl={questionStore?.questionImageUrl}
        onAcceptDefeat={() => questionStore.onAcceptDefeat()}
      />
      <UIHelpText questionStore={questionStore} />
      <UiCreateAnswerErrorReport questionStore={questionStore} />
      <UIAnswerReportSuccessSavedMessage questionStore={questionStore} />
      <UIAnswers questionStore={questionStore} />
    </Box>
  );
};
