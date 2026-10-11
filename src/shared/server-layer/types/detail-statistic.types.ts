interface AnswerPointItem {
  answerPoints: number;
  numberOfPasses: number;
}

interface WrongAnswerItem {
  numberOfPasses: number;
  numberOfWrongAnswers: number[];
}

export interface IStatistic {
  numberOfPasses: number;
  ArrayForShowAnswerPoints: AnswerPointItem[];
  ArrayForShowWrongAnswers: WrongAnswerItem[];
}

export interface IDetailStatistic {
  id?: number;
  user_name: string;
  is_login: boolean;
  statistic: IStatistic;
  question_id: number;
  authorize_user_id?: number;
  is_useExamMode: boolean;
  question_sequence_id?: number;
  question_has_been_completed: boolean;
  max_sum_of_answers_point: number;
  created_at?: Date;
}
