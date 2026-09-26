import { Box, CircularProgress, Grid, Stack, Typography } from '@mui/material';
import { BoxProps } from '@mui/material/Box/Box';
import { UserStorage } from '../../../Shared/Store/UserStore/UserStore';
import { useEffect } from 'react';
import { loadCardBookmarks } from '../Store/async-actions';
import {
  useAppDispatch,
  useAppSelector,
} from '../../../App/ReduxStore/RootStore';
import CardMicroView from '../../Cards/CardMicroView';
import { useNavigate } from 'react-router-dom';

type ICardBookmarksPageProps = BoxProps;

export default function CardBookmarksPage({
  ...props
}: ICardBookmarksPageProps) {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const is_loading_card_bookmarks = useAppSelector(
    (state) => state.cardBookmarks.is_loading_card_bookmarks,
  );
  const card_bookmarks_id_array = useAppSelector(
    (state) => state.cardBookmarks.card_bookmarks_id_array,
  );

  useEffect(() => {
    if (UserStorage.isLogin) {
      dispatch(loadCardBookmarks());
    }
  }, [UserStorage.isLogin]);

  useEffect(() => {
    dispatch(loadCardBookmarks());
  }, []);

  if (is_loading_card_bookmarks) {
    return (
      <Stack alignItems={'center'}>
        <CircularProgress />
      </Stack>
    );
  }

  return (
    <Box className="sw-learning-page sw-bookmarks-page" {...props}>
      <Stack className="sw-card-library-heading" alignItems="flex-start">
        <Typography className="sw-card-library-title" variant={'h3'}>
          Карточки, добавленные в закладки
        </Typography>
      </Stack>
      <Grid className="sw-card-library-grid" container spacing={2} justifyContent="center">
        {card_bookmarks_id_array?.map((card_id, index) => (
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
