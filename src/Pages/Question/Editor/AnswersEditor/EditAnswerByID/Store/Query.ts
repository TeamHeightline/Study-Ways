import axiosClient from '../../../../../../Shared/ServerLayer/QueryLayer/config';
import { IAnswerStatistic } from './type';

export async function getAnswerStatistic(answer_id: number) {
  return axiosClient
    .get<IAnswerStatistic>(
      `/page/edit-answer-by-id/answer-statistics/${answer_id}`,
    )
    .then(res => res.data);
}
