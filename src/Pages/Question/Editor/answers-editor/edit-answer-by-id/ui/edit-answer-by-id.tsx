import React, { useEffect } from 'react';
import { Alert, Button, PaperProps, Skeleton } from '@mui/material';
import { useUserSession } from '../../../../../../Shared/Store/UserStore/user-session';
import {
  EditorAnswer,
  useGetEditorAnswerQuery,
} from '../../../../question-read-api';
import { useAppDispatch } from '../../../../../../App/ReduxStore/RootStore';
import { initializeAnswer } from '../model/answer-editor-slice';
import { useAnswerEditorController } from '../model/use-answer-editor';
import EditAnswerUI from './edit-answer-ui';

interface EditAnswerByIDProps extends PaperProps {
  answer_id: number;
  answer_index?: number;
  initialData?: EditorAnswer;
}
export default function EditAnswerByID(props: EditAnswerByIDProps) {
  const session = useUserSession();
  if (!session.user || !['ADMIN', 'TEACHER'].includes(session.role))
    return (
      <Alert severity="warning">
        Редактирование ответов доступно преподавателям и администраторам.
      </Alert>
    );
  return (
    <AnswerLoader
      key={`${session.user.id}:${props.answer_id}`}
      {...props}
      userId={session.user.id}
      role={session.role}
    />
  );
}
function AnswerLoader({
  answer_id,
  answer_index,
  initialData,
  userId,
  role,
  ...props
}: EditAnswerByIDProps & { userId: number; role: string }) {
  const query = useGetEditorAnswerQuery(
    { id: answer_id, userId },
    {
      skip: !!initialData || !Number.isSafeInteger(answer_id) || answer_id <= 0,
    },
  );
  const data = initialData ?? query.currentData;
  const allowed =
    !!data && (role === 'ADMIN' || data.question.createdById === userId);
  const dispatch = useAppDispatch();
  const key = `${userId}:${answer_id}`;
  useEffect(() => {
    if (data && allowed) dispatch(initializeAnswer({ key, draft: data }));
  }, [dispatch, key, data, allowed]);
  if (data && !allowed)
    return (
      <Alert severity="warning">
        Редактировать ответ может автор вопроса или администратор.
      </Alert>
    );
  if (!Number.isSafeInteger(answer_id) || answer_id <= 0)
    return <Alert severity="error">Некорректный номер ответа.</Alert>;
  if ((!data && query.isError) || data === null)
    return (
      <Alert
        severity="error"
        action={<Button onClick={() => query.refetch()}>Повторить</Button>}
      >
        Не удалось загрузить ответ №{answer_id}.
      </Alert>
    );
  if (!data)
    return (
      <Skeleton variant="rounded" height={210} aria-label="Загрузка ответа" />
    );
  return (
    <>
      {query.isError && (
        <Alert
          severity="error"
          action={<Button onClick={() => query.refetch()}>Повторить</Button>}
        >
          Не удалось обновить ответ. Ваши изменения сохранены в редакторе.
        </Alert>
      )}
      <ReadyAnswer
        {...props}
        editorKey={key}
        userId={userId}
        answer_index={answer_index}
      />
    </>
  );
}
function ReadyAnswer({
  editorKey,
  userId,
  answer_index,
  ...props
}: PaperProps & { editorKey: string; userId: number; answer_index?: number }) {
  const controller = useAnswerEditorController(editorKey, userId);
  if (!controller)
    return (
      <Skeleton variant="rounded" height={210} aria-label="Загрузка ответа" />
    );
  return (
    <EditAnswerUI
      {...props}
      answerStore={controller}
      answer_index={answer_index}
    />
  );
}
