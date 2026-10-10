import React from 'react';
import { Alert, Button, ButtonBase, Skeleton, Typography } from '@mui/material';
import HistoryRoundedIcon from '@mui/icons-material/HistoryRounded';
import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded';
import PlayCircleOutlineRoundedIcon from '@mui/icons-material/PlayCircleOutlineRounded';
import ImageOutlinedIcon from '@mui/icons-material/ImageOutlined';
import LinkRoundedIcon from '@mui/icons-material/LinkRounded';
import ArticleOutlinedIcon from '@mui/icons-material/ArticleOutlined';
import { Link } from 'react-router-dom';
import { useAppSelector } from '../../../App/ReduxStore/RootStore';
import '../card-history.css';

interface CardHistoryTimelineProps {
  cardIDs: number[];
  isLoading: boolean;
  hasError: boolean;
  onRetry: () => void;
  onOpenCard?: () => void;
}

const contentTypes = [
  { label: 'Видео', Icon: PlayCircleOutlineRoundedIcon },
  { label: 'Ресурс', Icon: LinkRoundedIcon },
  { label: 'Изображение', Icon: ImageOutlinedIcon },
];

export default function CardHistoryTimeline({
  cardIDs,
  isLoading,
  hasError,
  onRetry,
  onOpenCard,
}: CardHistoryTimelineProps) {
  const cards = useAppSelector(state => state.cardMicroView.card_hash_map);

  if (isLoading) {
    return (
      <div
        className="sw-history-loading"
        aria-busy="true"
        aria-label="Загрузка истории просмотров"
      >
        {[0, 1, 2, 3].map(index => (
          <Skeleton key={index} variant="rounded" height={108} />
        ))}
      </div>
    );
  }

  if (hasError) {
    return (
      <Alert
        severity="error"
        className="sw-history-error"
        action={
          <Button color="inherit" onClick={onRetry}>
            Повторить
          </Button>
        }
      >
        Не удалось загрузить историю просмотров.
      </Alert>
    );
  }

  if (cardIDs.length === 0) {
    return (
      <div className="sw-history-empty" role="status">
        <span>
          <HistoryRoundedIcon />
        </span>
        <Typography component="h3">История пока пуста</Typography>
        <Typography component="p">
          Открывайте учебные карточки — здесь появятся ваши просмотры.
        </Typography>
      </div>
    );
  }

  return (
    <ol
      className="sw-history-timeline"
      aria-label="История просмотров карточек"
    >
      {cardIDs.map((id, index) => {
        const card = cards[String(id)];
        const profile = card?.users_customuser?.users_userprofile;
        const author = [profile?.firstname, profile?.lastname]
          .filter(Boolean)
          .join(' ');
        const theme =
          card?.cards_card_connected_theme?.[0]?.cards_unstructuredtheme?.text;
        const { label, Icon } = contentTypes[
          Number(card?.card_content_type)
        ] || { label: 'Карточка', Icon: ArticleOutlinedIcon };

        return (
          <li
            key={`${id}-${index}`}
            className={`sw-history-event${index === 0 ? ' is-latest' : ''}`}
          >
            <span className="sw-history-marker" aria-hidden="true" />
            {index < 2 && (
              <span className="sw-history-event-label">
                {index === 0 ? 'Последний просмотр' : 'Ранее'}
              </span>
            )}
            <ButtonBase
              component={Link}
              to={`/card/${id}`}
              onClick={onOpenCard}
              className="sw-history-entry"
            >
              <span
                className={`sw-history-type-icon type-${card?.card_content_type ?? 'unknown'}`}
                aria-hidden="true"
              >
                <Icon />
              </span>
              <span className="sw-history-entry-copy">
                <span className="sw-history-entry-meta">
                  <span>{label}</span>
                  <span>№{id}</span>
                </span>
                <Typography component="span" className="sw-history-entry-title">
                  {card?.title?.trim() || `Карточка №${id}`}
                </Typography>
                {(theme || author) && (
                  <span className="sw-history-entry-description">
                    {[theme, author].filter(Boolean).join(' · ')}
                  </span>
                )}
              </span>
              <ArrowForwardRoundedIcon className="sw-history-entry-arrow" />
            </ButtonBase>
          </li>
        );
      })}
    </ol>
  );
}
