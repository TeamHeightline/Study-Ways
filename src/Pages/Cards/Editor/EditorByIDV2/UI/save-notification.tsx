import React from 'react';
import { Button, CircularProgress } from '@mui/material';
import CheckRoundedIcon from '@mui/icons-material/CheckRounded';
import ErrorOutlineRoundedIcon from '@mui/icons-material/ErrorOutlineRounded';
import { useCardEditor } from '../model/use-card-editor';
export const SaveNotification = () => {
  const editor = useCardEditor();
  return (
    <div
      role="status"
      aria-live="polite"
      className={`sw-cedit-save-state${editor.saveState === 'error' ? ' has-error' : ''}`}
    >
      {editor.saveState === 'error' ? (
        <ErrorOutlineRoundedIcon />
      ) : editor.isSaved ? (
        <CheckRoundedIcon />
      ) : (
        <CircularProgress size={13} color="inherit" />
      )}
      <span>
        {editor.saveState === 'error'
          ? 'Не удалось сохранить'
          : editor.isSaved
            ? 'Все изменения сохранены'
            : 'Сохранение изменений…'}
      </span>
      {editor.saveState === 'error' && (
        <Button onClick={() => editor.saveNow()}>Повторить</Button>
      )}
    </div>
  );
};
