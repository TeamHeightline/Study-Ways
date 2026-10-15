import React from 'react';
import { Typography } from '@mui/material';
import { CardByIDStore } from '../store/CardByIDStore';
import { CardEditLink } from '../../shared/card-edit-link';

const CardTitleWithId = ({ card_store }: { card_store: CardByIDStore }) => {
  const card = card_store.card_data;
  if (!card) return null;
  return (
    <div className="sw-material-title-row">
      <Typography component="h1" variant="h5" className="sw-material-title">
        {card.title}
      </Typography>
      <div className="sw-material-identity">
        <strong
          className="sw-card-number sw-material-number"
          aria-label={`Карточка №${card.id}`}
        >
          №{card.id}
        </strong>
        <CardEditLink id={card.id} ownerId={card.created_by_id} />
      </div>
    </div>
  );
};
export default CardTitleWithId;
