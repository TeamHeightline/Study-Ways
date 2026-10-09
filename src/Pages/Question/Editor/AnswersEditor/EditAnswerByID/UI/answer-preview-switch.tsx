import React from 'react';
import { observer } from 'mobx-react';
import { Button, PaperProps } from '@mui/material';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import { EditAnswerByIdStore } from '../Store/edit-answer-by-id-store';

interface AnswerPreviewSwitchProps extends PaperProps {
  answer_object: EditAnswerByIdStore;
}
const AnswerPreviewSwitch = observer(
  ({ answer_object: store }: AnswerPreviewSwitchProps) => (
    <Button
      startIcon={<VisibilityOutlinedIcon />}
      aria-expanded={store.isShowAnswerPreview}
      onClick={() => {
        store.isShowAnswerPreview = !store.isShowAnswerPreview;
      }}
      className="sw-qedit-answer-preview-toggle"
    >
      {store.isShowAnswerPreview ? 'Скрыть предпросмотр' : 'Предпросмотр'}
    </Button>
  ),
);
export default AnswerPreviewSwitch;
