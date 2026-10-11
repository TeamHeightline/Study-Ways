import { studyWaysApi } from '../../shared/server-layer/query-layer/api';
import { CourseData } from './edit-course-by-id/course-data';
import { CoursePageCard } from './course-materials-api';
export interface CourseReadData {
  id: number;
  name: string | null;
  course_data: CourseData;
  created_by_id: number | null;
  cards_cardcourseimage: { image: string | null } | null;
  users_customuser: {
    id: number;
    username: string;
    users_userprofile: {
      firstname: string | null;
      lastname: string | null;
    } | null;
  } | null;
}
export interface OwnCourseSummary {
  id: string;
  name: string | null;
  courseData: unknown;
  cards_cardcourseimage: { image: string | null } | null;
}
export const courseApi = studyWaysApi
  .enhanceEndpoints({ addTagTypes: ['Course', 'OwnCourses', 'Card'] })
  .injectEndpoints({
    endpoints: builder => ({
      getCourse: builder.query<CourseReadData | null, number>({
        query: id => ({ url: `/page/course-read/${id}` }),
        providesTags: (result, error, id) => [{ type: 'Course', id }],
      }),
      getOwnCourses: builder.query<OwnCourseSummary[], number | undefined>({
        query: () => ({ url: '/page/course-read/my' }),
        providesTags: ['OwnCourses'],
      }),
      getCourseCardPreview: builder.query<CoursePageCard | null, number>({
        query: id => ({ url: `/page/course-by-id/card-data/${id}` }),
        providesTags: (result, error, id) => [{ type: 'Card', id }],
      }),
    }),
  });
export const {
  useGetCourseQuery,
  useGetOwnCoursesQuery,
  useGetCourseCardPreviewQuery,
} = courseApi;
