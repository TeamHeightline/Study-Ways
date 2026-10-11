import type { AppDispatch } from '../../../../../../app/redux-store/RootStore';
import type { WrittenAnswer } from '../../../../../../shared/server-layer/query-layer/write-api';
import { writtenAnswerData } from '../../../../../../shared/server-layer/query-layer/answer-write-data';
import { questionReadApi } from '../../../../question-read-api';

export function cacheCreatedAnswer(
  dispatch: AppDispatch,
  userId: number,
  answer: WrittenAnswer,
) {
  dispatch(
    questionReadApi.util.updateQueryData(
      'getQuestionEditorData',
      {
        id: answer.question_id,
        userId,
      },
      question => {
        if (
          !question ||
          question.answers.some(item => Number(item.id) === answer.id)
        )
          return;
        const data = writtenAnswerData(answer);
        data.question.createdById = question.createdById;
        question.answers.push(data);
      },
    ),
  );
}

export function cacheSavedAnswer(
  dispatch: AppDispatch,
  userId: number,
  answer: WrittenAnswer,
) {
  const fields = writtenAnswerData(answer);
  const merge = (current: typeof fields) => {
    Object.assign(current, fields, {
      image: current.image,
      question: current.question,
    });
  };
  dispatch(
    questionReadApi.util.updateQueryData(
      'getEditorAnswer',
      { id: answer.id, userId },
      current => {
        if (current) merge(current);
      },
    ),
  );
  dispatch(
    questionReadApi.util.updateQueryData(
      'getQuestionEditorData',
      { id: answer.question_id, userId },
      current => {
        const existing = current?.answers.find(
          item => Number(item.id) === answer.id,
        );
        if (existing) merge(existing);
      },
    ),
  );
}
