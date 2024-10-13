// @ts-nocheck

import React from 'react';
import App from './App';
import reportWebVitals from './reportWebVitals';
import {HTML5Backend} from 'react-dnd-html5-backend'
import {DndProvider} from 'react-dnd'
import {configure} from "mobx"
import {ThemeProvider} from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import 'antd/dist/antd.dark.min.css';
import ThemeStoreObject from "./global-theme";
import {Auth0Provider} from "@auth0/auth0-react";
import {observer} from "mobx-react";
import {Provider} from "react-redux";
import reduxStore from "./ReduxStore/RootStore";
import {createRoot} from "react-dom/client";
import {LocalizationProvider} from '@mui/x-date-pickers'
import {AdapterMoment} from '@mui/x-date-pickers/AdapterMoment';
import {ReactFlowProvider} from "@xyflow/react";
import {
    QueryClient,
    QueryClientProvider
} from '@tanstack/react-query'


configure({
    enforceActions: "never",
})

const queryClient = new QueryClient()

//Этот файл полностью посвящен тому, чтобы создать темную тему во все проекте.
//Для Material UI мы создаем ThemeProvider, для AntDesign - импортируем темную тему
const AppWithAllProviders = observer(() => {

    return (
        <QueryClientProvider client={queryClient}>
            <ReactFlowProvider>
                <LocalizationProvider dateAdapter={AdapterMoment}>
                    <Provider store={reduxStore}>
                        <Auth0Provider
                            domain="dev-xjng6xd9.us.auth0.com"
                            clientId="SJ055fS1pu4cnBi8zmWkUpu3LTolh2Oj"
                            redirectUri={window.location.origin}
                            audience="sw-backend-identifier"
                            scope="read:current_user update:current_user_metadata"
                        >
                            <ThemeProvider theme={ThemeStoreObject.theme}>
                                <CssBaseline/>
                                {/*<style>{'body {background-color: #0A1929}'}</style>*/}
                                <DndProvider backend={HTML5Backend}>
                                    <div>
                                        <App/>
                                    </div>
                                </DndProvider>

                            </ThemeProvider>
                        </Auth0Provider>
                    </Provider>
                </LocalizationProvider>
            </ReactFlowProvider>
        </QueryClientProvider>
    )
})

const container = document.getElementById('root');
const root = createRoot(container);
root.render(<AppWithAllProviders/>);

reportWebVitals();
