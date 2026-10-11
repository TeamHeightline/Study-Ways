import { studyWaysApi } from '../ServerLayer/QueryLayer/api';
import { ConnectedTheme } from './model';

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
