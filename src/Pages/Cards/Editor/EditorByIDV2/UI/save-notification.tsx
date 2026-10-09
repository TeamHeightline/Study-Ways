import React from 'react';
import { observer } from 'mobx-react';
import { Button, CircularProgress } from '@mui/material';
import CheckRoundedIcon from '@mui/icons-material/CheckRounded';
import ErrorOutlineRoundedIcon from '@mui/icons-material/ErrorOutlineRounded';
import { CESObject } from '../Store/CardEditorStorage';
export const SaveNotification = observer(() => (
  <div
    role="status"
    aria-live="polite"
    className={`sw-cedit-save-state${CESObject.hasSaveError ? ' has-error' : ''}`}
  >
    {CESObject.hasSaveError ? (
      <ErrorOutlineRoundedIcon />
    ) : CESObject.stateOfSave ? (
      <CheckRoundedIcon />
    ) : (
      <CircularProgress size={13} color="inherit" />
    )}
    <span>
      {CESObject.hasSaveError
        ? 'Не удалось сохранить'
        : CESObject.stateOfSave
          ? 'Все изменения сохранены'
          : 'Сохранение изменений…'}
    </span>
    {CESObject.hasSaveError && (
      <Button onClick={() => CESObject.saveDataOnServer()}>Повторить</Button>
    )}
  </div>
));
