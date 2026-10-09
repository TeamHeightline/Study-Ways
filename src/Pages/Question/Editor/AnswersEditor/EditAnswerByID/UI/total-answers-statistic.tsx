import React from 'react';
import { observer } from 'mobx-react';
import { Alert, PaperProps } from '@mui/material';
import { QuestionEditorStorage } from '../../../QuestionEditor/Store/QuestionEditorStorage';

const TotalAnswersStatistic = observer((props: PaperProps) => (
  <div className="sw-qedit-answer-summary">
    <div>
      <span>
        Всего вариантов
        <strong>{QuestionEditorStorage.NumberOfAllAnswers}</strong>
      </span>
      <span>
        Обязательных
        <strong>{QuestionEditorStorage.NumberOfRequiredAnswers}</strong>
      </span>
      <span>
        В подготовке
        <strong>{QuestionEditorStorage.NumberOfAnswersInTrainingMode}</strong>
      </span>
    </div>
    {QuestionEditorStorage.ErrorRequiredAnswerSoMuch && (
      <Alert severity="warning">
        Обязательных вариантов не меньше, чем показываемых ответов. Увеличьте
        размер набора, чтобы в него попадали и необязательные варианты.
      </Alert>
    )}
  </div>
));
export default TotalAnswersStatistic;
