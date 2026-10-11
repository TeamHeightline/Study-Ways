import { useUserSession } from '../../../../shared/store/user-store/user-session';
import React from 'react';
import { PaperProps } from '@mui/material/Paper';
import { Box, Grid, Paper, Stack } from '@mui/material';
import CardMainContent from './card-main-content';
import { CardByIDStore } from '../store/CardByIDStore';
import CardDescription from './card-description';
import CardGoToResource from './card-go-to-resourse';
import TestBeforeCard from './test-before-card';
import CardHistoryDrawer from '../../../card-history/ui/card-history-drawer';
import CardFindInCourse from './card-find-in-course';
import { useAuth0 } from '@auth0/auth0-react';
import CardViews from './card-views';
interface ICardContentAndDescriptionProps extends PaperProps {
  card_store: CardByIDStore;
}
const CardContentAndDescription = ({
  card_store,
  ...props
}: ICardContentAndDescriptionProps) => {
  const session = useUserSession();
  const { isAuthenticated } = useAuth0();
  return (
    <Paper elevation={0} {...props} className="sw-material-body">
      <Grid
        container
        className="sw-card-content-grid"
        spacing={{ xs: 2, md: 5 }}
      >
        <Grid
          size={{
            xs: 12,
            md: 6,
          }}
        >
          <CardMainContent card_store={card_store} />
          <Stack
            direction={'row'}
            sx={{
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <CardViews card_id={card_store.id} />
            <Box>
              {/* {isAuthenticated &&*/}
              {/*    <Stack direction={"row"} alignItems={"center"}>*/}
              {/*        <CardRating card_store={card_store}/>*/}
              {/*        <CardBookmark card_store={card_store}/>*/}
              {/*    </Stack>}*/}
            </Box>
          </Stack>
        </Grid>
        <Grid
          size={{
            xs: 12,
            md: 6,
          }}
        >
          <Stack className="sw-card-details" direction={'column'} spacing={2}>
            <TestBeforeCard card_store={card_store} />
            <CardGoToResource card_store={card_store} />
            {session.isLogin && <CardHistoryDrawer />}
            <CardDescription card_store={card_store} />
            <CardFindInCourse card_store={card_store} />
          </Stack>
        </Grid>
      </Grid>
    </Paper>
  );
};
export default CardContentAndDescription;
