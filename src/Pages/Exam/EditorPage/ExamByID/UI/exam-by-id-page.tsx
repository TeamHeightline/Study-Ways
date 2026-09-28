import { observer } from 'mobx-react';
import React, { useEffect } from 'react';
import { PaperProps } from '@mui/material/Paper/Paper';
import { CircularProgress, Typography, Paper, Stack } from '@mui/material';
import GoBackButton from './go-back';
import ExamName from './exam-name';

import UIDuration from './ui-duration';
import SelectedQSByData from './ui-seleced-qs-by-data';
import UIExamUrls from './ui-exam-urls';
import { useSelector } from 'react-redux';
import { loadExamDataThunk } from '../redux-store/async-actions';
import AutoSaveModule from './auto-save-module';
import Index from '../../../ExamResultsByID/UI';

import {
  RootState,
  useAppDispatch,
} from '../../../../../App/ReduxStore/RootStore';
import UIAccessModeSelector from './ui-access-mode-selector';
import UIIsEnableHelpText from './ui-is-enable-help-text';
import UIHelpTextLevel from './ui-help-text-level';
import UIIsEnablePasswordCheck from './ui-is-enable-password-check';
import UIPassword from './ui-password';
import UIMaxAttemptsForQuestions from './ui-max-attempts-for-questions';
import UIIsEnableStartAndFinishTime from './ui-is-enable-start-and-finish-time';
import UIStartAndFinishTime from './ui-start-and-finish-time';
import UIIsEnableMaxQuestionAttempts from './ui-is-enable-max-question-attempts';

interface IExamByIDProps extends PaperProps {
  exam_id: number;
}

const ExamByID = observer(({ exam_id, ...props }: IExamByIDProps) => {
  const loadedExamDataID = useSelector(
    (state: RootState) => state?.examEditor?.exam_data?.id,
  );
  const dispatch = useAppDispatch();


  useEffect(() => {
    dispatch(loadExamDataThunk(String(exam_id)));
  }, [exam_id]);

  if (Number(loadedExamDataID) !== Number(exam_id)) {
    return (
      <Stack alignItems={'center'}>
        <CircularProgress />
      </Stack>
    );
  }
  return (
    <Paper elevation={0} {...props} className="sw-exam-editor">
      <AutoSaveModule />
      <header className="sw-exam-heading">
        <div><Typography variant="h5" component="h1">Редактор экзамена</Typography><Typography variant="body2" color="text.secondary">Содержание, правила прохождения и доступ для участников.</Typography></div>
        <GoBackButton />
      </header>
      <div className="sw-exam-settings-grid">
        <section className="sw-exam-panel">
          <div className="sw-exam-panel-heading"><span>01</span><div><Typography variant="h6">Об экзамене</Typography><Typography variant="body2" color="text.secondary">Название, длительность и серия вопросов.</Typography></div></div>
          <Stack spacing={2.5}><ExamName /><UIDuration /><SelectedQSByData /></Stack>
        </section>
        <section className="sw-exam-panel">
          <div className="sw-exam-panel-heading"><span>02</span><div><Typography variant="h6">Правила прохождения</Typography><Typography variant="body2" color="text.secondary">Подсказки и количество попыток на вопрос.</Typography></div></div>
          <div className="sw-exam-option"><UIIsEnableHelpText /><UIHelpTextLevel /></div>
          <div className="sw-exam-option"><UIIsEnableMaxQuestionAttempts /><UIMaxAttemptsForQuestions /></div>
        </section>
        <section className="sw-exam-panel">
          <div className="sw-exam-panel-heading"><span>03</span><div><Typography variant="h6">Доступ к экзамену</Typography><Typography variant="body2" color="text.secondary">Управляйте доступом и защитой паролем.</Typography></div></div>
          <UIAccessModeSelector />
          <div className="sw-exam-option"><UIIsEnablePasswordCheck /><UIPassword /></div>
          <div className="sw-exam-option"><UIIsEnableStartAndFinishTime /><UIStartAndFinishTime /></div>
        </section>
        <section className="sw-exam-panel sw-exam-share-panel">
          <div className="sw-exam-panel-heading"><span>04</span><div><Typography variant="h6">Ссылки для участников</Typography><Typography variant="body2" color="text.secondary">Откройте экзамен или отправьте ссылку ученикам.</Typography></div></div>
          <UIExamUrls />
        </section>
      </div>
      <section className="sw-exam-results">
        <Typography variant="h6">Результаты экзамена</Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>Статистика прохождения и выгрузка результатов.</Typography>
        {exam_id && <Index exam_id={Number(exam_id)} />}
      </section>
    </Paper>
  );
});

export default ExamByID;
