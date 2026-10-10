import React from 'react';
import { observer } from 'mobx-react';
import { TextField } from '@mui/material';
import PlayCircleOutlineRoundedIcon from '@mui/icons-material/PlayCircleOutlineRounded';
import { CESObject } from '../Store/CardEditorStorage';
import { parseRutubeUrl } from '../../../../../Shared/Video/rutube';
import RutubePlayer from '../../../../../Shared/Video/RutubePlayer';

export const UiRutube = observer(() => {
  const value = CESObject.getField('video_url', '');
  const valid = parseRutubeUrl(value);
  return (
    <div className="sw-cedit-video-fields">
      <TextField
        fullWidth
        label="Ссылка на видео Rutube"
        placeholder="https://rutube.ru/video/…/"
        value={value}
        onChange={CESObject.changeField('video_url')}
        error={!!value && !valid}
        helperText={
          value && !valid
            ? 'Укажите ссылку на видео, Shorts или встроенный плеер Rutube.'
            : 'Основная видеоссылка: YouTube или Rutube. Новая ссылка заменит текущую.'
        }
      />
      <div className="sw-cedit-video-preview">
        {valid ? (
          <RutubePlayer url={value} />
        ) : (
          <div className="sw-cedit-video-empty">
            <PlayCircleOutlineRoundedIcon />
            <span>Предпросмотр Rutube</span>
            <p>Добавьте ссылку, чтобы проверить материал.</p>
          </div>
        )}
      </div>
    </div>
  );
});
