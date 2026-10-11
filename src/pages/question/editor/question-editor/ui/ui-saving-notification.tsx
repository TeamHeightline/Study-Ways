import React from 'react';
import { Button, CircularProgress } from '@mui/material';
import DoneRoundedIcon from '@mui/icons-material/DoneRounded';
import ErrorOutlineRoundedIcon from '@mui/icons-material/ErrorOutlineRounded';
import { variantsOfStateOfSave } from '../store/QuestionEditorStorage';
import { useQuestionEditor } from '../store/use-question-editor';
export const SavingNotification = () => {
  const editor = useQuestionEditor();
  const state = editor.stateOfSave;
  return (
    <div
      className={`sw-qedit-save-state ${state === variantsOfStateOfSave.ERROR ? 'has-error' : ''}`}
      role="status"
    >
      {state === variantsOfStateOfSave.SAVING ? (
        <CircularProgress size={14} />
      ) : state === variantsOfStateOfSave.ERROR ? (
        <ErrorOutlineRoundedIcon />
      ) : (
        <DoneRoundedIcon />
      )}
      <span>
        {state === variantsOfStateOfSave.SAVED
          ? 'Все изменения сохранены'
          : state === variantsOfStateOfSave.SAVING
            ? 'Сохраняем изменения…'
            : 'Ошибка сохранения'}
      </span>
      {state === variantsOfStateOfSave.ERROR && (
        <Button size="small" onClick={() => editor.saveDataOnServer()}>
          Повторить
        </Button>
      )}
    </div>
  );
};
