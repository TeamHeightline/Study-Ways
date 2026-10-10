import React, { useRef, useState } from 'react';
import { useMutation, useQuery } from '@apollo/client';
import {
  Alert,
  Button,
  Card,
  CardActionArea,
  CircularProgress,
  IconButton,
  InputAdornment,
  Paper,
  Skeleton,
  TextField,
  Tooltip,
} from '@mui/material';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import RefreshRoundedIcon from '@mui/icons-material/RefreshRounded';
import LayersOutlinedIcon from '@mui/icons-material/LayersOutlined';
import QuizOutlinedIcon from '@mui/icons-material/QuizOutlined';
import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded';
import ManageSearchRoundedIcon from '@mui/icons-material/ManageSearchRounded';
import { Mutation } from '../../../../SchemaTypes';
import {
  CREATE_QUESTION_SEQUENCE,
  GET_MY_QUESTION_SEQUENCE,
  question_sequence_struct,
} from '../Struct';
import { compareByIdDescending } from '../../../../Shared/Utils/array';
import EditQuestionSequenceUI from '../EditByID/UI/edit-question-sequence-ui';
import './question-sequence-list.css';

interface OwnSequence {
  id: string;
  name?: string | null;
  description?: string | null;
  sequenceData?: unknown;
}
interface OwnSequencesData {
  me?: { questionsequenceSet?: OwnSequence[] } | null;
}
function questionsIn(sequence: OwnSequence): Array<string | number> {
  const data = sequence.sequenceData as { sequence?: unknown } | null;
  const questions = data?.sequence;
  return Array.isArray(questions)
    ? questions.filter(
        (id): id is string | number =>
          typeof id === 'string' || typeof id === 'number',
      )
    : [];
}
const normalize = (text: string) =>
  text.toLocaleLowerCase('ru').replace(/ё/g, 'е').trim();
const sequenceTitle = (sequence: OwnSequence) =>
  sequence.name?.trim() || 'Без названия';

export default function QuestionSequenceMainEditor() {
  const [selectedID, setSelectedID] = useState<string>();
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [createError, setCreateError] = useState(false);
  const createLock = useRef(false);
  const { data, loading, error, refetch } = useQuery<OwnSequencesData>(
    GET_MY_QUESTION_SEQUENCE,
    {
      fetchPolicy: 'cache-and-network',
    },
  );
  const [createSequence, { loading: creating }] = useMutation<
    Mutation,
    { sequenceData: typeof question_sequence_struct }
  >(CREATE_QUESTION_SEQUENCE, {
    update(cache, result) {
      const sequence = result.data?.createQuestionSequence?.sequence;
      const existing = cache.readQuery<OwnSequencesData>({
        query: GET_MY_QUESTION_SEQUENCE,
      });
      if (!sequence?.id || !existing?.me) return;
      const sequences = existing.me.questionsequenceSet || [];
      cache.writeQuery({
        query: GET_MY_QUESTION_SEQUENCE,
        data: {
          ...existing,
          me: {
            ...existing.me,
            questionsequenceSet: sequences.some(
              item => String(item.id) === String(sequence.id),
            )
              ? sequences
              : [...sequences, sequence],
          },
        },
      });
    },
  });
  const refresh = () => {
    void refetch().catch(() => {});
  };
  const create = async () => {
    if (createLock.current) return;
    createLock.current = true;
    setCreateError(false);
    try {
      const result = await createSequence({
        variables: { sequenceData: question_sequence_struct },
      });
      const id = result.data?.createQuestionSequence?.sequence?.id;
      if (!id) throw new Error('No created sequence returned');
      setSearch('');
      setFilter('all');
      setSelectedID(String(id));
    } catch {
      setCreateError(true);
    } finally {
      createLock.current = false;
    }
  };
  if (selectedID) {
    return (
      <EditQuestionSequenceUI
        qsID={selectedID}
        onChange={action => {
          if (action === 'goBack') {
            setSelectedID(undefined);
            refresh();
          }
        }}
      />
    );
  }
  const sequences = [...(data?.me?.questionsequenceSet || [])].sort(
    compareByIdDescending,
  );
  const filled = sequences.filter(
    sequence => questionsIn(sequence).length > 0,
  ).length;
  const query = normalize(search);
  const isFiltered = !!query || filter !== 'all';
  const visible = sequences.filter(sequence => {
    const count = questionsIn(sequence).length;
    return (
      (filter === 'all' || (filter === 'filled' ? count > 0 : count === 0)) &&
      normalize(
        `${sequenceTitle(sequence)} ${sequence.description || ''} ${sequence.id}`,
      ).includes(query)
    );
  });
  const initialLoading = loading && !data;
  const reset = () => {
    setSearch('');
    setFilter('all');
  };
  const createButton = (label = 'Создать серию') => (
    <Button
      variant="contained"
      disableElevation
      disabled={creating || initialLoading}
      startIcon={
        creating ? (
          <CircularProgress size={16} color="inherit" />
        ) : (
          <AddRoundedIcon />
        )
      }
      onClick={create}
    >
      {creating ? 'Создаём серию…' : label}
    </Button>
  );
  return (
    <Paper elevation={0} className="sw-qslist">
      <header className="sw-qslist-heading">
        <div className="sw-card-library-heading">
          <h1 className="sw-card-library-title">Мои серии вопросов</h1>
          <p>
            Собирайте вопросы в серии для обучения, проверки знаний и экзаменов.
          </p>
        </div>
        {createButton()}
      </header>
      {createError && (
        <Alert
          severity="error"
          className="sw-qslist-alert"
          onClose={() => setCreateError(false)}
        >
          Не удалось создать серию вопросов. Попробуйте ещё раз.
        </Alert>
      )}
      <div
        className="sw-qslist-summary"
        role="group"
        aria-label="Фильтр серий вопросов"
      >
        {[
          { value: 'all', label: 'Всего серий', count: sequences.length },
          { value: 'filled', label: 'С вопросами', count: filled },
          {
            value: 'empty',
            label: 'Пока пустых',
            count: sequences.length - filled,
          },
        ].map(item => (
          <button
            type="button"
            key={item.value}
            aria-pressed={filter === item.value}
            disabled={initialLoading}
            className={filter === item.value ? 'is-selected' : ''}
            onClick={() => setFilter(item.value)}
          >
            <strong>
              {initialLoading ? <Skeleton width={25} /> : item.count}
            </strong>
            <span>{item.label}</span>
          </button>
        ))}
      </div>
      <div className="sw-qslist-toolbar">
        <TextField
          fullWidth
          size="small"
          label="Поиск серии вопросов"
          placeholder="Название, описание или номер"
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
                  aria-label="Очистить поиск серий"
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
              : 'Выберите серию для редактирования'}
          </span>
          <Tooltip title="Обновить список">
            <span>
              <IconButton
                aria-label="Обновить список серий"
                disabled={loading}
                onClick={refresh}
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
          className="sw-qslist-alert"
          action={
            <Button color="inherit" onClick={refresh}>
              Повторить
            </Button>
          }
        >
          Не удалось{' '}
          {data ? 'обновить список серий' : 'загрузить серии вопросов'}.
          Попробуйте ещё раз.
        </Alert>
      )}
      {initialLoading ? (
        <div
          className="sw-qslist-grid"
          aria-label="Загрузка серий вопросов"
          aria-busy="true"
        >
          {[0, 1, 2].map(index => (
            <Skeleton key={index} variant="rounded" height={325} />
          ))}
        </div>
      ) : visible.length ? (
        <div className="sw-qslist-grid" aria-busy={loading}>
          {visible.map(sequence => {
            const questions = questionsIn(sequence);
            const title = sequenceTitle(sequence);
            return (
              <Card
                key={sequence.id}
                variant="outlined"
                className="sw-qslist-card"
              >
                <CardActionArea
                  aria-label={`Редактировать серию «${title}»`}
                  onClick={() => setSelectedID(String(sequence.id))}
                >
                  <div className="sw-qslist-card-top">
                    <span className="sw-qslist-icon">
                      <LayersOutlinedIcon />
                    </span>
                    <span
                      className={`sw-qslist-badge${questions.length ? '' : ' is-empty'}`}
                    >
                      <QuizOutlinedIcon />
                      {questions.length
                        ? `Вопросов: ${questions.length}`
                        : 'Пустая серия'}
                    </span>
                  </div>
                  <small className="sw-qslist-number">
                    Серия №{sequence.id}
                  </small>
                  <h2>{title}</h2>
                  <p
                    className={`sw-qslist-description${sequence.description?.trim() ? '' : ' is-empty'}`}
                  >
                    {sequence.description?.trim() ||
                      'Добавьте описание, чтобы было проще найти серию.'}
                  </p>
                  <div className="sw-qslist-questions">
                    <span>
                      {questions.length
                        ? 'Вопросы в серии'
                        : 'Начните с первого вопроса'}
                    </span>
                    <div>
                      {questions.length ? (
                        <>
                          {questions.slice(0, 4).map((id, index) => (
                            <span key={`${id}-${index}`}>№{id}</span>
                          ))}
                          {questions.length > 4 && (
                            <span className="sw-qslist-more">
                              ещё {questions.length - 4}
                            </span>
                          )}
                        </>
                      ) : (
                        <small>Добавьте вопросы в редакторе</small>
                      )}
                    </div>
                  </div>
                  <footer>
                    <span>
                      {questions.length
                        ? 'Продолжить работу'
                        : 'Наполнить серию'}
                    </span>
                    <strong>
                      Редактировать
                      <ArrowForwardRoundedIcon />
                    </strong>
                  </footer>
                </CardActionArea>
              </Card>
            );
          })}
        </div>
      ) : (
        !error && (
          <div className="sw-qslist-empty">
            <span>
              {isFiltered ? (
                <ManageSearchRoundedIcon />
              ) : (
                <LayersOutlinedIcon />
              )}
            </span>
            <h2>
              {isFiltered
                ? 'Серии не найдены'
                : 'Создайте первую серию вопросов'}
            </h2>
            <p>
              {isFiltered
                ? 'Измените поисковый запрос или сбросьте фильтры.'
                : 'Объедините вопросы по теме и используйте серию для обучения или экзамена.'}
            </p>
            {isFiltered ? (
              <Button variant="outlined" onClick={reset}>
                Сбросить фильтры
              </Button>
            ) : (
              createButton('Создать первую серию')
            )}
          </div>
        )
      )}
    </Paper>
  );
}
