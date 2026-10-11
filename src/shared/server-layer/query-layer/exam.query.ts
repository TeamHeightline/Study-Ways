import { writeApi } from './write-api';
import { executeMutation, executeQueuedMutation } from './execute-mutation';
import axiosClient from './config';
import { IQuestionStatus } from '../../../pages/exam/exam-by-uid/redux-store/InitialState';
import {
  IExamData,
  IExamDataWithQSData,
  IExamResult,
} from '../types/exam.types';

export async function loadExamByID(examID: string) {
  return axiosClient.get(`/exam/data/${examID}`).then(res => res.data.examData);
}

export async function updateExam(examID: string, examData: any) {
  return executeQueuedMutation(
    `exam-${examID}`,
    writeApi.endpoints.saveExam.initiate({
      id: Number(examID),
      data: examData,
    }),
  );
}

export async function loadExamOnOpenData(examUID: string, password?: string) {
  return executeMutation(
    writeApi.endpoints.openExam.initiate({ uid: examUID, password }),
  );
}

export async function examNameByUID(examUID: string) {
  return axiosClient
    .get(`/exam/name/${examUID}`)
    .then(res => res.data.examName);
}

export async function updateQuestionProgress(
  questionProgressData: IQuestionStatus,
): Promise<IQuestionStatus> {
  return executeMutation(
    writeApi.endpoints.saveExamProgress.initiate({
      id: questionProgressData.id,
      statistic_id: Number(questionProgressData.statistic_id),
    }),
  );
}

export async function loadMyExams(): Promise<IExamDataWithQSData[]> {
  return axiosClient.get('/exam/my-exams').then(res => res.data.exams);
}

export async function createExam(
  question_sequence_id: number,
  name: string,
): Promise<IExamData> {
  return executeMutation(
    writeApi.endpoints.createExam.initiate({ question_sequence_id, name }),
  );
}

export async function getExamResults(examID: number): Promise<IExamResult[]> {
  return axiosClient.get(`/exam/results/${examID}`).then(res => res.data);
}
