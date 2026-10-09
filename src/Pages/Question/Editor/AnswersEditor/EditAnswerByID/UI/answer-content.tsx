import React from 'react';
import { observer } from 'mobx-react';
import { Collapse, PaperProps, Typography } from '@mui/material';
import { EditAnswerByIdStore } from '../Store/edit-answer-by-id-store';
import AnswerText from './answer-text';
import AnswerHelpTextV1 from './answer-help-text-v1';
import AnswerHelpTextV2 from './answer-help-text-v2';
import AnswerHelpTextV3 from './answer-help-text-v3';
import AnswerImage from './answer-image';
import AnswerHardLevel from './answer-hard-level';
import AnswerIsTrue from './answer-is-true';
import AnswerIsRequired from './answer-is-required';
import AnswerOnlyInExam from './answer-only-in-exam';

interface AnswerContentProps extends PaperProps {
  answer_object: EditAnswerByIdStore;
}
const AnswerContent = observer(
  ({ answer_object: store }: AnswerContentProps) => (
    <Collapse
      in={store.isOpenForEdit}
      unmountOnExit
      id={`qedit-answer-settings-${store.answer_id}`}
    >
      <div className="sw-qedit-answer-form">
        <section className="sw-qedit-answer-main">
          <Typography component="h4">Ответ и материалы</Typography>
          <div className="sw-qedit-fields">
            <AnswerText answer_object={store} />
            <AnswerImage answer_object={store} />
          </div>
          <Typography component="h4" className="sw-qedit-subsection-heading">
            Параметры ответа
          </Typography>
          <div className="sw-qedit-answer-options">
            <AnswerIsTrue answer_object={store} />
            <AnswerHardLevel answer_object={store} />
          </div>
          <div className="sw-qedit-answer-checkboxes">
            <AnswerIsRequired answer_object={store} />
            <AnswerOnlyInExam answer_object={store} />
          </div>
        </section>
        <section className="sw-qedit-answer-hints">
          <Typography component="h4">Подсказки по сложности</Typography>
          <Typography component="p">
            Ученик увидит подсказку для выбранного режима прохождения вопроса.
          </Typography>
          <div className="sw-qedit-hint-field">
            <span>Лёгкий уровень</span>
            <AnswerHelpTextV1 answer_object={store} />
          </div>
          <div className="sw-qedit-hint-field">
            <span>Средний уровень</span>
            <AnswerHelpTextV2 answer_object={store} />
          </div>
          <div className="sw-qedit-hint-field">
            <span>Высокий уровень</span>
            <AnswerHelpTextV3 answer_object={store} />
          </div>
        </section>
      </div>
    </Collapse>
  ),
);
export default AnswerContent;
