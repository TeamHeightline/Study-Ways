import { Alert, Button, Box } from '@mui/material';
import { useEffect, useRef } from 'react';
import {
  useAppDispatch,
  useAppSelector,
} from '../../../../../App/ReduxStore/RootStore';
import { updateExamThunk } from '../redux-store/async-actions';
import {
  IExamData,
  prepareForUpdateExamData,
} from '../redux-store/examEditorSlice';
export default function AutoSaveModule() {
  const exam = useAppSelector(state => state.examEditor.exam_data);
  const error = useAppSelector(state => state.examEditor.update_exam_error);
  const dispatch = useAppDispatch();
  const previous = useRef(exam),
    pending = useRef<IExamData | null>(null);
  useEffect(() => {
    if (previous.current === exam || !exam) return;
    previous.current = exam;
    pending.current = exam;
    dispatch(prepareForUpdateExamData());
    const timer = setTimeout(() => {
      if (pending.current) {
        dispatch(updateExamThunk(pending.current));
        pending.current = null;
      }
    }, 2000);
    return () => clearTimeout(timer);
  }, [exam, dispatch]);
  useEffect(
    () => () => {
      if (pending.current) dispatch(updateExamThunk(pending.current));
    },
    [dispatch],
  );
  return error ? (
    <Alert
      severity="error"
      action={
        <Button onClick={() => exam && dispatch(updateExamThunk(exam))}>
          Повторить
        </Button>
      }
    >
      {String(error)}. Изменения остаются в редакторе.
    </Alert>
  ) : (
    <Box />
  );
}
