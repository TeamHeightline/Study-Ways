import React, { useState } from 'react';
import { observer } from 'mobx-react';
import { ToggleButton, ToggleButtonGroup } from '@mui/material';
import { CESObject } from '../Store/CardEditorStorage';
import { UiYoutube } from './ui-youtube';
import { UiVkVideo } from './ui-vk-video';
export const UiVideo = observer(() => {
  const [hosting, setHosting] = useState<'VK' | 'Youtube'>(() =>
    CESObject.getField('vk_video_url', '') ? 'VK' : 'Youtube',
  );
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
        <ToggleButton value="Rutube" disabled>
          Rutube · скоро
        </ToggleButton>
      </ToggleButtonGroup>
      {hosting === 'VK' ? <UiVkVideo /> : <UiYoutube />}
    </div>
  );
});
