import React from 'react';
import { Link } from 'react-router-dom';
import { Stack } from '@mui/material';
import { useGetCardQuery } from '../api/card-api';
import { ThemeBreadcrumbs } from '../../../../shared/connected-themes/ThemeBreadcrumbs';
import { ConnectedTheme } from '../../../../shared/connected-themes/model';
import { ICardData } from '../types/card-data';

export function selectedCardThemes(card?: ICardData | null): ConnectedTheme[] {
  return (card?.cards_card_connected_theme ?? []).map(
    ({ cards_unstructuredtheme: theme }) => ({
      id: theme.id,
      text: theme.text,
      parentId: theme.parent_id ?? null,
    }),
  );
}

export function CardRouteBreadcrumbs({ id }: { id: number }) {
  const { currentData } = useGetCardQuery(id);
  return (
    <Stack
      direction="row"
      sx={{
        alignItems: 'center',
        gap: 1,
        minWidth: 0,
        overflowX: 'auto',
        py: 1,
      }}
    >
      <Link
        to="/cards"
        style={{
          color: 'inherit',
          textDecoration: 'none',
          whiteSpace: 'nowrap',
          flexShrink: 0,
        }}
      >
        Библиотека знаний
      </Link>
      <span aria-hidden="true">/</span>
      <ThemeBreadcrumbs
        selected={selectedCardThemes(currentData)}
        wrap={false}
      />
    </Stack>
  );
}
