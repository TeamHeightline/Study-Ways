import React from 'react';
import { MenuItem, TextField } from '@mui/material';
import PlayCircleOutlineRoundedIcon from '@mui/icons-material/PlayCircleOutlineRounded';
import LinkRoundedIcon from '@mui/icons-material/LinkRounded';
import ImageOutlinedIcon from '@mui/icons-material/ImageOutlined';
import { useCardEditor } from '../model/use-card-editor';

const types = [
  { label: 'Видео', Icon: PlayCircleOutlineRoundedIcon },
  { label: 'Внешний ресурс', Icon: LinkRoundedIcon },
  { label: 'Изображение', Icon: ImageOutlinedIcon },
];

export const UiCMenu = () => {
  const editor = useCardEditor();
  return (
    <TextField
      select
      fullWidth
      size="small"
      className="sw-cedit-content-type"
      label="Тип материала"
      value={editor.draft.card_content_type ?? 0}
      onChange={editor.changeField('card_content_type')}
    >
      {types.map(({ label, Icon }, value) => (
        <MenuItem key={value} value={value}>
          <span className="sw-cedit-select-option">
            <Icon fontSize="small" />
            {label}
          </span>
        </MenuItem>
      ))}
    </TextField>
  );
};
