import React from 'react';
import { observer } from 'mobx-react';
import { Button, CircularProgress } from '@mui/material';
import DoneRoundedIcon from '@mui/icons-material/DoneRounded';
import ErrorOutlineRoundedIcon from '@mui/icons-material/ErrorOutlineRounded';
import {
  QuestionEditorStorage,
  variantsOfStateOfSave,
} from '../Store/QuestionEditorStorage';

export const SavingNotification = observer(() => {
  const state = QuestionEditorStorage.stateOfSave;
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
        <Button
          size="small"
          onClick={() => QuestionEditorStorage.saveDataOnServer()}
        >
          Повторить
        </Button>
      )}
    </div>
  );
});
