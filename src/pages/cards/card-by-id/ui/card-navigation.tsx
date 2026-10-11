import React from 'react';
import { PaperProps } from '@mui/material/Paper';
import { Grid, Paper } from '@mui/material';
import { CardByIDStore } from '../store/CardByIDStore';
import CardAuthorNavigation from './card-author-navigation';
interface ICardNavigationRatingFindProps extends PaperProps {
  card_store: CardByIDStore;
}
const AuthorNavigation = ({
  card_store,
  ...props
}: ICardNavigationRatingFindProps) => (
  <Paper elevation={0} {...props}>
    <Grid container>
      <Grid
        size={{
          xs: 12,
          md: 6,
        }}
      >
        <CardAuthorNavigation card_store={card_store} />
      </Grid>
    </Grid>
  </Paper>
);
export default AuthorNavigation;
