import React from 'react';
import { Button, PaperProps } from '@mui/material';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import type { AnswerEditorController } from '../model/use-answer-editor';

interface AnswerPreviewSwitchProps extends PaperProps {
  answer_object: AnswerEditorController;
}
const AnswerPreviewSwitch = ({
  answer_object: store,
}: AnswerPreviewSwitchProps) => (
  <Button
    startIcon={<VisibilityOutlinedIcon />}
    aria-expanded={store.isShowAnswerPreview}
    onClick={() => {
      store.toggleAnswerPreview();
    }}
    className="sw-qedit-answer-preview-toggle"
  >
    {store.isShowAnswerPreview ? 'Скрыть предпросмотр' : 'Предпросмотр'}
  </Button>
);
export default AnswerPreviewSwitch;
