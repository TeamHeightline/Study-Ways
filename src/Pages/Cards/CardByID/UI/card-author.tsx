import React from 'react';
import { observer } from 'mobx-react';
import { Link } from 'react-router-dom';
import { Typography } from '@mui/material';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import { CardByIDStore } from '../Store/CardByIDStore';

export const CardAuthor = observer(
  ({ card_store }: { card_store: CardByIDStore }) => {
    const author = card_store.card_data?.users_customuser;
    if (!author) return null;
    const profile = author.users_userprofile;
    const name =
      [profile?.firstname, profile?.lastname].filter(Boolean).join(' ') ||
      author.username ||
      `Автор №${author.id}`;
    return (
      <Typography
        component={Link}
        to={`/author/${author.id}`}
        sx={{
          display: 'flex',
          alignItems: 'center',
          color: 'inherit',
          textDecoration: 'none',
        }}
      >
        <OpenInNewIcon fontSize="small" sx={{ mr: 1 }} />
        {name}
      </Typography>
    );
  },
);
