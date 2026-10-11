import { useUserSession } from '../../../Shared/Store/UserStore/user-session';
import { ThemeManulNote } from '../../../Shared/Theme/ThemeManulNote';
import React, { Suspense } from 'react';
import { Alert, Box, CircularProgress, Grid } from '@mui/material';
import AlertTitle from '@mui/material/AlertTitle';
import { Route, Routes } from 'react-router-dom';
import RouterMenu from './router-menu';
import { privateRoutes } from './routes';

export const EditorsRouter = () => {
  const session = useUserSession();
  const haveStatus = (roles: string[]) => roles.includes(session.role);
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
                      <Grid
                        container
                        sx={{
                          justifyContent: 'center',
                          pt: 4,
                        }}
                      >
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
};
