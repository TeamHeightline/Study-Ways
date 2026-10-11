import { CardByIDStore } from '../store/CardByIDStore';
import ReactPlayer from 'react-player';
import React from 'react';
import { isMobileHook } from '../../../../shared/custom-hooks/isMobileHook';
interface IProps {
  card_store: CardByIDStore;
}
export const YoutubeContent = (props: IProps) => {
  const { card_store } = props;
  const isMobile = isMobileHook();
  const onEndVideoWatch = () => {
    card_store.setView({ isOpenGoToTestDialogAfterVideo: true });
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
};
