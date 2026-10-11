import React from 'react';
import { FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import { useCardSelector } from '../store/CardSelectorStore';
import DoneAllIcon from '@mui/icons-material/DoneAll';
import VideoLibraryOutlinedIcon from '@mui/icons-material/YouTube';
import HttpIcon from '@mui/icons-material/Http';
import ImageIcon from '@mui/icons-material/Image';
type IContentTypeProps = React.HTMLAttributes<HTMLDivElement>;
export const ContentType = ({ ...props }: IContentTypeProps) => {
  const selector = useCardSelector();
  return (
    <FormControl fullWidth>
      <InputLabel>Тип карточки:</InputLabel>
      <Select
        fullWidth
        style={{ width: '100%', maxWidth: 600 }}
        label="Тип карточки:"
        value={selector.contentType}
        onChange={selector.changeContentType}
      >
        <MenuItem value={'undefined'}>Не выбран</MenuItem>
        <MenuItem value={'A_0'}>
          <VideoLibraryOutlinedIcon
            style={{ marginRight: 12 }}
            fontSize="small"
          />
          Видео
        </MenuItem>
        <MenuItem value={'A_1'}>
          <HttpIcon style={{ marginRight: 12 }} fontSize="small" />
          Внешний ресурс
        </MenuItem>
        <MenuItem value={'A_2'}>
          <ImageIcon style={{ marginRight: 12 }} fontSize="small" />
          Изображение
        </MenuItem>
      </Select>
    </FormControl>
  );
};
