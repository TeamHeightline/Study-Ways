import React, { useEffect, useState } from 'react';
import { observer } from 'mobx-react';
import { ToggleButton, ToggleButtonGroup } from '@mui/material';
import { CESObject } from '../Store/CardEditorStorage';
import { UiYoutube } from './ui-youtube';
import { UiVkVideo } from './ui-vk-video';
import { UiRutube } from './ui-rutube';
import { parseRutubeUrl } from '../../../../../Shared/Video/rutube';
export const UiVideo = observer(() => {
  const defaultHosting = () =>
    CESObject.getField('vk_video_url', '')
      ? 'VK'
      : parseRutubeUrl(CESObject.getField('video_url', ''))
        ? 'Rutube'
        : 'Youtube';
  const cardID = CESObject.getField('id', '');
  const [hosting, setHosting] = useState<'VK' | 'Youtube' | 'Rutube'>(
    defaultHosting,
  );
  useEffect(() => setHosting(defaultHosting()), [cardID]);
  return (
    <div className="sw-cedit-video" key={CESObject.getField('id', '')}>
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
});
