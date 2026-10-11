import { useGetSimilarCardsQuery } from '../API/card-api';
import { UserStorage } from '../../../../Shared/Store/UserStore/UserStore';
import { skipToken } from '@reduxjs/toolkit/query';
import { observer } from 'mobx-react';
import React from 'react';
import { PaperProps } from '@mui/material/Paper/Paper';
import { Grid, Paper, Stack, Typography } from '@mui/material';
import { CardByIDStore } from '../Store/CardByIDStore';
import CardMicroView from '../../CardMicroView';
import { useNavigate } from 'react-router-dom';

interface ISimilarCardsProps extends PaperProps {
  card_store: CardByIDStore;
}

const SimilarCards = observer(
  ({ card_store, ...props }: ISimilarCardsProps) => {
    const navigate = useNavigate();
    const { currentData: similarCardsID = [] } = useGetSimilarCardsQuery(
      card_store.id
        ? { id: card_store.id, userId: String(UserStorage.userIDForRecombee) }
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
            <Grid item xs={12} sm={6} md={'auto'} key={cardID}>
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
  },
);

export default SimilarCards;
