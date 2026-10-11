import { studyWaysApi } from '../../../../shared/server-layer/query-layer/api';
import { ICourseData } from '../redux-store/types';
import { ICoursePosition } from '../ui/course-by-data/types';

export interface CourseCatalogFilters {
  page: number;
  search: string;
  authorId: string | null;
  levels: 'all' | 'single' | 'multi';
  sort: 'default' | 'name';
}

interface CourseCatalogPage {
  items: ICourseData[];
  total: number;
  activePage: number;
  numPages: number;
}

export interface CardCourseLink {
  course_id: string;
  course_name: string;
  position: ICoursePosition;
}

export const courseCatalogApi = studyWaysApi
  .enhanceEndpoints({ addTagTypes: ['CourseCatalog', 'CardCourseLinks'] })
  .injectEndpoints({
    endpoints: builder => ({
      getCourseCatalogPage: builder.query<
        CourseCatalogPage,
        CourseCatalogFilters
      >({
        providesTags: ['CourseCatalog'],
        query: ({ authorId, ...params }) => ({
          url: '/page/course/catalog',
          params: { ...params, ...(authorId === null ? {} : { authorId }) },
        }),
      }),
      getCardCourseLinks: builder.query<CardCourseLink[], number>({
        providesTags: ['CardCourseLinks'],
        query: id => ({ url: `/page/course/card/${id}` }),
      }),
    }),
  });

export const { useGetCourseCatalogPageQuery, useGetCardCourseLinksQuery } =
  courseCatalogApi;
