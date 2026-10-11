import React from 'react';
import { Collapse, PaperProps } from '@mui/material';
import type { AnswerEditorController } from '../model/use-answer-editor';

interface AnswerPreviewProps extends PaperProps {
  answer_object: AnswerEditorController;
}
const AnswerPreview = ({ answer_object: store }: AnswerPreviewProps) => (
  <Collapse in={store.isShowAnswerPreview} unmountOnExit>
    <div className="sw-qedit-answer-preview">
      <span>Так выглядит вариант ответа</span>
      {store.imageUrl && !store.draft.isImageDeleted && (
        <img src={store.imageUrl} alt="Изображение к ответу" />
      )}
      <p>{store.draft.text || 'Текст ответа не добавлен.'}</p>
    </div>
  </Collapse>
);
export default AnswerPreview;
