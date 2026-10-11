import { installThemePersistence } from '../../shared/theme/theme-store';
import { configureStore } from '@reduxjs/toolkit';
import { RootReducer } from './RootReducer';

import { studyWaysApi } from '../../shared/server-layer/query-layer/api';

const reduxStore = configureStore({
  reducer: RootReducer,
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: false,
    }).concat(studyWaysApi.middleware),
});

installThemePersistence(reduxStore);
export default reduxStore;
export type AppDispatch = typeof reduxStore.dispatch;
export { useAppDispatch, useAppSelector } from './hooks';

export type RootState = ReturnType<typeof reduxStore.getState>;
