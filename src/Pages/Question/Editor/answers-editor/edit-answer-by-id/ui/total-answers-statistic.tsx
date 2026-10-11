import React from 'react';
import { Alert } from '@mui/material';
import type { EditorAnswer } from '../../../../question-read-api';

export default function TotalAnswersStatistic({
  answers,
  numberOfShowingAnswers,
}: {
  answers: EditorAnswer[];
  numberOfShowingAnswers: number;
}) {
  const required = answers.filter(answer => answer.isRequired).length;
  return (
    <div className="sw-qedit-answer-summary">
      <div>
        <span>
          Всего вариантов<strong>{answers.length}</strong>
        </span>
        <span>
          Обязательных<strong>{required}</strong>
        </span>
        <span>
          В подготовке
          <strong>
            {answers.filter(answer => !answer.onlyForExam).length}
          </strong>
        </span>
      </div>
      {required > 0 && required >= numberOfShowingAnswers && (
        <Alert severity="warning">
          Обязательных вариантов не меньше, чем показываемых ответов. Увеличьте
          размер набора, чтобы в него попадали и необязательные варианты.
        </Alert>
      )}
    </div>
  );
}
