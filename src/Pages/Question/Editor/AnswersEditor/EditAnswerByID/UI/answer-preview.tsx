import React from 'react';
import { observer } from 'mobx-react';
import { Collapse, PaperProps } from '@mui/material';
import { EditAnswerByIdStore } from '../Store/edit-answer-by-id-store';

interface AnswerPreviewProps extends PaperProps {
  answer_object: EditAnswerByIdStore;
}
const AnswerPreview = observer(
  ({ answer_object: store }: AnswerPreviewProps) => (
    <Collapse in={store.isShowAnswerPreview} unmountOnExit>
      <div className="sw-qedit-answer-preview">
        <span>Так выглядит вариант ответа</span>
        {store.imageUrl && !store.answer_object?.isImageDeleted && (
          <img src={store.imageUrl} alt="Изображение к ответу" />
        )}
        <p>{store.answer_object?.text || 'Текст ответа не добавлен.'}</p>
      </div>
    </Collapse>
  ),
);
export default AnswerPreview;
