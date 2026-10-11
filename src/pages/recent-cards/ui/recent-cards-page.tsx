import { useUserSession } from '../../../shared/store/user-store/user-session';
import { ThemeManulNote } from '../../../shared/theme/ThemeManulNote';
import { Box, Typography } from '@mui/material';
import { BoxProps } from '@mui/material/Box';
import { useEffect } from 'react';
import {
  useAppDispatch,
  useAppSelector,
} from '../../../app/redux-store/RootStore';
import { loadRecentCardsThunk } from '../store/async-actions';
import UIIsHideDuplicates from './ui-is-hide-duplicates';
import CardHistoryTimeline from '../../card-history/ui/card-history-timeline';

const RecentCardsPage = ({ className = '', ...props }: BoxProps) => {
  const session = useUserSession();
  const dispatch = useAppDispatch();
  const history = useAppSelector(state => state.recentCards);
  const isLogin = session.isLogin;

  useEffect(() => {
    if (isLogin) dispatch(loadRecentCardsThunk());
  }, [dispatch, isLogin, session.user?.id]);

  const cardIDs = history.is_hide_duplicates
    ? history.unique_recent_card_id_array
    : history.recent_card_id_array;

  return (
    <Box {...props} className={`sw-learning-page sw-history-page ${className}`}>
      <header className="sw-history-page-heading">
        <div className="sw-card-library-heading">
          <Typography component="h1" className="sw-card-library-title">
            История просмотров
          </Typography>
          <Typography component="p" className="sw-history-page-description">
            Ваш путь по учебным материалам. Последние просмотры — в начале
            списка.
          </Typography>
        </div>
        {!history.is_loading_recent_card_id_array && !history.hasLoadError && (
          <span className="sw-history-page-count">
            Записей: {cardIDs.length}
          </span>
        )}
      </header>
      <ThemeManulNote context="history" />
      <UIIsHideDuplicates />
      <CardHistoryTimeline
        cardIDs={cardIDs}
        isLoading={history.is_loading_recent_card_id_array}
        hasError={history.hasLoadError}
        onRetry={() => dispatch(loadRecentCardsThunk())}
      />
    </Box>
  );
};

export default RecentCardsPage;
