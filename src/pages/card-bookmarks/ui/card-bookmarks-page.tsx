import { useUserSession } from '../../../shared/store/user-store/user-session';
import { ThemeManulNote } from '../../../shared/theme/ThemeManulNote';
import { Box, CircularProgress, Grid, Stack, Typography } from '@mui/material';
import { BoxProps } from '@mui/material/Box';
import { useEffect } from 'react';
import { loadCardBookmarks } from '../store/async-actions';
import {
  useAppDispatch,
  useAppSelector,
} from '../../../app/redux-store/RootStore';
import CardMicroView from '../../cards/card-micro-view';
import { useNavigate } from 'react-router-dom';

type ICardBookmarksPageProps = BoxProps;

export default function CardBookmarksPage({
  ...props
}: ICardBookmarksPageProps) {
  const session = useUserSession();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const is_loading_card_bookmarks = useAppSelector(
    state => state.cardBookmarks.is_loading_card_bookmarks,
  );
  const card_bookmarks_id_array = useAppSelector(
    state => state.cardBookmarks.card_bookmarks_id_array,
  );

  useEffect(() => {
    if (session.isLogin) {
      dispatch(loadCardBookmarks());
    }
  }, [session.user?.id, dispatch]);

  if (is_loading_card_bookmarks) {
    return (
      <Stack
        sx={{
          alignItems: 'center',
        }}
      >
        <CircularProgress />
      </Stack>
    );
  }

  return (
    <Box className="sw-learning-page sw-bookmarks-page" {...props}>
      <Stack
        className="sw-card-library-heading"
        sx={{
          alignItems: 'flex-start',
        }}
      >
        <Typography className="sw-card-library-title" variant={'h3'}>
          Карточки, добавленные в закладки
        </Typography>
      </Stack>
      <ThemeManulNote context="bookmarks" />
      <Grid
        className="sw-card-library-grid"
        container
        spacing={2}
        sx={{
          justifyContent: 'center',
        }}
      >
        {card_bookmarks_id_array?.map((card_id, index) => (
          <Grid
            key={`${index}_${card_id}`}
            size={{
              xs: 12,
              sm: 6,
              md: 'auto',
            }}
          >
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
