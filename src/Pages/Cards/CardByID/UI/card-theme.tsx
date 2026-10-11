import { observer } from 'mobx-react';
import React from 'react';
import { PaperProps } from '@mui/material/Paper/Paper';
import { Paper } from '@mui/material';
import { CardByIDStore } from '../Store/CardByIDStore';
import { ThemeBreadcrumbs } from '../../../../Shared/ConnectedThemes/ThemeBreadcrumbs';
import { selectedCardThemes } from './card-route-breadcrumbs';

const CardTheme = observer(
  ({ card_store, ...props }: PaperProps & { card_store: CardByIDStore }) => (
    <Paper elevation={0} {...props}>
      <ThemeBreadcrumbs selected={selectedCardThemes(card_store.card_data)} />
    </Paper>
  ),
);
export default CardTheme;
