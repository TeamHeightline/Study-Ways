import { useUserSession } from '../../../../shared/store/user-store/user-session';
import { useGetSimilarCardsQuery } from '../api/card-api';
import { skipToken } from '@reduxjs/toolkit/query';
import React from 'react';
import { PaperProps } from '@mui/material/Paper';
import { Grid, Paper, Stack, Typography } from '@mui/material';
import { CardByIDStore } from '../store/CardByIDStore';
import CardMicroView from '../../card-micro-view';
import { useNavigate } from 'react-router-dom';
interface ISimilarCardsProps extends PaperProps {
  card_store: CardByIDStore;
}
const SimilarCards = ({ card_store, ...props }: ISimilarCardsProps) => {
  const session = useUserSession();
  const navigate = useNavigate();
  const { currentData: similarCardsID = [] } = useGetSimilarCardsQuery(
    card_store.id
      ? { id: card_store.id, userId: String(session.recommendationUserId) }
      : skipToken,
  );
  const onCardClick = cardID => () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    navigate(`/card/${cardID}`);
  };
  if (!similarCardsID?.length) return null;
  return (
    <Paper elevation={0} {...props} className="sw-material-related">
      <Stack className="sw-material-related-heading">
        <Typography variant="h6" component="h2">
          Похожие карточки
        </Typography>
      </Stack>
      <Grid container className="sw-material-related-grid">
        {similarCardsID?.map(cardID => (
          <Grid
            key={cardID}
            size={{
              xs: 12,
              sm: 6,
              md: 'auto',
            }}
          >
            <CardMicroView
              cardID={Number(cardID)}
              onClick={onCardClick(cardID)}
              onChange={() => {}}
            />
          </Grid>
        ))}
      </Grid>
    </Paper>
  );
};
export default SimilarCards;
