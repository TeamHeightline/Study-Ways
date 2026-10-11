import { getExamResults } from '../../../../shared/server-layer/query-layer/exam.query';
import { createAsyncThunk } from '@reduxjs/toolkit';

export const loadExamResultsAsync = createAsyncThunk(
  'examResults/load',
  async (exam_id: number, { dispatch }) => getExamResults(exam_id),
);
