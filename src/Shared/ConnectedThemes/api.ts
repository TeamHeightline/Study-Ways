import { useMemo } from 'react';
import { studyWaysApi } from '../ServerLayer/QueryLayer/api';
import { ConnectedTheme, toThemeTreeData } from './model';

export const connectedThemesApi = studyWaysApi
  .enhanceEndpoints({ addTagTypes: ['ConnectedThemes'] })
  .injectEndpoints({
    endpoints: builder => ({
      getConnectedThemes: builder.query<ConnectedTheme[], void>({
        query: () => ({ url: '/page/connected-themes' }),
        providesTags: ['ConnectedThemes'],
      }),
    }),
  });

export const { useGetConnectedThemesQuery } = connectedThemesApi;

export function useConnectedThemeOptions() {
  const query = useGetConnectedThemesQuery();
  const treeData = useMemo(
    () => toThemeTreeData(query.data ?? []),
    [query.data],
  );
  return { ...query, treeData };
}
