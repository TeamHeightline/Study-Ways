import { useMemo } from 'react';
import { studyWaysApi } from '../../Shared/ServerLayer/QueryLayer/api';

export interface CoursePageCard {
  id: number;
  title: string;
  card_content_type: number;
  video_url: string | null;
  cards_cardimage: { image: string } | null;
}

export const courseMaterialsApi = studyWaysApi.injectEndpoints({
  endpoints: builder => ({
    getCoursePageCards: builder.query<
      CoursePageCard[],
      { courseId: number; page: number }
    >({
      query: ({ courseId, page }) => ({
        url: `/page/course-by-id/${courseId}/cards`,
        params: { page },
      }),
    }),
  }),
});

export function useCoursePageMaterials(
  courseId: number,
  page: number,
  enabled: boolean,
) {
  const query = courseMaterialsApi.useGetCoursePageCardsQuery(
    { courseId, page },
    {
      skip:
        !enabled ||
        !Number.isInteger(courseId) ||
        courseId < 1 ||
        !Number.isInteger(page) ||
        page < 1,
    },
  );
  // currentData prevents the previous page's titles appearing on new nodes
  // while a different course or page is loading.
  const materials = useMemo(
    () =>
      Object.fromEntries(
        (query.currentData ?? []).map(card => [String(card.id), card]),
      ),
    [query.currentData],
  );
  return { ...query, materials };
}
