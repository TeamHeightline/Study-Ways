import React, { useEffect, useState } from 'react';
import { ToggleButton, ToggleButtonGroup } from '@mui/material';
import { useCardEditor } from '../model/use-card-editor';
import { UiYoutube } from './ui-youtube';
import { UiVkVideo } from './ui-vk-video';
import { UiRutube } from './ui-rutube';
import { parseRutubeUrl } from '../../../../../Shared/Video/rutube';
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
      <ToggleButtonGroup
        value={hosting}
        exclusive
        size="small"
        aria-label="Видеоплатформа"
        onChange={(_, value) => {
          if (value) setHosting(value);
        }}
      >
        <ToggleButton value="Youtube">YouTube</ToggleButton>
        <ToggleButton value="VK">VK Видео</ToggleButton>
        <ToggleButton value="Rutube">Rutube</ToggleButton>
      </ToggleButtonGroup>
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
