import { useUserSession } from '../../../../../../Shared/Store/UserStore/user-session';
import React, { useEffect, useMemo } from 'react';
import { PaperProps } from '@mui/material';
import { EditAnswerByIdStore } from '../Store/edit-answer-by-id-store';
import EditAnswerUI from './edit-answer-ui';
import {
  EditorAnswer,
  useGetEditorAnswerQuery,
  questionReadApi,
} from '../../../../question-read-api';
import { useAppDispatch } from '../../../../../../App/ReduxStore/RootStore';
import { runInAction } from 'mobx';

interface EditAnswerByIDProps extends PaperProps {
  answer_id: number;
  answer_index?: number;
  initialData?: EditorAnswer;
}
export default function EditAnswerByID({
  answer_id,
  answer_index,
  initialData,
  ...props
}: EditAnswerByIDProps) {
  const session = useUserSession();
  const store = useMemo(() => new EditAnswerByIdStore(answer_id), [answer_id]);
  const dispatch = useAppDispatch();
  const query = useGetEditorAnswerQuery(
    { id: answer_id, userId: session.user?.id },
    { skip: !!initialData },
  );
  useEffect(() => {
    runInAction(() => {
      const data = initialData ?? query.currentData;
      if (data) store.initializeAnswerData(data);
      store.hasLoadError = query.isError || query.currentData === null;
      store.reload = query.refetch;
      store.invalidate = () =>
        dispatch(
          questionReadApi.util.invalidateTags([
            { type: 'AnswerEditor', id: answer_id },
            { type: 'QuestionAnswers', id: Number(data?.question.id) },
            { type: 'QuestionEditor', id: Number(data?.question.id) },
            { type: 'Question', id: Number(data?.question.id) },
          ]),
        );
    });
  }, [
    initialData,
    query.currentData,
    query.isError,
    query.refetch,
    store,
    dispatch,
    answer_id,
  ]);
  return (
    <EditAnswerUI {...props} answerStore={store} answer_index={answer_index} />
  );
}
