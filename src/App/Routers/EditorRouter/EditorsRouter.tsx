import { ThemeManulNote } from '../../../Shared/Theme/ThemeManulNote';
import React, { Suspense } from 'react';
import { Alert, Box, CircularProgress, Grid } from '@mui/material';
import AlertTitle from '@mui/material/AlertTitle';
import { observer } from 'mobx-react';
import { Route, Routes } from 'react-router-dom';
import RouterMenu from './router-menu';
import haveStatus from '../../../Shared/Store/UserStore/utils/HaveStatus';
import { privateRoutes } from './routes';

export const EditorsRouter = observer(() => {
  if (!haveStatus(['ADMIN', 'TEACHER', 'CARD_EDITOR'])) {
    return (
      <Alert severity="error">
        <AlertTitle>Доступ ограничен</AlertTitle>
        Вы не обладаете достаточными правами, чтобы просматривать этот раздел,
        для дополнитльной информации обратитесь к администрации
      </Alert>
    );
  }
  return (
    <Box>
      <RouterMenu />
      <Box className="sw-editor-content" sx={{ minWidth: 0 }}>
        <Routes>
          {privateRoutes
            .filter(route => haveStatus(route.status))
            .map(route => (
              <Route
                path={route.path}
                element={
                  <Suspense
                    fallback={
                      <Grid container justifyContent={'center'} sx={{ pt: 4 }}>
                        <CircularProgress />
                      </Grid>
                    }
                  >
                    {route.component}
                  </Suspense>
                }
              />
            ))}
        </Routes>
        <ThemeManulNote context="editor" />
      </Box>
    </Box>
  );
});
