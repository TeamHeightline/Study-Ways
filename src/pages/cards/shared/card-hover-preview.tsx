import React, { useCallback, useEffect, useRef } from 'react';
import { Alert, Button, Skeleton, Tooltip } from '@mui/material';
import { useGetCardQuery } from '../card-by-id/api/card-api';
import { CardEditLink } from './card-edit-link';
import { cardImageUrl } from './card-image-url';
import './card-preview.css';

const levels = [
  'Выпускникам школ',
  'Успешным лицеистам и гимназистам',
  'Рядовым студентам',
  'Будущим специалистам',
  'Специалистам (Real Science)',
];

function plainText(html?: string | null) {
  if (!html) return '';
  const document = new DOMParser().parseFromString(html, 'text/html');
  document.querySelectorAll('script,style').forEach(node => node.remove());
  document.querySelectorAll('br').forEach(node => node.replaceWith('\n'));
  document
    .querySelectorAll('p,div,li,h1,h2,h3,h4,tr')
    .forEach(node => node.append('\n'));
  return document.body.textContent?.trim() || '';
}

function ResourceLink({
  label,
  href,
}: {
  label: string;
  href?: string | null;
}) {
  if (!href || !/^https?:\/\//i.test(href)) return null;
  return (
    <a href={href} target="_blank" rel="noopener noreferrer">
      {label}: {href}
    </a>
  );
}

function CardDetails({ id, onResize }: { id: number; onResize: () => void }) {
  const {
    currentData: card,
    isError,
    refetch,
  } = useGetCardQuery(id, {
    refetchOnFocus: true,
  });
  useEffect(onResize, [card, isError, onResize]);
  if (isError)
    return (
      <Alert
        severity="error"
        action={<Button onClick={() => refetch()}>Повторить</Button>}
      >
        Не удалось загрузить карточку №{id}.
      </Alert>
    );
  if (card === null)
    return <Alert severity="info">Карточка №{id} не найдена.</Alert>;
  if (!card)
    return <Skeleton height={180} aria-label={`Загрузка карточки ${id}`} />;
  const profile = card.users_customuser?.users_userprofile;
  const author =
    [profile?.firstname, profile?.lastname].filter(Boolean).join(' ') ||
    card.users_customuser?.username;
  const themes = card.cards_card_connected_theme
    ?.map(theme => theme.cards_unstructuredtheme?.text)
    .filter(Boolean);
  return (
    <article
      className="sw-card-preview"
      aria-label={`Информация о карточке ${id}`}
    >
      <header>
        <strong className="sw-card-number">№{id}</strong>
        <CardEditLink id={id} ownerId={card.created_by_id} />
      </header>
      <h3>{card.title}</h3>
      <dl>
        <dt>Тип</dt>
        <dd>
          {['Видео', 'Внешний ресурс', 'Изображение'][
            Number(card.card_content_type)
          ] || 'Материал'}
        </dd>
        <dt>Уровень</dt>
        <dd>{levels[Number(card.hard_level)] || 'Не указан'}</dd>
        {author && (
          <>
            <dt>Автор</dt>
            <dd>
              <a
                href={`/author/${card.created_by_id}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                {author}
              </a>
            </dd>
          </>
        )}
        {!!themes?.length && (
          <>
            <dt>Темы</dt>
            <dd>{themes.join(' · ')}</dd>
          </>
        )}
        {card.copyright && (
          <>
            <dt>Правообладатель</dt>
            <dd>{card.copyright}</dd>
          </>
        )}
        {card.tag_field && (
          <>
            <dt>Теги</dt>
            <dd>{card.tag_field}</dd>
          </>
        )}
      </dl>
      {Number(card.card_content_type) !== 0 && (
        <img
          src={cardImageUrl(id, card.cards_cardimage?.image)}
          alt="Изображение карточки"
          onLoad={onResize}
          onError={event => {
            event.currentTarget.hidden = true;
          }}
        />
      )}
      {card.text && (
        <section>
          <h4>Описание</h4>
          <p>{plainText(card.text)}</p>
        </section>
      )}
      {card.additional_text && (
        <section>
          <h4>Дополнительный текст</h4>
          <p>{plainText(card.additional_text)}</p>
        </section>
      )}
      <div className="sw-card-preview-links">
        <ResourceLink label="Видео" href={card.video_url} />
        <ResourceLink label="VK Видео" href={card.vk_video_url} />
        <ResourceLink label="Ресурс" href={card.site_url} />
        {!!card.test_before_card_id && (
          <a
            href={`/question/${card.test_before_card_id}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            Вопрос перед ресурсом: №{card.test_before_card_id}
            {!card.is_card_use_test_before_card && ' (выключен)'}
          </a>
        )}
        {!!card.test_in_card_id && (
          <a
            href={`/question/${card.test_in_card_id}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            Вопрос после ресурса: №{card.test_in_card_id}
            {!card.is_card_use_test_in_card && ' (выключен)'}
          </a>
        )}
        <a href={`/card/${id}`} target="_blank" rel="noopener noreferrer">
          Открыть карточку ↗
        </a>
      </div>
    </article>
  );
}

// Details mount only when the tooltip opens; hovering reuses the full-card RTK cache.
export function CardHoverPreview({
  ids,
  children,
}: {
  ids: Array<string | number>;
  children: React.ReactElement;
}) {
  const popper = useRef<{ update: () => unknown } | null>(null);
  const updatePosition = useCallback(() => {
    void popper.current?.update();
  }, []);
  const validIds = [...new Set(ids.map(Number))].filter(
    id => Number.isInteger(id) && id > 0,
  );
  if (!validIds.length) return children;
  return (
    <Tooltip
      title={
        <div className="sw-card-preview-list">
          {validIds.map(id => (
            <CardDetails key={id} id={id} onResize={updatePosition} />
          ))}
        </div>
      }
      enterDelay={350}
      enterNextDelay={350}
      leaveDelay={150}
      placement="right-start"
      arrow
      describeChild
      slotProps={{
        tooltip: { className: 'sw-card-preview-tooltip' },
        popper: {
          sx: { zIndex: 1501 },
          popperRef: instance => {
            popper.current = instance;
          },
        },
      }}
    >
      {children}
    </Tooltip>
  );
}
