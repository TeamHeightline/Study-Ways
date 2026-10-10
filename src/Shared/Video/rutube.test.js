import { parseRutubeUrl } from './rutube';
import React from 'react';
import { act as legacyAct } from 'react-dom/test-utils';
import { createRoot } from 'react-dom/client';
import RutubePlayer from './RutubePlayer';

const id = '0123456789abcdef0123456789abcdef';
test.each([
  [`https://rutube.ru/video/${id}/`, `https://rutube.ru/play/embed/${id}/`],
  [
    `https://www.rutube.ru/shorts/${id}/?t=15`,
    `https://rutube.ru/play/embed/${id}/?t=15`,
  ],
  [
    `https://rutube.ru/video/private/${id}/?p=secret&foo=bar`,
    `https://rutube.ru/play/embed/${id}/?p=secret`,
  ],
  [
    'https://rutube.ru/play/embed/12345/?p=key&t=30',
    'https://rutube.ru/play/embed/12345/?p=key&t=30',
  ],
])(
  'converts supported URLs without losing private access or start time: %s',
  (url, expected) => {
    expect(parseRutubeUrl(url)?.embedUrl).toBe(expected);
  },
);
test.each([
  '',
  `https://rutube.ru.evil.test/video/${id}/`,
  `https://user@rutube.ru/video/${id}/`,
  `javascript:alert(1)`,
  `https://rutube.ru/video/${id}/extra`,
  'https://rutube.ru/video/invalid/',
])('rejects an invalid video URL: %s', url => {
  expect(parseRutubeUrl(url)).toBeNull();
});
test('only accepts playback completion from its own Rutube frame and removes the listener', async () => {
  const act = React.act || legacyAct;
  global.IS_REACT_ACT_ENVIRONMENT = true;
  const container = document.createElement('div');
  document.body.appendChild(container);
  const root = createRoot(container);
  const ended = jest.fn();
  await act(async () =>
    root.render(
      <RutubePlayer url={`https://rutube.ru/video/${id}/`} onEnded={ended} />,
    ),
  );
  const source = container.querySelector('iframe').contentWindow;
  const send = (
    origin,
    frame,
    data = JSON.stringify({ type: 'player:playComplete' }),
  ) =>
    window.dispatchEvent(
      new MessageEvent('message', { origin, source: frame, data }),
    );
  send('https://evil.test', source);
  send('https://rutube.ru', window);
  send('https://rutube.ru', source, 'not json');
  expect(ended).not.toHaveBeenCalled();
  send('https://rutube.ru', source);
  expect(ended).toHaveBeenCalledTimes(1);
  await act(async () => root.unmount());
  send('https://rutube.ru', source);
  expect(ended).toHaveBeenCalledTimes(1);
  container.remove();
  delete global.IS_REACT_ACT_ENVIRONMENT;
});
