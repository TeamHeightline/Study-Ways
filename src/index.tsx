// @ts-nocheck
import React from 'react';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { useThemeSettings } from './global-theme';
import { Auth0Provider } from '@auth0/auth0-react';
import { Provider } from 'react-redux';
import reduxStore from './app/redux-store/RootStore';
import { createRoot } from 'react-dom/client';
import { ReactFlowProvider } from '@xyflow/react';
// Этот файл полностью посвящен тому, чтобы создать темную тему во все проекте.
// Цвета компонентов MUI задаются общей темой приложения.
const ThemedApp = () => {
  const theme = useThemeSettings();
  return (
    <ThemeProvider theme={theme.theme}>
      <CssBaseline />
      <App />
    </ThemeProvider>
  );
};
const AppWithAllProviders = () => (
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
        <ThemedApp />
      </Auth0Provider>
    </Provider>
  </ReactFlowProvider>
);
const container = document.getElementById('root');
const root = createRoot(container);
root.render(<AppWithAllProviders />);
reportWebVitals();
