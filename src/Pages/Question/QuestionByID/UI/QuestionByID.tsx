import React, { useEffect, useMemo, useState } from 'react';
import { observer } from 'mobx-react';
import { QuestionPlayerStore } from '../Store/QuestionPlayerStore';
import UiQuestionData from './ui-question-data';
import { Alert, Button, Box, CircularProgress, Stack } from '@mui/material';

import { useLocation, useParams } from 'react-router-dom';
import { RequireLogInAlert } from '../../../../App/SharedComponents/Notifications/RequireLogInAlert';
import { UserStorage } from '../../../../Shared/Store/UserStore/UserStore';

import UiCreateAnswerErrorReport from './ui-create-answer-error-report';
import UISelectHardLevel from './ui-select-hard-level';
import UIAnswers from './ui-answers';
import UIStatistic from './ui-statistic';
import UIHelpText from './ui-help-text';
import UIAnswerReportSuccessSavedMessage from './ui-answer-report-success-saved-message';
import { NoAnswers } from './no-answers';
import { useGetQuestionPlayerDataQuery } from '../../question-read-api';
import { runInAction } from 'mobx';

export const QuestionByID = observer((props: any) => {
  const slug = useLocation();

  const { id } = useParams();

  const questionId = Number(id ?? props.id);
  const examMode = new URLSearchParams(slug.search).get('exam') === 'true';
  const userId = UserStorage.user_data?.id;
  const [restart, setRestart] = useState(0);
  const questionStore = useMemo(() => {
    const store = new QuestionPlayerStore(null, questionId);
    store.changeIsUseExamMode(examMode);
    return store;
  }, [questionId, examMode, userId, restart]);
  const query = useGetQuestionPlayerDataQuery(
    { id: questionId, examMode, userId },
    {
      skip:
        !UserStorage.isLogin || !Number.isInteger(questionId) || questionId < 1,
    },
  );
  useEffect(() => () => questionStore.dispose(), [questionStore]);
  useEffect(() => {
    const data = query.currentData;
    if (data) runInAction(() => questionStore.applyQuestionData(data));
  }, [query.currentData, questionStore]);
  useEffect(() => {
    if (questionStore.questionHasBeenCompleted)
      props.questionHasBeenCompleted?.(true);
  }, [questionStore.questionHasBeenCompleted, props.questionHasBeenCompleted]);
  const restartQuestion = () => setRestart(value => value + 1);

  if (!UserStorage.isLogin) {
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
});
