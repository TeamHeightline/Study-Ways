import React from 'react';
import { observer } from 'mobx-react';
import { Typography } from '@mui/material';
import { QuestionEditorStorage } from '../../../QuestionEditor/Store/QuestionEditorStorage';
import { CreateNewAnswer } from '../../../QuestionEditor/UI/ui-create-new-answer';
import EditAnswerByID from './edit-answer-by-id';
import TotalAnswersStatistic from './total-answers-statistic';

export const AnswersEditor = observer(() => (
  <section className="sw-qedit-answers" aria-labelledby="qedit-answers-title">
    <header className="sw-qedit-answers-heading">
      <div>
        <Typography component="h2" id="qedit-answers-title">
          Варианты ответа
        </Typography>
        <Typography component="p">
          Отметьте верные варианты и добавьте подсказки для разных уровней
          сложности.
        </Typography>
      </div>
      <CreateNewAnswer />
    </header>
    <TotalAnswersStatistic />
    <div className="sw-qedit-answer-list">
      {QuestionEditorStorage.answersIDForUI.length === 0 ? (
        <div className="sw-qedit-empty">
          <Typography component="h3">Добавьте первый вариант ответа</Typography>
          <Typography component="p">
            В вопросе могут быть один или несколько верных вариантов.
          </Typography>
        </div>
      ) : (
        QuestionEditorStorage.answersIDForUI.map((id, index) => (
          <EditAnswerByID
            key={id}
            answer_id={Number(id)}
            answer_index={index}
          />
        ))
      )}
    </div>
  </section>
));
