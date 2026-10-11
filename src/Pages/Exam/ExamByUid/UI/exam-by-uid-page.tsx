import { useUserSession } from '../../../../Shared/Store/UserStore/user-session';
import { Alert, Button, CircularProgress, Paper, Stack } from '@mui/material';
import { useEffect } from 'react';
import {
  loadExamDataThunk,
  openExamPageThunk,
} from '../redux-store/AsyncActions';
import UIExamName from './ui-exam-name';
import UIExamQuestionProgress from './mini-question-selector/ui-exam-questions-progress';
import QuestionPlayer from './question-player/question-player';
import { isMobileHook } from '../../../../Shared/CustomHooks/isMobileHook';
import {
  useAppDispatch,
  useAppSelector,
} from '../../../../App/ReduxStore/RootStore';
import { useParams } from 'react-router-dom';
import { observer } from 'mobx-react';
import { resetExam } from '../redux-store/ExamPlayerSlice';
import UIAccessPassword from './ui-access-password';

const ExamByUIDPge = observer(({ ...props }) => {
  const session = useUserSession();
  const isMobile = isMobileHook();
  const dispatch = useAppDispatch();
  const { uid } = useParams();
  const access_mode = useAppSelector(
    state => state.examPlayer?.exam_data?.access_mode,
  );
  const is_enable_password_check = useAppSelector(
    state => state.examPlayer?.exam_data?.is_enable_password_check,
  );
  const exam = useAppSelector(state => state.examPlayer.exam_data);
  const loadingExam = useAppSelector(state => state.examPlayer.loading_exam);
  const examError = useAppSelector(state => state.examPlayer.exam_load_error);
  const opening = useAppSelector(
    state => state.examPlayer.loading_question_statuses,
  );
  const openError = useAppSelector(
    state => state.examPlayer.question_statuses_load_error,
  );
  const is_password_check_passed = useAppSelector(
    state => state.examPlayer?.is_password_check_passed,
  );
  const remaining_minutes = useAppSelector(
    state => state.examPlayer?.remaining_minutes,
  );

  useEffect(() => {
    if (session.isLogin && uid) {
      dispatch(resetExam());
      const request = dispatch(loadExamDataThunk(uid));
      return () => {
        request.abort();
        dispatch(resetExam());
      };
    }
  }, [uid, session.isLogin, dispatch]);
  useEffect(() => {
    if (
      session.isLogin &&
      uid &&
      exam?.uid === uid &&
      !exam.is_enable_password_check &&
      exam.access_mode !== 'closed'
    ) {
      const request = dispatch(openExamPageThunk(uid));
      return () => {
        request.abort();
      };
    }
  }, [
    uid,
    exam?.uid,
    exam?.is_enable_password_check,
    exam?.access_mode,
    session.isLogin,
    dispatch,
  ]);
  if (!session.isLogin) {
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
  if (loadingExam) return <CircularProgress />;
  if (examError || !exam)
    return (
      <Alert
        severity="error"
        action={
          <Button onClick={() => uid && dispatch(loadExamDataThunk(uid))}>
            Повторить
          </Button>
        }
      >
        Не удалось загрузить экзамен
      </Alert>
    );
  if (remaining_minutes < 0) {
    return <Alert severity={'error'}>Время экзамена закончилось</Alert>;
  }

  if (access_mode === 'closed') {
    return (
      <Alert severity={'info'}>
        Преподаватель еще не открыл доступ для этого экзамена, для новой попытки
        входа обновите страницу
      </Alert>
    );
  }

  if (is_enable_password_check && !is_password_check_passed) {
    return <UIAccessPassword />;
  }

  if (opening) return <CircularProgress />;
  if (openError)
    return (
      <Alert
        severity="error"
        action={
          <Button onClick={() => uid && dispatch(openExamPageThunk(uid))}>
            Повторить
          </Button>
        }
      >
        {openError}
      </Alert>
    );
  return (
    <Paper elevation={0} {...props} sx={{ p: isMobile ? 0 : 2 }}>
      <UIExamName />
      <UIExamQuestionProgress />
      <QuestionPlayer />
    </Paper>
  );
});

export default ExamByUIDPge;
