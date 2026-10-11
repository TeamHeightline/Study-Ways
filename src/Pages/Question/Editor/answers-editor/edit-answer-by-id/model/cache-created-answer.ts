import type { AppDispatch } from '../../../../../../App/ReduxStore/RootStore';
import type { WrittenAnswer } from '../../../../../../Shared/ServerLayer/QueryLayer/write-api';
import { writtenAnswerData } from '../../../../../../Shared/ServerLayer/QueryLayer/answer-write-data';
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
