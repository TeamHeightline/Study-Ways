// 23 июля начат процесс полного переписывания проекта на mobX, документация может быть устаревшей
// 10 августа, документация ОЧЕНЬ сильно устарела, вернее сказать, она в принципе ни как не связана с реальностью
// 22 января - проект переписывается на новую архитектуру, селекторы выделены в независимый слой, вся логика в сторах
// 8 июня - проект уже как минимум месяц пишется исключительно на Redux, MobX оказался плохим выбором
// 27 марта 2024 - решил, что буду улучшать проект по 10 минут каждый рабочий день
import React from 'react';
import './App.css';
import { Navibar } from './app/shared-components/navbar/Navibar';
import { BrowserRouter as Router } from 'react-router-dom';
import { CircularProgress, Grid } from '@mui/material';
import SeoData from './seo-data';
import AppRoutes from './app/routers/public-router';
import AppHook from './app.hook';
import { RouterWrapper } from './router-wrapper';
const App = () => {
  const { isLoading } = AppHook();
  if (isLoading) {
    return (
      <Grid
        container
        sx={{
          justifyContent: 'center',
          pt: 4,
        }}
      >
        <SeoData />
        <CircularProgress />
      </Grid>
    );
  }
  return (
    <>
      <Router>
        <Navibar />
        <SeoData />
        <RouterWrapper>
          <AppRoutes />
        </RouterWrapper>
      </Router>
    </>
  );
};
export default App;
