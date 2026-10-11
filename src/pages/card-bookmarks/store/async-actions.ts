import { createAsyncThunk } from '@reduxjs/toolkit';
import axiosClient from '../../../shared/server-layer/query-layer/config';

export const loadCardBookmarks = createAsyncThunk(
  'cardBookmarksSlice/loadCardBookmarks',
  () =>
    axiosClient
      .get('page/personal-cabinet/my-bookmarks')
      .then((res) => res.data),
);
