import React, { useEffect, useState } from 'react';
import { observer } from 'mobx-react';
import { useAuth0 } from '@auth0/auth0-react';
import { skipToken } from '@reduxjs/toolkit/query';
import { AccountCircle } from '@mui/icons-material';
import {
  Alert,
  Button,
  CircularProgress,
  FormControlLabel,
  InputAdornment,
  Pagination,
  Stack,
  Switch,
  TextField,
} from '@mui/material';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { UserStorage } from '../../../Shared/Store/UserStore/UserStore';
import { RequireLogInAlert } from '../../../App/SharedComponents/Notifications/RequireLogInAlert';
import { ShowStatisticTable } from './show-statistic-for-selected-questions/ShowStatisticTable';
import { SpecificQuestion } from './show-statistic-for-selected-questions/statistic-selector/UI/SpecificQuestion';
import {
  useGetStatisticAttemptsQuery,
  useGetStatisticQuestionsQuery,
} from './Store/statistic-api';

function todayStart() {
  const date = new Date();
  date.setHours(0, 0, 0, 0);
  return date;
}

function LoadingStatistic() {
  return (
    <Stack alignItems="center" role="status" sx={{ py: 4 }}>
      <CircularProgress aria-label="Загрузка статистики" />
    </Stack>
  );
}

function StatisticContent({ userId }: { userId: number }) {
  const [nameInput, setNameInput] = useState('');
  const [filters, setFilters] = useState(() => ({
    page: 1,
    userName: '',
    questionId: null as number | null,
    afterTime: todayStart() as Date | null,
    onlyInExam: false,
  }));
  useEffect(() => {
    if (nameInput === filters.userName) return;
    const timer = setTimeout(() => {
      setFilters(current => ({ ...current, userName: nameInput, page: 1 }));
    }, 350);
    return () => clearTimeout(timer);
  }, [nameInput, filters.userName]);

  const validTime =
    filters.afterTime !== null && Number.isFinite(filters.afterTime.getTime());
  const questions = useGetStatisticQuestionsQuery(userId);
  const attempts = useGetStatisticAttemptsQuery(
    validTime
      ? {
          userId,
          page: filters.page,
          userName: filters.userName,
          questions: filters.questionId === null ? [] : [filters.questionId],
          afterTime: filters.afterTime!.toISOString(),
          onlyInExam: filters.onlyInExam,
          onlyInQs: false,
        }
      : skipToken,
    { pollingInterval: 7000, refetchOnMountOrArgChange: true },
  );
  const data = attempts.currentData;

  return (
    <>
      <div className="sw-statistics-filters">
        <div className="sw-statistics-fields">
          <div>
            <TextField
              size="small"
              fullWidth
              label="Имя пользователя"
              value={nameInput}
              onChange={event => setNameInput(event.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <AccountCircle />
                  </InputAdornment>
                ),
              }}
            />
          </div>
          <SpecificQuestion
            questions={questions.currentData ?? []}
            value={filters.questionId}
            loading={questions.isFetching}
            onChange={questionId =>
              setFilters(current => ({ ...current, questionId, page: 1 }))
            }
          />
          <div>
            <DateTimePicker
              label="Результаты начиная с"
              value={filters.afterTime}
              onChange={value =>
                setFilters(current => ({
                  ...current,
                  afterTime: value === null ? null : new Date(Number(value)),
                  page: 1,
                }))
              }
              renderInput={params => (
                <TextField {...params} size="small" fullWidth />
              )}
            />
          </div>
        </div>
        <div className="sw-statistics-options">
          <FormControlLabel
            sx={{ pl: 1 }}
            control={
              <Switch
                color="primary"
                checked={filters.onlyInExam}
                onChange={event =>
                  setFilters(current => ({
                    ...current,
                    onlyInExam: event.target.checked,
                    page: 1,
                  }))
                }
              />
            }
            label="Только режим экзамена"
          />
          <span>Результаты обновляются автоматически</span>
        </div>
      </div>
      {questions.isError && (
        <Alert
          severity="warning"
          sx={{ mb: 2 }}
          action={
            <Button onClick={() => questions.refetch()}>Повторить</Button>
          }
        >
          Не удалось загрузить список вопросов. Остальные фильтры доступны.
        </Alert>
      )}
      {!validTime ? (
        <Alert severity="info">Укажите корректные дату и время.</Alert>
      ) : (
        <>
          {attempts.isError && (
            <Alert
              severity="error"
              sx={{ mb: 2 }}
              action={
                <Button onClick={() => attempts.refetch()}>Повторить</Button>
              }
            >
              Не удалось загрузить статистику.
            </Alert>
          )}
          {!data ? (
            !attempts.isError && <LoadingStatistic />
          ) : !data.ids.length ? (
            <Alert severity="info">
              По выбранным фильтрам попытки не найдены.
            </Alert>
          ) : (
            <div aria-busy={attempts.isFetching}>
              <ShowStatisticTable
                attempt_id_array={data.ids}
                pageChanger={
                  data.numPages > 1 ? (
                    <Stack alignItems="center" sx={{ py: 2 }}>
                      <Pagination
                        page={data.activePage}
                        count={data.numPages}
                        onChange={(_, page) =>
                          setFilters(current => ({ ...current, page }))
                        }
                        disabled={attempts.isFetching}
                      />
                    </Stack>
                  ) : undefined
                }
              />
            </div>
          )}
        </>
      )}
    </>
  );
}

export const StatisticV2 = observer(() => {
  const { isLoading, isAuthenticated } = useAuth0();
  const user = UserStorage.user_data;
  return (
    <div className="sw-statistics-page">
      <div className="sw-statistics-heading">
        <h2>Статистика прохождения</h2>
        <p>
          Найдите результаты по пользователю, вопросу и времени прохождения.
        </p>
      </div>
      {isLoading || (isAuthenticated && !user) ? (
        <LoadingStatistic />
      ) : !isAuthenticated ? (
        <RequireLogInAlert requireShow />
      ) : !['ADMIN', 'TEACHER'].includes(user!.user_access_level) ? (
        <Alert severity="error">
          Недостаточно прав для просмотра статистики.
        </Alert>
      ) : (
        <StatisticContent key={user!.id} userId={user!.id} />
      )}
    </div>
  );
});
