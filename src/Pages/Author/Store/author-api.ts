import { studyWaysApi } from '../../../Shared/ServerLayer/QueryLayer/api';
import { CardHashMap } from '../../Cards/CardMicroView/store/type';
import { ICourseData } from '../../Course/Page/redux-store/types';
import { AuthorData } from './types';

export const authorApi = studyWaysApi
  .enhanceEndpoints({ addTagTypes: ['Authors', 'CourseCatalog', 'CardList'] })
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
      getCardPreviews: builder.query<CardHashMap, void>({
        query: () => ({ url: '/page/card-micro-view/all' }),
        providesTags: ['CardList'],
      }),
    }),
  });

export const {
  useGetAuthorQuery,
  useGetCourseCatalogQuery,
  useGetCardPreviewsQuery,
} = authorApi;
