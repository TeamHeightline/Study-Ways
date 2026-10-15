import { installThemePersistence } from '../../shared/theme/theme-store';
import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import { RootReducer } from './RootReducer';

import { studyWaysApi } from '../../shared/server-layer/query-layer/api';

const reduxStore = configureStore({
  reducer: RootReducer,
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: false,
    }).concat(studyWaysApi.middleware),
});

setupListeners(reduxStore.dispatch);
installThemePersistence(reduxStore);
export default reduxStore;
export type AppDispatch = typeof reduxStore.dispatch;
export { useAppDispatch, useAppSelector } from './hooks';

export type RootState = ReturnType<typeof reduxStore.getState>;
