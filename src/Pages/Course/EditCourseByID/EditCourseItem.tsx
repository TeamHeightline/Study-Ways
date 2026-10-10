import React, { useEffect, useState } from 'react';
import { gql, useQuery } from '@apollo/client';
import {
  Alert,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Tooltip,
} from '@mui/material';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import LinkRoundedIcon from '@mui/icons-material/LinkRounded';
import CollectionsBookmarkOutlinedIcon from '@mui/icons-material/CollectionsBookmarkOutlined';
import PlayCircleOutlineRoundedIcon from '@mui/icons-material/PlayCircleOutlineRounded';
import ImageOutlinedIcon from '@mui/icons-material/ImageOutlined';
import LibraryBooksOutlinedIcon from '@mui/icons-material/LibraryBooksOutlined';
import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded';
import { SERVER_BASE_URL } from '../../../settings';
import { CardSelector } from '../../Cards/Selector/UI/CardSelector';
import { CourseElementData, cardIDs, hasMaterial } from './course-data';

export const GET_EDITOR_CARD = gql`
  query GET_COURSE_EDITOR_CARD($id: ID!) {
    cardById(id: $id) {
      id
      title
      cardContentType
    }
  }
`;

interface Props {
  item_data: CourseElementData;
  item_position: number;
  level: number;
  updateItem: (item: CourseElementData) => void;
  editCard: (id: string) => void;
}
export default function EditCourseItem({
  item_data: item,
  item_position,
  level,
  updateItem,
  editCard,
}: Props) {
  const [image, setImage] = useState('');
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState(item);
  const [choosing, setChoosing] = useState(false);
  const ids = cardIDs(item.id);
  const link = item.type === 'course-link';
  const filled = hasMaterial(item);
  const { data, loading, error } = useQuery(GET_EDITOR_CARD, {
    variables: { id: ids[0] },
    skip: link || !ids.length,
  });
  const card = data?.cardById;
  useEffect(() => {
    setImage('');
    if (link || !ids[0]) return;
    const controller = new AbortController();
    fetch(`${SERVER_BASE_URL}/cardfiles/card?id=${ids[0]}`, {
      signal: controller.signal,
    })
      .then(response => response.json())
      .then(result => setImage(result?.[0]?.image || ''))
      .catch(() => void 0);
    return () => controller.abort();
  }, [item.id, link]);
  const configure = () => {
    setDraft({ ...item });
    setChoosing(false);
    setOpen(true);
  };
  const draftIsLink = draft.type === 'course-link';
  const draftIDs = cardIDs(draft.id);
  const validIDs =
    draftIDs.length > 0 && draftIDs.every(id => /^[1-9]\d*$/.test(id));
  const validLink = (() => {
    try {
      const url = new URL(draft.course_link || '', window.location.origin);
      return (
        ['http:', 'https:'].includes(url.protocol) &&
        url.pathname === '/course' &&
        !!url.searchParams.get('id')
      );
    } catch {
      return false;
    }
  })();
  const valid = draftIsLink ? validLink : validIDs;
  const apply = () => {
    updateItem({ ...draft, id: draftIsLink ? draft.id : draftIDs.join(',') });
    setOpen(false);
  };
  const clear = () => {
    updateItem({ ...item, id: null, type: 'card', course_link: '' });
    setOpen(false);
  };
  const contentType = Number(
    String(card?.cardContentType ?? '').replace(/\D/g, ''),
  );
  const title = link
    ? 'Переход на курс'
    : ids.length > 1
      ? `${ids.length} карточки в одной позиции`
      : card?.title ||
        (loading ? 'Загрузка материала…' : `Карточка №${ids[0]}`);
  return (
    <div
      className={`sw-coedit-cell ${filled ? 'is-filled' : 'is-empty'} ${link ? 'is-link' : ''}`}
    >
      <button
        type="button"
        className="sw-coedit-cell-open"
        onClick={configure}
        aria-label={`Настроить позицию ${item_position + 1}, уровень ${level}`}
      >
        <span className="sw-coedit-position">
          {String(item_position + 1).padStart(2, '0')}
        </span>
        {filled ? (
          <>
            <div className="sw-coedit-cell-cover">
              {image && !link && ids.length === 1 ? (
                <img src={image} alt="" onError={() => setImage('')} />
              ) : link ? (
                <LinkRoundedIcon />
              ) : ids.length > 1 ? (
                <CollectionsBookmarkOutlinedIcon />
              ) : contentType === 0 ? (
                <PlayCircleOutlineRoundedIcon />
              ) : (
                <ImageOutlinedIcon />
              )}
              <span className="sw-coedit-cell-edit">
                <EditOutlinedIcon />
              </span>
            </div>
            <span className="sw-coedit-cell-title">{title}</span>
            {(error || (!loading && !link && !card)) && (
              <span className="sw-coedit-cell-error">
                Не удалось загрузить карточку
              </span>
            )}
          </>
        ) : (
          <span className="sw-coedit-add-content">
            <AddRoundedIcon />
            <strong>Добавить материал</strong>
            <small>Карточка или переход</small>
          </span>
        )}
      </button>
      {filled && (
        <footer className="sw-coedit-cell-footer">
          <span title={link ? item.course_link : ids.join(', ')}>
            {link ? 'Связь с курсом' : `№ ${ids.join(', ')}`}
          </span>
          {!link && ids.length === 1 && (
            <Tooltip title="Редактировать карточку">
              <IconButton
                size="small"
                aria-label={`Редактировать карточку ${ids[0]}`}
                onClick={() => editCard(ids[0])}
              >
                <EditOutlinedIcon />
              </IconButton>
            </Tooltip>
          )}
        </footer>
      )}
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        fullWidth
        maxWidth={choosing ? 'lg' : 'sm'}
        PaperProps={{ className: 'sw-coedit-dialog' }}
      >
        <DialogTitle>
          <div>
            {choosing ? 'Выбор карточки' : 'Материал курса'}
            <small>
              Уровень {level} · позиция {item_position + 1}
            </small>
          </div>
          <IconButton
            aria-label="Закрыть выбор материала"
            onClick={() => setOpen(false)}
          >
            <CloseRoundedIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          {choosing ? (
            <>
              <Button
                startIcon={<ArrowBackRoundedIcon />}
                onClick={() => setChoosing(false)}
              >
                К настройке позиции
              </Button>
              <CardSelector
                mode="standard"
                onCardSelect={id => {
                  setDraft(current => ({
                    ...current,
                    id: [...cardIDs(current.id), String(id)]
                      .filter(
                        (value, index, array) => array.indexOf(value) === index,
                      )
                      .join(','),
                  }));
                  setChoosing(false);
                }}
              />
            </>
          ) : (
            <div className="sw-coedit-cell-form">
              <ToggleButtonGroup
                exclusive
                value={draftIsLink ? 'course-link' : 'card'}
                aria-label="Тип позиции"
                onChange={(_, type) => {
                  if (type) setDraft(current => ({ ...current, type }));
                }}
              >
                <ToggleButton value="card">
                  <LibraryBooksOutlinedIcon />
                  Карточки
                </ToggleButton>
                <ToggleButton value="course-link">
                  <LinkRoundedIcon />
                  Переход на курс
                </ToggleButton>
              </ToggleButtonGroup>
              {draftIsLink ? (
                <TextField
                  autoFocus
                  fullWidth
                  label="Ссылка на курс"
                  value={draft.course_link || ''}
                  onChange={event =>
                    setDraft(current => ({
                      ...current,
                      course_link: event.target.value,
                    }))
                  }
                  error={!!draft.course_link && !validLink}
                  helperText="Откройте нужный материал курса и скопируйте ссылку из адресной строки."
                />
              ) : (
                <>
                  <TextField
                    autoFocus
                    fullWidth
                    label="ID карточек"
                    value={draft.id ?? ''}
                    onChange={event => {
                      const id = event.target.value;
                      setDraft(current => ({ ...current, id }));
                    }}
                    error={!!draft.id && !validIDs}
                    helperText="Один номер или несколько через запятую, например: 123, 46, 67."
                  />
                  <Button
                    variant="outlined"
                    startIcon={<LibraryBooksOutlinedIcon />}
                    onClick={() => setChoosing(true)}
                  >
                    Выбрать из библиотеки
                  </Button>
                  {draftIDs.length > 1 && (
                    <Alert severity="info">
                      Карточки будут показаны вместе в одной позиции курса.
                    </Alert>
                  )}
                </>
              )}
            </div>
          )}
        </DialogContent>
        {!choosing && (
          <DialogActions>
            {filled && (
              <Button color="error" onClick={clear}>
                Очистить позицию
              </Button>
            )}
            <span className="sw-coedit-action-spacer" />
            <Button onClick={() => setOpen(false)}>Отмена</Button>
            <Button
              variant="contained"
              disableElevation
              disabled={!valid}
              onClick={apply}
            >
              Применить
            </Button>
          </DialogActions>
        )}
      </Dialog>
    </div>
  );
}
