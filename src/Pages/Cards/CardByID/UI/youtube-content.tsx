import { observer } from 'mobx-react';
import { CardByIDStore } from '../Store/CardByIDStore';
import ReactPlayer from 'react-player';
import React from 'react';
import { isMobileHook } from '../../../../Shared/CustomHooks/isMobileHook';

interface IProps {
  card_store: CardByIDStore;
}

export const YoutubeContent = observer((props: IProps) => {
  const { card_store } = props;

  const isMobile = isMobileHook();
  const onEndVideoWatch = () => {
    card_store.isOpenGoToTestDialogAfterVideo = true;
  };
  const youtubeVideoURL = card_store?.card_data?.video_url || '';

  return (
    <ReactPlayer
      width="100%"
      height="100%"
      controls
      url={youtubeVideoURL}
      onEnded={onEndVideoWatch}
    />
  );
});
