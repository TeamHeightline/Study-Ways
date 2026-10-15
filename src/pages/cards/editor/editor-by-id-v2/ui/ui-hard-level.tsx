import React from 'react';
import { MenuItem, TextField } from '@mui/material';
import ArchitectureIcon from '@mui/icons-material/Architecture';
import FunctionsIcon from '@mui/icons-material/Functions';
import SchoolIcon from '@mui/icons-material/School';
import ScienceIcon from '@mui/icons-material/Science';
import BiotechIcon from '@mui/icons-material/Biotech';
import { useCardEditor } from '../model/use-card-editor';

const levels = [
  { label: 'Выпускникам школ', Icon: ArchitectureIcon },
  { label: 'Успешным лицеистам и гимназистам', Icon: FunctionsIcon },
  { label: 'Рядовым студентам', Icon: SchoolIcon },
  { label: 'Будущим специалистам', Icon: ScienceIcon },
  { label: 'Специалистам (Real Science)', Icon: BiotechIcon },
];

function LevelLabel({ value }: { value: number }) {
  const level = levels[value];
  if (!level) return null;
  const { Icon, label } = level;
  return (
    <span className="sw-cedit-hard-level-option">
      <Icon fontSize="small" />
      {label}
    </span>
  );
}

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
      slotProps={{
        select: { renderValue: value => <LevelLabel value={Number(value)} /> },
      }}
    >
      {levels.map((level, value) => (
        <MenuItem key={value} value={value}>
          <LevelLabel value={value} />
        </MenuItem>
      ))}
    </TextField>
  );
};
