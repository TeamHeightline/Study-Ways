import React from 'react';
import { observer } from 'mobx-react';
import { TextField } from '@mui/material';
import { CESObject } from '../Store/CardEditorStorage';
export const UiTitle = observer(() => (
  <TextField
    label="Название карточки"
    placeholder="Дайте материалу понятное название"
    fullWidth
    multiline
    minRows={2}
    maxRows={4}
    value={
      CESObject.getField('title', '') === 'Название карточки по умолчанию'
        ? ''
        : CESObject.getField('title', '')
    }
    onChange={CESObject.changeField('title')}
  />
));
