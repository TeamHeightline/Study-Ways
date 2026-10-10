import {
  Alert,
  Button,
  CardActionArea,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  InputAdornment,
  Skeleton,
  TextField,
} from '@mui/material';
import LayersOutlinedIcon from '@mui/icons-material/LayersOutlined';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded';
import { useEffect, useState } from 'react';
import { useQuery } from '@apollo/client';
import { observer } from 'mobx-react';
import {
  RootState,
  useAppDispatch,
  useAppSelector,
} from '../../../../../App/ReduxStore/RootStore';
import { ClientStorage } from '../../../../../Shared/Store/ApolloStorage/ClientStorage';
import { ALL_QUESTION_SEQUENCES } from '../../../../QuestionSequence/Selector/Store/Query';
import { Query } from '../../../../../SchemaTypes';
import { loadQSData } from '../redux-store/async-actions';
import { changeExamQSIDForCreate } from '../redux-store/actions';
import SelectedQSByData from './ui-seleced-qs-by-data';

const UIQuestionSequenceSelector = observer(
  ({ disabled = false }: { disabled?: boolean }) => {
    const selected = useAppSelector(
      (state: RootState) => state.examEditorPageReducer.exam_qs_id_for_create,
    );
    const [open, setOpen] = useState(false);
    const [search, setSearch] = useState('');
    const dispatch = useAppDispatch();
    const { data, loading, error, refetch } = useQuery<Query>(
      ALL_QUESTION_SEQUENCES,
      {
        client: ClientStorage.client,
        skip: !open,
        fetchPolicy: 'cache-and-network',
      },
    );
    useEffect(() => {
      if (selected) dispatch(loadQSData(String(selected)));
    }, [selected, dispatch]);
    const sequences = (data?.questionSequence || []).filter(
      sequence =>
        sequence &&
        `${sequence.name} ${sequence.id}`
          .toLocaleLowerCase('ru')
          .includes(search.trim().toLocaleLowerCase('ru')),
    );
    return (
      <div className="sw-examlist-qs-field">
        <div>
          <span>Серия вопросов</span>
          {selected && (
            <Button disabled={disabled} onClick={() => setOpen(true)}>
              Изменить серию
            </Button>
          )}
        </div>
        {selected ? (
          <SelectedQSByData />
        ) : (
          <button
            type="button"
            className="sw-examlist-choose-qs"
            disabled={disabled}
            onClick={() => setOpen(true)}
          >
            <span>
              <LayersOutlinedIcon />
            </span>
            <div>
              <strong>Выбрать серию вопросов</strong>
              <small>Вопросы этой серии войдут в экзамен</small>
            </div>
            <ArrowForwardRoundedIcon />
          </button>
        )}
        <Dialog
          open={open}
          onClose={() => setOpen(false)}
          fullWidth
          maxWidth="md"
          className="sw-examlist-dialog sw-examlist-qs-dialog"
          aria-labelledby="sw-exam-qs-title"
        >
          <DialogTitle id="sw-exam-qs-title">
            <span>Выберите серию вопросов</span>
            <IconButton
              aria-label="Закрыть выбор серии вопросов"
              onClick={() => setOpen(false)}
            >
              <CloseRoundedIcon />
            </IconButton>
          </DialogTitle>
          <DialogContent>
            <p>Найдите серию по названию или номеру.</p>
            <TextField
              fullWidth
              size="small"
              label="Поиск серии вопросов"
              value={search}
              onChange={event => setSearch(event.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchRoundedIcon />
                  </InputAdornment>
                ),
              }}
            />
            {error && (
              <Alert
                severity="error"
                className="sw-examlist-alert"
                action={
                  <Button
                    color="inherit"
                    onClick={() => refetch().catch(() => {})}
                  >
                    Повторить
                  </Button>
                }
              >
                Не удалось загрузить серии вопросов.
              </Alert>
            )}
            {loading && !data ? (
              <div
                className="sw-examlist-qs-grid"
                aria-label="Загрузка серий вопросов"
              >
                {[0, 1, 2, 3].map(index => (
                  <Skeleton key={index} variant="rounded" height={130} />
                ))}
              </div>
            ) : (
              <div className="sw-examlist-qs-grid">
                {sequences.map(
                  sequence =>
                    sequence && (
                      <CardActionArea
                        key={sequence.id}
                        className={`sw-examlist-qs-option${Number(sequence.id) === selected ? ' is-selected' : ''}`}
                        aria-label={`Выбрать серию «${sequence.name || `№${sequence.id}`}»`}
                        onClick={() => {
                          dispatch(
                            changeExamQSIDForCreate(Number(sequence.id)),
                          );
                          setOpen(false);
                        }}
                      >
                        <span>
                          <LayersOutlinedIcon />
                          Серия №{sequence.id}
                        </span>
                        <strong>{sequence.name || 'Без названия'}</strong>
                        <small>
                          Вопросов:{' '}
                          {sequence.sequenceData?.sequence?.length || 0}
                        </small>
                      </CardActionArea>
                    ),
                )}
              </div>
            )}
            {!loading && !error && !sequences.length && (
              <div className="sw-examlist-qs-empty">
                <LayersOutlinedIcon />
                <strong>
                  {search.trim()
                    ? 'Серии не найдены'
                    : 'Пока нет серий вопросов'}
                </strong>
                <p>
                  {search.trim()
                    ? 'Попробуйте другое название или номер.'
                    : 'Сначала создайте серию в редакторе серий вопросов.'}
                </p>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    );
  },
);
export default UIQuestionSequenceSelector;
