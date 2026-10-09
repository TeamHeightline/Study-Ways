import React from 'react';
import { observer } from 'mobx-react';
import { MenuItem, TextField } from '@mui/material';
import { CESObject } from '../Store/CardEditorStorage';
export const HardLevel = observer(() => (
  <TextField
    select
    fullWidth
    size="small"
    label="Уровень сложности"
    value={CESObject.getField('hard_level', 2)}
    onChange={CESObject.changeField('hard_level')}
  >
    <MenuItem value={0}>Выпускникам школ</MenuItem>
    <MenuItem value={1}>Успешным лицеистам и гимназистам</MenuItem>
    <MenuItem value={2}>Рядовым студентам</MenuItem>
    <MenuItem value={3}>Будущим специалистам</MenuItem>
    <MenuItem value={4}>Специалистам (Real Science)</MenuItem>
  </TextField>
));
