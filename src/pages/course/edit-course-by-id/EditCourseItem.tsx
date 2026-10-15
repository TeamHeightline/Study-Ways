import React, { useEffect, useId, useRef, useState } from 'react';
import {
  Alert,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  TextField,
} from '@mui/material';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import CollectionsBookmarkOutlinedIcon from '@mui/icons-material/CollectionsBookmarkOutlined';
import PlayCircleOutlineRoundedIcon from '@mui/icons-material/PlayCircleOutlineRounded';
import ImageOutlinedIcon from '@mui/icons-material/ImageOutlined';
import LibraryBooksOutlinedIcon from '@mui/icons-material/LibraryBooksOutlined';
import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded';
import { skipToken } from '@reduxjs/toolkit/query';
import { cardImageUrl } from '../../cards/shared/card-image-url';
import { CardEditLink } from '../../cards/shared/card-edit-link';
import { CardHoverPreview } from '../../cards/shared/card-hover-preview';
import { useGetCourseCardPreviewQuery } from '../course-api';
import { CardSelector } from '../../cards/selector/ui/CardSelector';
import { CourseElementData, cardIDs } from './course-data';

interface Props {
  item_data: CourseElementData;
  item_position: number;
  level: number;
  updateItem: (item: CourseElementData) => void;
}

const isCardID = (value: string) => /^[1-9]\d*$/.test(value);
type CellDialog = 'group' | 'search' | 'group-search';

export default function EditCourseItem({
  item_data: item,
  item_position,
  level,
  updateItem,
}: Props) {
  const [image, setImage] = useState('');
  const [dialog, setDialog] = useState<CellDialog>('group');
  const [open, setOpen] = useState(false);
  const [draftIDs, setDraftIDs] = useState('');
  // Legacy course links stay untouched until this position is explicitly changed.
  const ids = item.type === 'course-link' ? [] : cardIDs(item.id);
  const group = ids.length > 1;
  const filled = ids.length > 0;
  const committedValue = ids.join(',');
  const [inputValue, setInputValue] = useState(committedValue);
  const committedRef = useRef(committedValue);
  const inputRef = useRef<HTMLInputElement>(null);
  const errorID = useId();
  const position = `уровень ${level}, позиция ${item_position + 1}`;
  const inputError = !!inputValue.trim() && !isCardID(inputValue.trim());
  const searching = dialog === 'search' || dialog === 'group-search';
  const {
    currentData: card,
    isFetching: loading,
    error,
  } = useGetCourseCardPreviewQuery(!ids.length ? skipToken : Number(ids[0]), {
    refetchOnFocus: true,
  });
  useEffect(() => {
    setInputValue(committedValue);
    committedRef.current = committedValue;
  }, [committedValue, item.type]);
  useEffect(() => {
    setImage(
      card && Number(card.card_content_type) !== 0
        ? cardImageUrl(card.id, card.cards_cardimage?.image)
        : '',
    );
  }, [card?.id, card?.card_content_type, card?.cards_cardimage?.image]);

  const configureGroup = (value = committedRef.current) => {
    setDraftIDs(value);
    setDialog('group');
    setOpen(true);
  };
  const closeDialog = () => {
    setOpen(false);
    setInputValue(committedRef.current);
  };
  const writeCard = (value: string) => {
    setInputValue(value);
    committedRef.current = value;
    const next = { ...item, id: value || null, type: 'card' };
    delete next.course_link;
    updateItem(next);
  };
  const commitInput = () => {
    const value = inputValue.trim();
    if (value && !isCardID(value)) return;
    setInputValue(value);
    if (value === committedRef.current) return;
    writeCard(value);
  };
  const focusInput = () => {
    inputRef.current?.focus();
    inputRef.current?.select();
  };
  const clear = () => {
    writeCard('');
    setOpen(false);
  };
  const openSearch = () => {
    setOpen(true);
    if (group) {
      setDraftIDs(committedRef.current);
      setDialog('group-search');
    } else {
      setDialog('search');
    }
  };
  const draft = cardIDs(draftIDs);
  const validGroup = draft.length > 0 && draft.every(isCardID);
  const contentType = Number(
    String(card?.card_content_type ?? '').replace(/\D/g, ''),
  );
  const title = group
    ? `${ids.length} карточки в одной позиции`
    : card?.title || (loading ? 'Загрузка материала…' : `Карточка №${ids[0]}`);

  return (
    <div className={`sw-coedit-cell ${filled ? 'is-filled' : 'is-empty'}`}>
      <header className="sw-coedit-cell-heading">
        <span className="sw-coedit-position">
          {String(item_position + 1).padStart(2, '0')}
        </span>
        <div className="sw-coedit-cell-actions">
          <IconButton
            className="sw-coedit-group-button"
            aria-label={`Несколько карточек, ${position}`}
            title="Несколько карточек через запятую"
            onClick={() => configureGroup()}
          >
            <CollectionsBookmarkOutlinedIcon />
          </IconButton>
          {filled && (
            <div className="sw-coedit-card-links">
              {ids.map(id => (
                <CardEditLink
                  key={id}
                  id={Number(id)}
                  ownerId={id === ids[0] ? card?.created_by_id : undefined}
                />
              ))}
            </div>
          )}
        </div>
      </header>
      <CardHoverPreview ids={ids}>
        <button
          type="button"
          className="sw-coedit-cell-open"
          onClick={() => (group ? configureGroup() : focusInput())}
          aria-label={`${group ? 'Изменить группу карточек' : 'Ввести номер карточки'}, ${position}`}
        >
          {filled ? (
            <>
              <div className="sw-coedit-cell-cover">
                {image && !group ? (
                  <img src={image} alt="" onError={() => setImage('')} />
                ) : group ? (
                  <CollectionsBookmarkOutlinedIcon />
                ) : contentType === 0 ? (
                  <PlayCircleOutlineRoundedIcon />
                ) : (
                  <ImageOutlinedIcon />
                )}
              </div>
              <span className="sw-coedit-cell-title">{title}</span>
              {(error || (!loading && !card)) && (
                <span className="sw-coedit-cell-error">
                  Не удалось загрузить карточку
                </span>
              )}
            </>
          ) : (
            <span className="sw-coedit-add-content">
              <AddRoundedIcon />
              <strong>Номер карточки</strong>
            </span>
          )}
        </button>
      </CardHoverPreview>
      <footer className="sw-coedit-cell-footer">
        {group ? (
          <button
            type="button"
            className="sw-coedit-group-ids"
            title={ids.join(', ')}
            aria-label={`Изменить номера карточек, ${position}`}
            onClick={() => configureGroup()}
          >
            № {ids.join(', ')}
          </button>
        ) : (
          <label className="sw-coedit-inline-field">
            <span>№</span>
            <input
              ref={inputRef}
              type="text"
              inputMode="numeric"
              aria-label={`Номер карточки, ${position}`}
              aria-invalid={inputError}
              aria-describedby={inputError ? errorID : undefined}
              placeholder="Номер"
              value={inputValue}
              onChange={event => {
                const value = event.target.value;
                setInputValue(value);
                if (value.includes(',')) configureGroup(value);
              }}
              onBlur={commitInput}
              onKeyDown={event => {
                if (event.key === 'Enter') {
                  event.preventDefault();
                  commitInput();
                }
                if (event.key === 'Escape') {
                  event.preventDefault();
                  setInputValue(committedRef.current);
                }
              }}
            />
          </label>
        )}
        <IconButton
          className="sw-coedit-clear-button"
          aria-label={`Очистить позицию ${item_position + 1}, уровень ${level}`}
          title="Очистить позицию"
          disabled={!inputValue && !item.course_link}
          onMouseDown={event => event.preventDefault()}
          onClick={clear}
        >
          <CloseRoundedIcon />
        </IconButton>
        <IconButton
          aria-label={`Найти карточку, ${position}`}
          title="Выбрать карточку через поиск"
          onClick={openSearch}
        >
          <SearchRoundedIcon />
        </IconButton>
      </footer>
      {!group && !open && inputError && (
        <span id={errorID} role="alert" className="sw-coedit-input-error">
          Введите целый номер больше нуля.
        </span>
      )}
      <Dialog
        open={open}
        onClose={closeDialog}
        fullWidth
        maxWidth={searching ? 'lg' : 'sm'}
        slotProps={{ paper: { className: 'sw-coedit-dialog' } }}
      >
        <DialogTitle>
          <div>
            {searching ? 'Выбор карточки' : 'Несколько карточек'}
            <small>
              Уровень {level} · позиция {item_position + 1}
            </small>
          </div>
          <IconButton
            aria-label="Закрыть выбор материала"
            onClick={closeDialog}
          >
            <CloseRoundedIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          {searching ? (
            <>
              {dialog === 'group-search' && (
                <Button
                  startIcon={<ArrowBackRoundedIcon />}
                  onClick={() => setDialog('group')}
                >
                  К номерам карточек
                </Button>
              )}
              <CardSelector
                mode="standard"
                onCardSelect={id => {
                  if (dialog === 'group-search') {
                    setDraftIDs(current =>
                      [...new Set([...cardIDs(current), String(id)])].join(','),
                    );
                    setDialog('group');
                  } else {
                    writeCard(String(id));
                    setOpen(false);
                  }
                }}
              />
            </>
          ) : (
            <div className="sw-coedit-cell-form">
              <TextField
                autoFocus
                fullWidth
                label="Номера карточек"
                value={draftIDs}
                onChange={event => setDraftIDs(event.target.value)}
                error={!!draftIDs && !validGroup}
                helperText="Через запятую, например: 123, 46, 67."
              />
              <Button
                variant="outlined"
                startIcon={<LibraryBooksOutlinedIcon />}
                onClick={() => setDialog('group-search')}
              >
                Выбрать через поиск
              </Button>
              {draft.length > 1 && (
                <Alert severity="info">
                  Карточки будут показаны вместе в одной позиции курса.
                </Alert>
              )}
            </div>
          )}
        </DialogContent>
        {!searching && (
          <DialogActions>
            <Button onClick={closeDialog}>Отмена</Button>
            <Button
              variant="contained"
              disableElevation
              disabled={!validGroup}
              onClick={() => {
                writeCard(draft.join(','));
                setOpen(false);
              }}
            >
              Применить
            </Button>
          </DialogActions>
        )}
      </Dialog>
    </div>
  );
}
