import { getQSByID } from '../../../../../Shared/ServerLayer/QueryLayer/question-sequence.query';
import {
  loadExamByID,
  updateExam,
} from '../../../../../Shared/ServerLayer/QueryLayer/exam.query';
import { createAsyncThunk } from '@reduxjs/toolkit';

export const loadQSDataThunk = createAsyncThunk(
  'examEditor/loadQSData',
  async (qsID: string) => getQSByID(qsID),
);

export const loadExamDataThunk = createAsyncThunk(
  'examEditor/loadExamData',
  async (examID: string, { rejectWithValue }) => {
    try {
      return await loadExamByID(examID);
    } catch (error) {
      return rejectWithValue(
        (error as any)?.response?.data?.message ||
          'Не удалось загрузить экзамен',
      );
    }
  },
);

export const updateExamThunk = createAsyncThunk(
  'examEditor/updateExam',
  async (examData: any, { rejectWithValue }) => {
    try {
      const { id, ...examDataWithoutID } = examData;
      return await updateExam(id, examDataWithoutID);
    } catch (error) {
      return rejectWithValue(
        (error as any)?.data?.message || 'Не удалось сохранить экзамен',
      );
    }
  },
);
