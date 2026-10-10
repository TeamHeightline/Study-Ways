import React, { useEffect, useRef } from 'react';
import { parseRutubeUrl } from './rutube';

export default function RutubePlayer({
  url,
  onEnded,
}: {
  url: string;
  onEnded?: () => void;
}) {
  const frame = useRef<HTMLIFrameElement>(null);
  const video = parseRutubeUrl(url);
  useEffect(() => {
    if (!video || !onEnded) return;
    const onMessage = (event: MessageEvent) => {
      if (
        event.origin !== 'https://rutube.ru' ||
        event.source !== frame.current?.contentWindow
      )
        return;
      try {
        const message =
          typeof event.data === 'string' ? JSON.parse(event.data) : event.data;
        if (message?.type === 'player:playComplete') onEnded();
      } catch {
        /* Ignore messages that are not player events. */
      }
    };
    window.addEventListener('message', onMessage);
    return () => window.removeEventListener('message', onMessage);
  }, [video?.embedUrl, onEnded]);
  if (!video) return null;
  return (
    <iframe
      ref={frame}
      title="Видео Rutube"
      src={video.embedUrl}
      allow="autoplay; clipboard-write; encrypted-media; picture-in-picture"
      allowFullScreen
      style={{ display: 'block', width: '100%', height: '100%', border: 0 }}
    />
  );
}
