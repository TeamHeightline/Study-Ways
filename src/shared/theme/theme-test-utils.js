import { configureStore } from '@reduxjs/toolkit';
import reducer, {
  getThemeSettings,
  installThemePersistence,
} from './theme-store';
export function createThemeTestStore(extra = {}) {
  const store = configureStore({ reducer: { theme: reducer, ...extra } });
  installThemePersistence(store);
  return store;
}
export const readTheme = store => getThemeSettings(store.getState().theme.id);
