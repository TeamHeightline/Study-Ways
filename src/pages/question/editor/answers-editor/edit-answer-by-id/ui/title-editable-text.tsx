import React from 'react';
import { ButtonBase, PaperProps } from '@mui/material';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import type { AnswerEditorController } from '../model/use-answer-editor';
import AnswerText from './answer-text';

interface TitleEditableTextProps extends PaperProps {
  answer_object: AnswerEditorController;
}
const TitleEditableText = ({ answer_object: store }: TitleEditableTextProps) =>
  store.isEditTextInSimpleMode ? (
    <AnswerText answer_object={store} />
  ) : (
    <ButtonBase
      onClick={store.edittextInSimpleMode}
      className="sw-qedit-answer-quick-text"
      aria-label={`Редактировать текст ответа №${store.answer_id}`}
    >
      <span>{store.draft.text || 'Добавьте текст ответа'}</span>
      <EditOutlinedIcon />
    </ButtonBase>
  );
export default TitleEditableText;
