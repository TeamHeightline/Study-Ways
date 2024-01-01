// API из RTK Query для работы с данными страницы редактирования группы пользователей

import {createApi} from '@reduxjs/toolkit/query/react';
import {UserGroup} from "./types";
import {axiosBaseQuery} from "../../../../rtk-base-query";

export const userGroupApi = createApi({
    reducerPath: 'userGroupApi',
    baseQuery: axiosBaseQuery({
        baseUrl: "/page/user-groups"
    }),
    endpoints: (builder) => ({
        getUserGroups: builder.query<UserGroup[], void>({
            query: () => ({url: `/`}),
        }),
        updateUserGroup: builder.mutation<UserGroup, UserGroup>({
            query: (userGroup) => ({
                url: `/${userGroup.id}`,
                method: 'PUT',
                body: userGroup,
            }),
        }),
        createUserGroup: builder.mutation<UserGroup, UserGroup>({
            query: (userGroup) => ({
                url: '/',
                method: 'POST',
                body: userGroup,
            }),
        }),
        deleteUserGroup: builder.mutation<void, number>({
            query: (id) => ({
                url: '/',
                method: 'DELETE',
                body: {id},
            }),
        }),
    }),
});

export const {
    useGetUserGroupsQuery,
    useUpdateUserGroupMutation,
    useCreateUserGroupMutation,
    useDeleteUserGroupMutation,
} = userGroupApi;