import axiosClient from '../../../../../shared/server-layer/query-layer/config';

export const ITEM_HEIGHT = 48;
export const ITEM_PADDING_TOP = 8;

export const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 7.5 + ITEM_PADDING_TOP,
      // width: "250vw",
    },
  },
};

export interface IQuestionStatistic {
  question_id: number;
  exam_avg: number | null;
  training_avg: number | null;
}

export async function getQuestionStatistic(question_id: number) {
  return axiosClient
    .get<IQuestionStatistic>(
      `/page/edit-question-by-id/question-statistic/${question_id}`,
    )
    .then(res => res.data);
}
