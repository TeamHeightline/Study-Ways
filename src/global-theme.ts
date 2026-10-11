import { useMemo } from 'react';
import { useAppDispatch, useAppSelector } from './app/redux-store/hooks';
import { getThemeSettings, themeActions } from './shared/theme/theme-store';
export function useThemeSettings() {
  const id = useAppSelector(state => state.theme.id);
  const dispatch = useAppDispatch();
  const settings = useMemo(() => getThemeSettings(id), [id]);
  return {
    ...settings,
    setTheme: (id: string) => dispatch(themeActions.themeChanged(id)),
  };
}
