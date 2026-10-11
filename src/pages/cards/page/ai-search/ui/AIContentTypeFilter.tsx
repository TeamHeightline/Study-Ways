import React from 'react';
import { FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import { useAISearch } from '../store/AISearch';
import DoneAllIcon from '@mui/icons-material/DoneAll';
import VideoLibraryOutlinedIcon from '@mui/icons-material/YouTube';
import HttpIcon from '@mui/icons-material/Http';
import ImageIcon from '@mui/icons-material/Image';
type IContentTypeProps = React.HTMLAttributes<HTMLDivElement>;
export const ContentType = ({ ...props }: IContentTypeProps) => {
  const search = useAISearch();
  return (
    <FormControl fullWidth size={'small'}>
      <InputLabel>Тип карточки:</InputLabel>
      <Select
        fullWidth
        style={{ width: '100%', maxWidth: 600 }}
        label="Тип карточки:"
        value={search.contentType}
        onChange={search.changeContentType}
      >
        <MenuItem value={'undefined'}>
          <DoneAllIcon style={{ marginRight: 12 }} fontSize="small" />
          Все типы
        </MenuItem>
        <MenuItem value={'0'}>
          <VideoLibraryOutlinedIcon
            style={{ marginRight: 12 }}
            fontSize="small"
          />
          Видео
        </MenuItem>
        <MenuItem value={'1'}>
          <HttpIcon style={{ marginRight: 12 }} fontSize="small" />
          Внешний ресурс
        </MenuItem>
        <MenuItem value={'2'}>
          <ImageIcon style={{ marginRight: 12 }} fontSize="small" />
          Изображение
        </MenuItem>
      </Select>
    </FormControl>
  );
};
