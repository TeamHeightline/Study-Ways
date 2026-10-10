import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CardMicroViewByData } from '../../Cards/CardMicroView';
import { CardType } from '../../Cards/CardMicroView/store/type';

export function Cards({ cards }: { cards: CardType[] }) {
  const navigate = useNavigate();
  return (
    <div className="sw-author-card-grid">
      {cards.map(card => (
        <CardMicroViewByData
          key={card.id}
          cardID={card.id}
          cardData={card}
          onChange={() => {
            window.scrollTo(0, 0);
            navigate(`/card/${card.id}`);
          }}
        />
      ))}
    </div>
  );
}
