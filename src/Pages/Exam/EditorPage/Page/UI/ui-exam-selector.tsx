import {
  Alert,
  Button,
  IconButton,
  InputAdornment,
  Paper,
  Skeleton,
  Snackbar,
  TextField,
  Tooltip,
} from '@mui/material';
import { PaperProps } from '@mui/material/Paper/Paper';
import { useEffect, useMemo, useState } from 'react';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import RefreshRoundedIcon from '@mui/icons-material/RefreshRounded';
import AssignmentOutlinedIcon from '@mui/icons-material/AssignmentOutlined';
import ManageSearchRoundedIcon from '@mui/icons-material/ManageSearchRounded';
import { loadMyExamsAsync } from '../redux-store/async-actions';
import {
  RootState,
  useAppDispatch,
  useAppSelector,
} from '../../../../../App/ReduxStore/RootStore';
import UIExamCard from './ui-exam-card';
import UICreateExam from './ui-create-exam';
import UICreateExamDialog from './ui-create-exam-dialog';
import { matchesExam } from '../exam-list-utils';
import '../exam-selector.css';

export default function UIExamSelector({
  className = '',
  ...props
}: PaperProps) {
  const dispatch = useAppDispatch();
  const {
    exams,
    loading_exams: loading,
    exams_load_error: error,
  } = useAppSelector((state: RootState) => state.examEditorPageReducer);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [feedback, setFeedback] = useState<{
    message: string;
    severity: 'success' | 'error';
  } | null>(null);
  useEffect(() => {
    dispatch(loadMyExamsAsync());
  }, [dispatch]);
  const initialLoading = loading && !exams.length;
  const visible = useMemo(
    () =>
      exams.filter(
        exam =>
          (filter === 'all' || exam.access_mode === filter) &&
          matchesExam(exam, search),
      ),
    [exams, search, filter],
  );
  const isFiltered = !!search.trim() || filter !== 'all';
  const reset = () => {
    setSearch('');
    setFilter('all');
  };
  return (
    <Paper elevation={0} className={`sw-examlist ${className}`} {...props}>
      <header className="sw-examlist-heading">
        <div className="sw-card-library-heading">
          <h1 className="sw-card-library-title">Мои экзамены</h1>
          <p>
            Создавайте экзамены, настраивайте правила прохождения и доступ для
            участников.
          </p>
        </div>
        <UICreateExam />
      </header>
      <div
        className="sw-examlist-summary"
        role="group"
        aria-label="Фильтр экзаменов по доступу"
      >
        {[
          { value: 'all', label: 'Всего экзаменов' },
          { value: 'open', label: 'Открытый доступ' },
          { value: 'closed', label: 'Закрытый доступ' },
        ].map(item => (
          <button
            type="button"
            key={item.value}
            aria-pressed={filter === item.value}
            disabled={initialLoading}
            onClick={() => setFilter(item.value)}
            className={filter === item.value ? 'is-selected' : ''}
          >
            <strong>
              {initialLoading ? (
                <Skeleton width={25} />
              ) : item.value === 'all' ? (
                exams.length
              ) : (
                exams.filter(exam => exam.access_mode === item.value).length
              )}
            </strong>
            <span>{item.label}</span>
          </button>
        ))}
      </div>
      <div className="sw-examlist-toolbar">
        <TextField
          fullWidth
          size="small"
          label="Поиск экзамена"
          placeholder="Название, серия вопросов или номер"
          value={search}
          onChange={event => setSearch(event.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchRoundedIcon />
              </InputAdornment>
            ),
            endAdornment: search ? (
              <InputAdornment position="end">
                <IconButton
                  size="small"
                  aria-label="Очистить поиск экзаменов"
                  onClick={() => setSearch('')}
                >
                  <CloseRoundedIcon />
                </IconButton>
              </InputAdornment>
            ) : undefined,
          }}
        />
        <div>
          <span aria-live="polite">
            {isFiltered
              ? `Найдено: ${visible.length}`
              : 'Выберите экзамен для редактирования'}
          </span>
          <Tooltip title="Обновить список">
            <span>
              <IconButton
                aria-label="Обновить список экзаменов"
                disabled={loading}
                onClick={() => dispatch(loadMyExamsAsync())}
              >
                <RefreshRoundedIcon />
              </IconButton>
            </span>
          </Tooltip>
        </div>
      </div>
      {error && (
        <Alert
          severity="error"
          className="sw-examlist-alert"
          action={
            <Button
              color="inherit"
              onClick={() => dispatch(loadMyExamsAsync())}
            >
              Повторить
            </Button>
          }
        >
          Не удалось загрузить экзамены. Попробуйте ещё раз.
        </Alert>
      )}
      {initialLoading ? (
        <div
          className="sw-examlist-grid"
          aria-label="Загрузка экзаменов"
          aria-busy="true"
        >
          {[0, 1, 2].map(index => (
            <Skeleton key={index} variant="rounded" height={275} />
          ))}
        </div>
      ) : visible.length ? (
        <div className="sw-examlist-grid" aria-busy={loading}>
          {visible.map(exam => (
            <UIExamCard
              key={exam.id}
              exam={exam}
              onFeedback={(message, severity) =>
                setFeedback({ message, severity })
              }
            />
          ))}
        </div>
      ) : (
        !error && (
          <div className="sw-examlist-empty">
            <span>
              {isFiltered ? (
                <ManageSearchRoundedIcon />
              ) : (
                <AssignmentOutlinedIcon />
              )}
            </span>
            <h2>
              {isFiltered ? 'Экзамены не найдены' : 'Создайте первый экзамен'}
            </h2>
            <p>
              {isFiltered
                ? 'Измените запрос или сбросьте фильтр доступа.'
                : 'Выберите серию вопросов, а затем настройте время, подсказки и доступ для участников.'}
            </p>
            {isFiltered ? (
              <Button variant="outlined" onClick={reset}>
                Сбросить фильтры
              </Button>
            ) : (
              <UICreateExam />
            )}
          </div>
        )
      )}
      <UICreateExamDialog />
      <Snackbar
        open={!!feedback}
        autoHideDuration={3500}
        onClose={() => setFeedback(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          severity={feedback?.severity || 'success'}
          variant="filled"
          onClose={() => setFeedback(null)}
        >
          {feedback?.message}
        </Alert>
      </Snackbar>
    </Paper>
  );
}
