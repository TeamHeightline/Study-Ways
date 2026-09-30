import { observer } from 'mobx-react';
import React, { useState } from 'react';
import { PaperProps } from '@mui/material/Paper/Paper';
import { Box, Paper, ToggleButton, ToggleButtonGroup } from '@mui/material';
import { CardByIDStore } from '../Store/CardByIDStore';
import ReactPlayer from 'react-player';
import { isMobileHook } from '../../../../Shared/CustomHooks/isMobileHook';
import GoToTestDialog from './go-to-test-dialog';
import YouTubeIcon from '@mui/icons-material/YouTube';
import { CESObject } from '../../Editor/EditorByIDV2/Store/CardEditorStorage';
import { YoutubeContent } from './youtube-content';
import { VkVideoContent } from './vk-video-content';

interface IYoutubeContentProps {
  card_store: CardByIDStore;
}

function getDefaultVideoMode(isHaveVKVideo, isHaveYoutubeVideo) {
  // будет расширено, когда появится рутуб
  return isHaveVKVideo ? 'VK' : 'Youtube';
}

const VideoContent = observer(({ card_store }: IYoutubeContentProps) => {
  const youtubeVideoURL = card_store?.card_data?.video_url || '';
  const isHaveYoutubeVideo = !!youtubeVideoURL;
  const VKVideoURL = card_store?.card_data?.vk_video_url || '';
  const isHaveVKVideo = !!VKVideoURL;

  const isMobile = isMobileHook();
  const [videoHosting, setVideoHosting] = useState<'VK' | 'Youtube' | 'Rutube'>(
    () => getDefaultVideoMode(isHaveVKVideo, isHaveYoutubeVideo),
  );

  const test_after_card_id = card_store.card_data?.test_in_card_id;

  return (
    <Box>
      <Box className="sw-material-video">
        <div className="sw-material-player">
          {videoHosting === 'VK' ? (
            <VkVideoContent videoURL={VKVideoURL} />
          ) : videoHosting === 'Youtube' ? (
            <YoutubeContent card_store={card_store} />
          ) : null}
        </div>
        <ToggleButtonGroup
          className="sw-material-hosts"
          aria-label="Видеоплатформа"
          size={isMobile ? 'small' : 'medium'}
          exclusive
          orientation={'horizontal'}
          onChange={(e, value) => {
            if (!value) {
              return;
            }
            setVideoHosting(value);
          }}
          value={videoHosting}
        >
          <ToggleButton value="VK" disabled={!isHaveVKVideo}>
            VK
          </ToggleButton>
          <ToggleButton value="Youtube" disabled={!isHaveYoutubeVideo}>
            <YouTubeIcon />
          </ToggleButton>
          <ToggleButton value="Rutube" disabled>
            RU
          </ToggleButton>
        </ToggleButtonGroup>
      </Box>
      {card_store.card_data?.is_card_use_test_in_card &&
        card_store.isOpenGoToTestDialogAfterVideo &&
        test_after_card_id && <GoToTestDialog card_store={card_store} />}
    </Box>
  );
});

export default VideoContent;
