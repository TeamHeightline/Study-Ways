import React from 'react';
import { MenuItem, TextField } from '@mui/material';
import { useCardEditor } from '../model/use-card-editor';
export const HardLevel = () => {
  const editor = useCardEditor();
  return (
    <TextField
      select
      fullWidth
      size="small"
      label="Уровень сложности"
      value={editor.draft.hard_level ?? 2}
      onChange={editor.changeField('hard_level')}
    >
      <MenuItem value={0}>Выпускникам школ</MenuItem>
      <MenuItem value={1}>Успешным лицеистам и гимназистам</MenuItem>
      <MenuItem value={2}>Рядовым студентам</MenuItem>
      <MenuItem value={3}>Будущим специалистам</MenuItem>
      <MenuItem value={4}>Специалистам (Real Science)</MenuItem>
    </TextField>
  );
};
