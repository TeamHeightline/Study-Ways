import React from 'react';
import { CircularProgress, PaperProps } from '@mui/material';
import DoneRoundedIcon from '@mui/icons-material/DoneRounded';
import type { AnswerEditorController } from '../model/use-answer-editor';

interface TitleIsSavedProps extends PaperProps {
  answer_object: AnswerEditorController;
}
const TitleIsSaved = ({ answer_object: store }: TitleIsSavedProps) => (
  <span className="sw-qedit-answer-save" role="status">
    {store.hasSaveError ? (
      'Ошибка сохранения'
    ) : store.stateOfSave ? (
      <>
        <DoneRoundedIcon />
        Сохранено
      </>
    ) : (
      <>
        <CircularProgress size={11} />
        Сохраняем…
      </>
    )}
    {store.hasSaveError && (
      <button type="button" onClick={() => store.updateAnswerData()}>
        Повторить
      </button>
    )}
  </span>
);
export default TitleIsSaved;
