import React from 'react';
import { observer } from 'mobx-react';
import { ClickAwayListener, PaperProps, Typography } from '@mui/material';
import { EditAnswerByIdStore } from '../Store/edit-answer-by-id-store';
import TitleOnlyInExam from './title-only-in-exam';
import TitleIsRequired from './title-is-required';
import TitleEditableText from './title-editable-text';
import TitleIsTrue from './title-is-true';
import TitleHardLevel from './title-hard-level';
import TitleIsSaved from './title-is-saved';
import TitleSimpleActions from './title-simple-actions';
import AnswerStatistic from './answer-statistic';

interface AnswerTitleProps extends PaperProps {
  answer_object: EditAnswerByIdStore;
  answer_index?: number;
}
const AnswerTitle = observer(
  ({ answer_object: store, answer_index }: AnswerTitleProps) => (
    <header className="sw-qedit-answer-heading">
      <div className="sw-qedit-answer-topline">
        <div>
          <Typography component="h3">
            Ответ {(answer_index ?? 0) + 1}
          </Typography>
          <span className="sw-qedit-answer-id">№{store.answer_id}</span>
          <TitleIsSaved answer_object={store} />
        </div>
        <TitleSimpleActions answer_object={store} />
      </div>
      <div className="sw-qedit-answer-tags">
        <TitleIsTrue answer_object={store} />
        <TitleHardLevel answer_object={store} />
        <TitleIsRequired answer_object={store} />
        <TitleOnlyInExam answer_object={store} />
        <AnswerStatistic answer_id={Number(store.answer_id)} />
      </div>
      {!store.isOpenForEdit && (
        <ClickAwayListener onClickAway={store.stopTextEditingInSimpleMode}>
          <div className="sw-qedit-quick-edit">
            <TitleEditableText answer_object={store} />
          </div>
        </ClickAwayListener>
      )}
    </header>
  ),
);
export default AnswerTitle;
