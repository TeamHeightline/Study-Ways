import React from 'react';
import { observer } from 'mobx-react';
import { ToggleButton, ToggleButtonGroup } from '@mui/material';
import PlayCircleOutlineRoundedIcon from '@mui/icons-material/PlayCircleOutlineRounded';
import LinkRoundedIcon from '@mui/icons-material/LinkRounded';
import ImageOutlinedIcon from '@mui/icons-material/ImageOutlined';
import { CESObject } from '../Store/CardEditorStorage';
export const UiCMenu = observer(() => (
  <div className="sw-cedit-content-type">
    <span>Тип материала</span>
    <ToggleButtonGroup
      exclusive
      value={CESObject.getField('card_content_type', 0)}
      aria-label="Тип материала"
      onChange={(_, value) => {
        if (value !== null)
          CESObject.changeFieldByValue('card_content_type', value);
      }}
    >
      <ToggleButton value={0}>
        <PlayCircleOutlineRoundedIcon />
        Видео
      </ToggleButton>
      <ToggleButton value={1}>
        <LinkRoundedIcon />
        Внешний ресурс
      </ToggleButton>
      <ToggleButton value={2}>
        <ImageOutlinedIcon />
        Изображение
      </ToggleButton>
    </ToggleButtonGroup>
  </div>
));
