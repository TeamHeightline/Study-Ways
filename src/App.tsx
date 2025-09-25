// 23 июля начат процесс полного переписывания проекта на mobX, документация может быть устаревшей
// 10 августа, документация ОЧЕНЬ сильно устарела, вернее сказать, она в принципе ни как не связана с реальностью
// 22 января - проект переписывается на новую архитектуру, селекторы выделены в независимый слой, вся логика в сторах
// 8 июня - проект уже как минимум месяц пишется исключительно на Redux, MobX оказался плохим выбором
// 27 марта 2024 - решил, что буду улучшать проект по 10 минут каждый рабочий день

import React from "react";
import "./App.css";
import { Navibar } from "./App/SharedComponents/Navbar/Navibar";

import { BrowserRouter as Router } from "react-router-dom";

import { ApolloProvider } from "@apollo/client";
import { observer } from "mobx-react";
import { ClientStorage } from "./Shared/Store/ApolloStorage/ClientStorage";
import { CircularProgress, Grid } from "@mui/material";
import SeoData from "./seo-data";
import AppRoutes from "./App/Routers/PublicRouter";
import AppHook from "./app.hook";
import { useLoadCardsDataForMicroView } from "./Pages/Cards/CardMicroView/store/hooks";
import { RouterWrapper } from "./router-wrapper";

const App = observer(() => {
  useLoadCardsDataForMicroView();
  const { isLoading } = AppHook();

  if (isLoading) {
    return (
      <Grid container justifyContent={"center"} sx={{ pt: 4 }}>
        <SeoData />
        <CircularProgress />
      </Grid>
    );
  }

  return (
    <>
      <ApolloProvider client={ClientStorage.client}>
        <Router>
          <Navibar />
          <SeoData />
          <RouterWrapper>
            <AppRoutes />
          </RouterWrapper>
        </Router>
      </ApolloProvider>
    </>
  );
});
export default App;
