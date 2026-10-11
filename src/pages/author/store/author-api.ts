import { studyWaysApi } from '../../../shared/server-layer/query-layer/api';
import { ICourseData } from '../../course/page/redux-store/types';
import { AuthorData } from './types';

export const authorApi = studyWaysApi
  .enhanceEndpoints({ addTagTypes: ['Authors', 'CourseCatalog'] })
  .injectEndpoints({
    endpoints: builder => ({
      getAuthor: builder.query<AuthorData | null, number>({
        providesTags: ['Authors'],
        query: id => ({ url: `/page/author/${id}` }),
      }),
      // The REST API returns catalogs; the page selects this author's IDs locally.
      getCourseCatalog: builder.query<ICourseData[], void>({
        query: () => ({ url: '/page/course' }),
        providesTags: ['CourseCatalog'],
      }),
    }),
  });

export const { useGetAuthorQuery, useGetCourseCatalogQuery } = authorApi;
