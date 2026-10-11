import { createSelector } from '@reduxjs/toolkit';
import { useSelector } from 'react-redux';
import { studyWaysApi } from '../../ServerLayer/QueryLayer/api';

export type UserRole = 'STUDENT' | 'TEACHER' | 'ADMIN' | 'CARD_EDITOR';

export interface BasicUserData {
  id: number;
  username: string;
  user_access_level: UserRole;
}

export const userApi = studyWaysApi.injectEndpoints({
  endpoints: builder => ({
    getCurrentUser: builder.query<BasicUserData | null, void>({
      query: () => ({ url: '/page/me/basic-data' }),
      providesTags: user =>
        user ? [{ type: 'CurrentUser', id: user.id }] : [],
    }),
  }),
});

// AppHook owns the subscription for the lifetime of the authenticated session.
// All consumers read the same cache entry; no second copy of the user is stored.
export const selectUserSession = createSelector(
  userApi.endpoints.getCurrentUser.select(),
  ({ data }) => {
    const user = data?.id ? data : null;
    return {
      user,
      isLogin: !!user,
      role: user?.user_access_level ?? 'STUDENT',
      username: user?.username ?? '',
      recommendationUserId: String(user?.id ?? '-1'),
    };
  },
);

export const useUserSession = () => useSelector(selectUserSession);
