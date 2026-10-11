import themeReducer from '../../../shared/theme/theme-store';
import { configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import { userApi } from '../../../shared/store/user-store/user-session';
import { setTestUser } from '../../../shared/store/user-store/user-session.test-utils';
import React from 'react';
import { act as legacyAct } from 'react-dom/test-utils';
import { createRoot } from 'react-dom/client';
import { useNavigate } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import PersonalMenu from './PersonalMenu';
import axiosClient, {
  setAccessToken,
} from '../../../shared/server-layer/query-layer/config';
import PagesMenu from './PagesMenu';

jest.mock('react-router-dom', () => ({ useNavigate: jest.fn() }));
jest.mock('@auth0/auth0-react', () => ({ useAuth0: jest.fn() }));

jest.mock('../../../shared/store/user-store/utils/HaveStatus', () => ({
  __esModule: true,
  default: () => true,
}));
jest.mock('../../../shared/custom-hooks/isMobileHook', () => ({
  isMobileHook: () => false,
}));

const act = React.act || legacyAct;
let root, container, navigate, store;

beforeEach(async () => {
  store = configureStore({
    reducer: { theme: themeReducer, [userApi.reducerPath]: userApi.reducer },
    middleware: get => get().concat(userApi.middleware),
  });
  await setTestUser(store, { id: 7, user_access_level: 'TEACHER' });
  global.IS_REACT_ACT_ENVIRONMENT = true;
  navigate = jest.fn();
  useNavigate.mockReturnValue(navigate);
  useAuth0.mockReturnValue({ isAuthenticated: true, logout: jest.fn() });
  container = document.createElement('div');
  document.body.appendChild(container);
  root = createRoot(container);
});

afterEach(() => {
  act(() => root.unmount());
  store.dispatch(userApi.util.resetApiState());
  container.remove();
  delete global.IS_REACT_ACT_ENVIRONMENT;
});

test.each([
  [PersonalMenu, 'Профиль', '/profile'],
  [PagesMenu, 'Карточки', '/cards'],
])(
  'navigation menu opens with MUI context and preserves navigation',
  async (Component, label, path) => {
    await act(async () =>
      root.render(
        <Provider store={store}>
          <Component />
        </Provider>,
      ),
    );
    await act(async () => container.querySelector('button').click());
    const menu = document.querySelector('[role="menu"]');
    expect(menu).not.toBeNull();
    expect(menu.contains(document.activeElement)).toBe(true);
    const item = [...menu.querySelectorAll('[role="menuitem"]')].find(
      node => node.textContent.trim() === label,
    );
    await act(async () => item.click());
    expect(navigate).toHaveBeenCalledWith(path);
  },
);

test.each([true, false])(
  'logout clears the REST session and uses Auth0 v2 redirect options (SDK authenticated: %s)',
  async isAuthenticated => {
    const logout = jest.fn().mockResolvedValue(undefined);
    useAuth0.mockReturnValue({ isAuthenticated, logout });
    setAccessToken('current-token');
    await act(async () =>
      root.render(
        <Provider store={store}>
          <PersonalMenu />
        </Provider>,
      ),
    );
    await act(async () => container.querySelector('button').click());
    const item = [...document.querySelectorAll('[role="menuitem"]')].find(
      node => node.textContent.trim() === 'Выйти',
    );
    await act(async () => item.click());
    expect(logout).toHaveBeenCalledTimes(1);
    expect(logout).toHaveBeenCalledWith({
      logoutParams: { returnTo: window.location.origin },
    });
    expect(axiosClient.defaults.headers.common.Authorization).toBeUndefined();
    expect(store.getState().studyWaysApi.queries).toEqual({});
  },
);
