// @ts-nocheck

import React from 'react';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { DndProvider } from 'react-dnd';
import { configure } from 'mobx';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import ThemeStoreObject from './global-theme';
import { Auth0Provider } from '@auth0/auth0-react';
import { observer } from 'mobx-react';
import { Provider } from 'react-redux';
import reduxStore from './App/ReduxStore/RootStore';
import { createRoot } from 'react-dom/client';
import { ReactFlowProvider } from '@xyflow/react';

configure({
  enforceActions: 'never',
});

// Этот файл полностью посвящен тому, чтобы создать темную тему во все проекте.
// Цвета компонентов MUI задаются общей темой приложения.
const AppWithAllProviders = observer(() => (
  <ReactFlowProvider>
    <Provider store={reduxStore}>
      <Auth0Provider
        domain="dev-xjng6xd9.us.auth0.com"
        clientId="SJ055fS1pu4cnBi8zmWkUpu3LTolh2Oj"
        redirectUri={window.location.origin}
        audience="sw-backend-identifier"
        scope="read:current_user update:current_user_metadata"
        cacheLocation="localstorage"
      >
        <ThemeProvider theme={ThemeStoreObject.theme}>
          <CssBaseline />
          {/* <style>{'body {background-color: #0A1929}'}</style>*/}
          <DndProvider backend={HTML5Backend}>
            <div>
              <App />
            </div>
          </DndProvider>
        </ThemeProvider>
      </Auth0Provider>
    </Provider>
  </ReactFlowProvider>
));

const container = document.getElementById('root');
const root = createRoot(container);
root.render(<AppWithAllProviders />);

reportWebVitals();
