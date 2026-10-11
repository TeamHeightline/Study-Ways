import React from 'react';
import { act as legacyAct } from 'react-dom/test-utils';
import { createRoot } from 'react-dom/client';
import {
  ThemeIllustration,
  ThemeHeroArt,
  ThemeCompanion,
} from './ThemeIllustration';
import { themeActions } from './theme-store';
import { createThemeTestStore } from './theme-test-utils';
import { Provider } from 'react-redux';

const act = React.act || legacyAct;

test('changing the active theme mounts decorative artwork and restores the original icon without reloading', async () => {
  global.IS_REACT_ACT_ENVIRONMENT = true;
  localStorage.clear();
  const store = createThemeTestStore();
  store.dispatch(themeActions.themeChanged('sage'));
  const container = document.createElement('div');
  document.body.appendChild(container);
  const root = createRoot(container);
  try {
    await act(async () =>
      root.render(
        <Provider store={store}>
          {
            <>
              <ThemeIllustration
                variant="portrait"
                fallback={<span>Обычная иконка</span>}
              />
              <ThemeHeroArt />
              <ThemeCompanion />
            </>
          }
        </Provider>,
      ),
    );
    expect(container.querySelectorAll('img').length).toBe(0);
    expect(container.textContent).toBe('Обычная иконка');
    await act(async () => store.dispatch(themeActions.themeChanged('manul')));
    expect(document.documentElement.dataset.illustrations).toBe('manul');
    expect(container.querySelectorAll('img').length).toBe(3);
    expect(container.textContent).not.toContain('Обычная иконка');
    for (const image of container.querySelectorAll('img')) {
      expect(image.getAttribute('alt')).toBe('');
      expect(image.getAttribute('aria-hidden')).toBe('true');
      expect(image.getAttribute('draggable')).toBe('false');
    }
    await act(async () =>
      store.dispatch(themeActions.themeChanged('high-contrast-dark')),
    );
    expect(document.documentElement.dataset.illustrations).toBe('none');
    expect(container.querySelectorAll('img').length).toBe(0);
    expect(container.textContent).toBe('Обычная иконка');
  } finally {
    await act(async () => root.unmount());
    container.remove();
    localStorage.clear();
    delete global.IS_REACT_ACT_ENVIRONMENT;
  }
});
