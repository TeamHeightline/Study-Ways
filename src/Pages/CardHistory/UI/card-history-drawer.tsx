import {
  Box,
  Button,
  IconButton,
  SwipeableDrawer,
  Typography,
} from '@mui/material';
import { BoxProps } from '@mui/material/Box/Box';
import React, { useEffect, useState } from 'react';
import { observer } from 'mobx-react';
import { Link } from 'react-router-dom';
import HistoryRoundedIcon from '@mui/icons-material/HistoryRounded';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded';
import { UserStorage } from '../../../Shared/Store/UserStore/UserStore';
import { loadRecentCardsThunk } from '../../RecentCards/Store/async-actions';
import {
  useAppDispatch,
  useAppSelector,
} from '../../../App/ReduxStore/RootStore';
import { isMobileHook } from '../../../Shared/CustomHooks/isMobileHook';
import CardHistoryTimeline from './card-history-timeline';

const CardHistoryDrawer = observer((props: BoxProps) => {
  const dispatch = useAppDispatch();
  const history = useAppSelector(state => state.recentCards);
  const [isOpen, setIsOpen] = useState(false);
  const isMobile = isMobileHook();
  const isLogin = UserStorage.isLogin;
  const closeHistoryDrawer = () => setIsOpen(false);

  useEffect(() => {
    if (isLogin) dispatch(loadRecentCardsThunk());
  }, [dispatch, isLogin]);

  return (
    <Box {...props}>
      <Button
        onClick={() => setIsOpen(true)}
        variant="outlined"
        startIcon={<HistoryRoundedIcon />}
        className="sw-history-trigger"
        aria-haspopup="dialog"
        aria-expanded={isOpen}
      >
        История просмотров
      </Button>
      <SwipeableDrawer
        open={isOpen}
        onOpen={() => setIsOpen(true)}
        onClose={closeHistoryDrawer}
        anchor={isMobile ? 'bottom' : 'right'}
        PaperProps={{
          className: `sw-history-drawer${isMobile ? ' is-mobile' : ''}`,
          role: 'dialog',
          'aria-modal': true,
          'aria-labelledby': 'card-history-title',
        }}
      >
        <header className="sw-history-drawer-heading">
          <div className="sw-history-drawer-topline">
            <span className="sw-history-heading-icon">
              <HistoryRoundedIcon />
            </span>
            <IconButton
              onClick={closeHistoryDrawer}
              aria-label="Закрыть историю просмотров"
            >
              <CloseRoundedIcon />
            </IconButton>
          </div>
          <Typography component="h2" id="card-history-title">
            История просмотров
          </Typography>
          <Typography component="p">
            Вернитесь к материалам, которые вы открывали недавно.
          </Typography>
        </header>
        <div className="sw-history-drawer-body">
          <CardHistoryTimeline
            cardIDs={history.recent_card_id_array}
            isLoading={history.is_loading_recent_card_id_array}
            hasError={history.hasLoadError}
            onRetry={() => dispatch(loadRecentCardsThunk())}
            onOpenCard={closeHistoryDrawer}
          />
        </div>
        <footer className="sw-history-drawer-footer">
          <Button
            component={Link}
            to="/recent-cards"
            onClick={closeHistoryDrawer}
            endIcon={<ArrowForwardRoundedIcon />}
          >
            Вся история просмотров
          </Button>
        </footer>
      </SwipeableDrawer>
    </Box>
  );
});

export default CardHistoryDrawer;
