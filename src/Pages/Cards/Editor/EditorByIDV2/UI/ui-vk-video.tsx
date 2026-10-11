import React from 'react';
import { TextField } from '@mui/material';
import PlayCircleOutlineRoundedIcon from '@mui/icons-material/PlayCircleOutlineRounded';
import { useCardEditor } from '../model/use-card-editor';
function getIframeURL(value: string) {
  const match = value.match(/(?:vkvideo\.ru|vk\.com)\/video(-?\d+)_(\d+)/);
  return match
    ? `https://vk.com/video_ext.php?oid=${match[1]}&id=${match[2]}&hd=2`
    : '';
}
export const UiVkVideo = () => {
  const editor = useCardEditor();
  const value = editor.draft.vk_video_url ?? '';
  const iframeUrl = getIframeURL(value);
  return (
    <div className="sw-cedit-video-fields">
      <TextField
        fullWidth
        label="Ссылка на VK Видео"
        placeholder="https://vkvideo.ru/video…"
        value={value}
        onChange={editor.changeField('vk_video_url')}
        error={!!value && !iframeUrl}
        helperText={
          value && !iframeUrl
            ? 'Используйте ссылку вида https://vkvideo.ru/video4604580_456240803'
            : undefined
        }
      />
      <div className="sw-cedit-video-preview">
        {iframeUrl ? (
          <iframe
            title="Предпросмотр VK Видео"
            src={iframeUrl}
            allow="autoplay; encrypted-media; fullscreen; picture-in-picture"
            allowFullScreen
          />
        ) : (
          <div className="sw-cedit-video-empty">
            <PlayCircleOutlineRoundedIcon />
            <span>Предпросмотр VK Видео</span>
            <p>Добавьте ссылку на видео.</p>
          </div>
        )}
      </div>
    </div>
  );
};
