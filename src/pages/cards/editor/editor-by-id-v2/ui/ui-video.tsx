import React, { useEffect, useState } from 'react';
import { MenuItem, TextField } from '@mui/material';
import { UiCMenu } from './ui-c-menu';
import { useCardEditor } from '../model/use-card-editor';
import { UiYoutube } from './ui-youtube';
import { UiVkVideo } from './ui-vk-video';
import { UiRutube } from './ui-rutube';
import { parseRutubeUrl } from '../../../../../shared/video/rutube';
export const UiVideo = () => {
  const editor = useCardEditor();
  const defaultHosting = () =>
    (editor.draft.vk_video_url ?? '')
      ? 'VK'
      : parseRutubeUrl(editor.draft.video_url ?? '')
        ? 'Rutube'
        : 'Youtube';
  const cardID = editor.draft.id ?? '';
  const [hosting, setHosting] = useState<'VK' | 'Youtube' | 'Rutube'>(
    defaultHosting,
  );
  useEffect(() => setHosting(defaultHosting()), [cardID]);
  return (
    <div className="sw-cedit-video" key={editor.draft.id ?? ''}>
      <div className="sw-cedit-material-controls">
        <UiCMenu />
        <TextField
          select
          fullWidth
          size="small"
          label="Видеоплатформа"
          value={hosting}
          onChange={event => setHosting(event.target.value as typeof hosting)}
        >
          <MenuItem value="Youtube">YouTube</MenuItem>
          <MenuItem value="VK">VK Видео</MenuItem>
          <MenuItem value="Rutube">Rutube</MenuItem>
        </TextField>
      </div>
      {hosting === 'VK' ? (
        <UiVkVideo />
      ) : hosting === 'Rutube' ? (
        <UiRutube />
      ) : (
        <UiYoutube />
      )}
    </div>
  );
};
