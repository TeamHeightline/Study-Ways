import React from 'react';
import { TextField } from '@mui/material';
import PlayCircleOutlineRoundedIcon from '@mui/icons-material/PlayCircleOutlineRounded';
import { useCardEditor } from '../model/use-card-editor';
import { parseRutubeUrl } from '../../../../../shared/video/rutube';
import RutubePlayer from '../../../../../shared/video/RutubePlayer';

export const UiRutube = () => {
  const editor = useCardEditor();
  const value = editor.draft.video_url ?? '';
  const valid = parseRutubeUrl(value);
  return (
    <div className="sw-cedit-video-fields">
      <TextField
        fullWidth
        label="Ссылка на видео Rutube"
        placeholder="https://rutube.ru/video/…/"
        value={value}
        onChange={editor.changeField('video_url')}
        error={!!value && !valid}
        helperText={
          value && !valid
            ? 'Укажите ссылку на видео, Shorts или встроенный плеер Rutube.'
            : undefined
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
};
