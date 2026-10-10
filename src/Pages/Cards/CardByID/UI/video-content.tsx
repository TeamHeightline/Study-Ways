import { observer } from 'mobx-react';
import React, { useEffect, useState } from 'react';
import { Box, ToggleButton, ToggleButtonGroup } from '@mui/material';
import { CardByIDStore } from '../Store/CardByIDStore';
import { isMobileHook } from '../../../../Shared/CustomHooks/isMobileHook';
import GoToTestDialog from './go-to-test-dialog';
import { YoutubeContent } from './youtube-content';
import { VkVideoContent } from './vk-video-content';
import { parseRutubeUrl } from '../../../../Shared/Video/rutube';
import RutubePlayer from '../../../../Shared/Video/RutubePlayer';

const VideoContent = observer(
  ({ card_store }: { card_store: CardByIDStore }) => {
    const url = card_store.card_data?.video_url || '';
    const vkURL = card_store.card_data?.vk_video_url || '';
    const isRutube = !!parseRutubeUrl(url);
    const isYoutube = !!url.trim() && !isRutube;
    const defaultHosting = () =>
      vkURL ? 'VK' : isRutube ? 'Rutube' : 'Youtube';
    const [hosting, setHosting] = useState<'VK' | 'Youtube' | 'Rutube'>(
      defaultHosting,
    );
    const cardID = card_store.card_data?.id;
    useEffect(() => setHosting(defaultHosting()), [cardID, url, vkURL]);
    const isMobile = isMobileHook();
    const testID = card_store.card_data?.test_in_card_id;
    return (
      <Box>
        <Box className="sw-material-video">
          <div className="sw-material-player">
            {hosting === 'VK' ? (
              <VkVideoContent videoURL={vkURL} />
            ) : hosting === 'Rutube' ? (
              <RutubePlayer
                url={url}
                onEnded={() => {
                  card_store.isOpenGoToTestDialogAfterVideo = true;
                }}
              />
            ) : (
              <YoutubeContent card_store={card_store} />
            )}
          </div>
          <ToggleButtonGroup
            className="sw-material-hosts"
            aria-label="Видеоплатформа"
            size={isMobile ? 'small' : 'medium'}
            exclusive
            value={hosting}
            onChange={(_, value) => {
              if (value) setHosting(value);
            }}
          >
            <ToggleButton value="VK" disabled={!vkURL}>
              VK Видео
            </ToggleButton>
            <ToggleButton value="Youtube" disabled={!isYoutube}>
              YouTube
            </ToggleButton>
            <ToggleButton value="Rutube" disabled={!isRutube}>
              Rutube
            </ToggleButton>
          </ToggleButtonGroup>
        </Box>
        {card_store.card_data?.is_card_use_test_in_card &&
          card_store.isOpenGoToTestDialogAfterVideo &&
          testID && <GoToTestDialog card_store={card_store} />}
      </Box>
    );
  },
);
export default VideoContent;
