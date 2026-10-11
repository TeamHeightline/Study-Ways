import React from 'react';
import { PaperProps } from '@mui/material/Paper';
import { Paper } from '@mui/material';
import { CardByIDStore } from '../store/CardByIDStore';
import { ThemeBreadcrumbs } from '../../../../shared/connected-themes/ThemeBreadcrumbs';
import { selectedCardThemes } from './card-route-breadcrumbs';
const CardTheme = ({
  card_store,
  ...props
}: PaperProps & {
  card_store: CardByIDStore;
}) => (
  <Paper elevation={0} {...props}>
    <ThemeBreadcrumbs selected={selectedCardThemes(card_store.card_data)} />
  </Paper>
);
export default CardTheme;
