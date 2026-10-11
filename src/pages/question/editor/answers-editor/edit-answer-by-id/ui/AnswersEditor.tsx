import React, { useRef, useState } from 'react';
import { Alert, Button, Typography } from '@mui/material';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import { useGetQuestionEditorDataQuery } from '../../../../question-read-api';
import {
  useAppDispatch,
  useAppSelector,
} from '../../../../../../app/redux-store/RootStore';
import {
  useUserSession,
  selectUserSession,
} from '../../../../../../shared/store/user-store/user-session';
import { useCreateAnswerMutation } from '../../../../../../shared/server-layer/query-layer/write-api';
import { getAuthSessionVersion } from '../../../../../../shared/server-layer/query-layer/auth-session';
import { useStore } from 'react-redux';
import type { RootState } from '../../../../../../app/redux-store/RootStore';
import { cacheCreatedAnswer } from '../model/cache-created-answer';
import EditAnswerByID from './edit-answer-by-id';
import TotalAnswersStatistic from './total-answers-statistic';

export function AnswersEditor({
  questionId,
  numberOfShowingAnswers,
}: {
  questionId: number;
  numberOfShowingAnswers: number;
}) {
  const session = useUserSession();
  const userId = session.user?.id;
  const dispatch = useAppDispatch();
  const store = useStore<RootState>();
  const [createAnswer, creation] = useCreateAnswerMutation();
  const creating = useRef(false);
  const [createError, setCreateError] = useState(false);
  const allowed = !!userId && ['ADMIN', 'TEACHER'].includes(session.role);
  const query = useGetQuestionEditorDataQuery(
    { id: questionId, userId },
    { skip: !allowed || !questionId },
  );
  const entries = useAppSelector(state => state.answerEditor.entries);
  const question = query.currentData;
  if (!allowed)
    return (
      <Alert severity="warning">
        Редактирование ответов доступно преподавателям и администраторам.
      </Alert>
    );
  if (!question)
    return query.isError ? (
      <Alert
        severity="error"
        action={<Button onClick={() => query.refetch()}>Повторить</Button>}
      >
        Не удалось загрузить ответы.
      </Alert>
    ) : null;
  const canEdit = session.role === 'ADMIN' || question.createdById === userId;
  if (!canEdit)
    return (
      <Alert severity="warning">
        Редактировать ответы может автор вопроса или администратор.
      </Alert>
    );
  const answers = question.answers
    .filter(answer => {
      const entry = entries[`${userId}:${answer.id}`];
      return !(entry
        ? entry.draft.isDeleted && entry.saveState === 'saved'
        : answer.isDeleted);
    })
    .sort((a, b) => Number(a.id) - Number(b.id));
  const drafts = answers.map(
    answer => entries[`${userId}:${answer.id}`]?.draft ?? answer,
  );
  const create = async () => {
    if (creating.current) return;
    creating.current = true;
    setCreateError(false);
    const version = getAuthSessionVersion();
    try {
      const current = selectUserSession(store.getState());
      if (
        current.user?.id !== userId ||
        !['ADMIN', 'TEACHER'].includes(current.role)
      )
        return;
      const answer = await createAnswer({ questionId }).unwrap();
      if (getAuthSessionVersion() === version)
        cacheCreatedAnswer(dispatch, userId!, answer);
    } catch {
      if (getAuthSessionVersion() === version) setCreateError(true);
    } finally {
      creating.current = false;
    }
  };
  return (
    <section className="sw-qedit-answers" aria-labelledby="qedit-answers-title">
      <header className="sw-qedit-answers-heading">
        <div>
          <Typography component="h2" id="qedit-answers-title">
            Варианты ответа
          </Typography>
          <Typography component="p">
            Отметьте верные варианты и добавьте подсказки для разных уровней
            сложности.
          </Typography>
        </div>
        <Button
          startIcon={<AddRoundedIcon />}
          variant="contained"
          disableElevation
          loading={creation.isLoading}
          onClick={create}
        >
          Добавить ответ
        </Button>
      </header>
      {createError && (
        <Alert
          severity="error"
          action={<Button onClick={create}>Повторить</Button>}
        >
          Не удалось создать ответ.
        </Alert>
      )}
      {query.isError && (
        <Alert
          severity="error"
          action={<Button onClick={() => query.refetch()}>Повторить</Button>}
        >
          Не удалось обновить список ответов.
        </Alert>
      )}
      <TotalAnswersStatistic
        answers={drafts}
        numberOfShowingAnswers={numberOfShowingAnswers}
      />
      <div className="sw-qedit-answer-list">
        {answers.length === 0 ? (
          <div className="sw-qedit-empty">
            <Typography component="h3">
              Добавьте первый вариант ответа
            </Typography>
            <Typography component="p">
              В вопросе могут быть один или несколько верных вариантов.
            </Typography>
          </div>
        ) : (
          answers.map((answer, index) => (
            <EditAnswerByID
              key={`${userId}:${answer.id}`}
              answer_id={Number(answer.id)}
              initialData={answer}
              answer_index={index}
            />
          ))
        )}
      </div>
    </section>
  );
}
