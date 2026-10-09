import React from 'react';
import { observer } from 'mobx-react';
import { ButtonBase, PaperProps } from '@mui/material';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import { EditAnswerByIdStore } from '../Store/edit-answer-by-id-store';
import AnswerText from './answer-text';

interface TitleEditableTextProps extends PaperProps {
  answer_object: EditAnswerByIdStore;
}
const TitleEditableText = observer(
  ({ answer_object: store }: TitleEditableTextProps) =>
    store.isEditTextInSimpleMode ? (
      <AnswerText answer_object={store} />
    ) : (
      <ButtonBase
        onClick={store.edittextInSimpleMode}
        className="sw-qedit-answer-quick-text"
        aria-label={`Редактировать текст ответа №${store.answer_id}`}
      >
        <span>{store.answer_object?.text || 'Добавьте текст ответа'}</span>
        <EditOutlinedIcon />
      </ButtonBase>
    ),
);
export default TitleEditableText;
