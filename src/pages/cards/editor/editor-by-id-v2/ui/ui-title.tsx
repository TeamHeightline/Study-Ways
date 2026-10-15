import React from 'react';
import { TextField } from '@mui/material';
import { useCardEditor } from '../model/use-card-editor';
export const UiTitle = () => {
  const editor = useCardEditor();
  return (
    <TextField
      label="Название карточки"
      placeholder="Дайте материалу понятное название"
      fullWidth
      multiline
      minRows={1}
      maxRows={4}
      value={
        (editor.draft.title ?? '') === 'Название карточки по умолчанию'
          ? ''
          : (editor.draft.title ?? '')
      }
      onChange={editor.changeField('title')}
    />
  );
};
