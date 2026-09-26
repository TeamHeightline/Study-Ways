import { Box, CircularProgress, Grid, Stack, Typography } from '@mui/material';
import { BoxProps } from '@mui/material/Box/Box';
import {
  useAppDispatch,
  useAppSelector,
} from '../../../App/ReduxStore/RootStore';
import CardMicroView from '../../Cards/CardMicroView';
import { useEffect } from 'react';
import { UserStorage } from '../../../Shared/Store/UserStore/UserStore';
import { loadRecentCardsThunk } from '../Store/async-actions';
import UIIsHideDuplicates from './ui-is-hide-duplicates';
import { useNavigate } from 'react-router-dom';

type IRecentCardsPageProps = BoxProps;

export default function RecentCardsPage({ ...props }: IRecentCardsPageProps) {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const is_loading_recent_card_id_array = useAppSelector(
    (state) => state.recentCards.is_loading_recent_card_id_array,
  );
  const recent_card_id_array = useAppSelector(
    (state) => state.recentCards.recent_card_id_array,
  );
  const unique_recent_card_id_array = useAppSelector(
    (state) => state.recentCards.unique_recent_card_id_array,
  );
  const is_hide_duplicates = useAppSelector(
    (state) => state.recentCards.is_hide_duplicates,
  );

  useEffect(() => {
    if (UserStorage.isLogin) {
      dispatch(loadRecentCardsThunk());
    }
  }, [UserStorage.isLogin]);

  useEffect(() => {
    dispatch(loadRecentCardsThunk());
  }, []);

  if (is_loading_recent_card_id_array) {
    return (
      <Stack alignItems={'center'}>
        <CircularProgress />
      </Stack>
    );
  }

  const cards_id_array = is_hide_duplicates
    ? unique_recent_card_id_array
    : recent_card_id_array;
  return (
    <Box className="sw-learning-page sw-history-page" {...props}>
      <Stack className="sw-card-library-heading" alignItems="flex-start">
        <Typography className="sw-card-library-title" variant={'h3'}>
          Недавно просмотренные карточки
        </Typography>
      </Stack>
      <UIIsHideDuplicates className="sw-card-library-filter" />
      <Grid className="sw-card-library-grid" container spacing={2} justifyContent="center">
        {cards_id_array?.map((card_id, index) => (
          <Grid item xs={12} sm={6} md="auto" key={`${index}_${card_id}`}>
            <CardMicroView
              cardID={card_id}
              onClick={() => {
                navigate(`/card/${card_id}`);
              }}
            />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
