import React from 'react';
import { observer } from 'mobx-react';
import ReactPlayer from 'react-player';
import { TextField } from '@mui/material';
import PlayCircleOutlineRoundedIcon from '@mui/icons-material/PlayCircleOutlineRounded';
import urlParser from 'js-video-url-parser';
import 'js-video-url-parser/lib/provider/youtube';
import { CESObject } from '../Store/CardEditorStorage';
export const UiYoutube = observer(() => {
  const value = CESObject.getField('video_url', '');
  const invalid = !!value && urlParser.parse(value)?.provider !== 'youtube';
  return (
    <div className="sw-cedit-video-fields">
      <TextField
        fullWidth
        label="Ссылка на видео YouTube"
        placeholder="https://www.youtube.com/watch?v=…"
        value={value}
        onChange={CESObject.changeField('video_url')}
        error={invalid}
        helperText={invalid ? 'Укажите ссылку на видео YouTube.' : undefined}
      />
      <div className="sw-cedit-video-preview">
        {value && !invalid ? (
          <ReactPlayer controls url={value} width="100%" height="100%" />
        ) : (
          <div className="sw-cedit-video-empty">
            <PlayCircleOutlineRoundedIcon />
            <span>Предпросмотр видео</span>
            <p>Добавьте ссылку, чтобы проверить материал.</p>
          </div>
        )}
      </div>
    </div>
  );
});
