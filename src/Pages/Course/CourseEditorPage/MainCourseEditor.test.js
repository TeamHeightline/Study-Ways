import React from 'react';
import { act as legacyAct } from 'react-dom/test-utils';
import { createRoot } from 'react-dom/client';
import { MockedProvider } from '@apollo/client/testing';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { courseApi } from '../course-api';
import axiosClient from '../../../Shared/ServerLayer/QueryLayer/config';
import { useAppDispatch } from '../../../App/ReduxStore/RootStore';
import MainCourseEditor, {
  CREATE_COURSE_WITH_DEFAULT_VALUE,
} from './MainCourseEditor';
import {
  CourseLines,
  normalizeCourseData,
} from '../EditCourseByID/course-data';

jest.mock('../../../App/ReduxStore/RootStore', () => ({
  useAppDispatch: () => require('react-redux').useDispatch(),
}));
jest.mock('../../../Shared/ServerLayer/QueryLayer/config', () => ({
  request: jest.fn(),
}));
jest.mock('../../../Shared/Store/UserStore/UserStore', () => ({
  UserStorage: { user_data: { id: 7 } },
}));
jest.mock('../EditCourseByID/EditCourseByID', () => ({
  __esModule: true,
  default: ({ course_id, onChange }) => {
    const React = require('react');
    return React.createElement(
      'div',
      null,
      `Редактор курса №${course_id}`,
      React.createElement(
        'button',
        { onClick: () => onChange('goBack') },
        'К списку',
      ),
    );
  },
}));
const act = React.act || legacyAct;
const course = {
  id: '77',
  name: 'Новый курс',
  courseData: normalizeCourseData(CourseLines),
};
const ownQuery = courses => ({ rest: courses });
const createRequest = {
  query: CREATE_COURSE_WITH_DEFAULT_VALUE,
  variables: { default_data: normalizeCourseData(CourseLines) },
};
let root, container, store;
beforeEach(() => {
  global.IS_REACT_ACT_ENVIRONMENT = true;
  jest.useFakeTimers();
  store = configureStore({
    reducer: { [courseApi.reducerPath]: courseApi.reducer },
    middleware: getDefault => getDefault().concat(courseApi.middleware),
  });
  container = document.createElement('div');
  document.body.appendChild(container);
  root = createRoot(container);
});
afterEach(async () => {
  await act(async () => root.unmount());
  store.dispatch(courseApi.util.resetApiState());
  container.remove();
  jest.clearAllTimers();
  jest.useRealTimers();
  delete global.IS_REACT_ACT_ENVIRONMENT;
});
const button = text =>
  [...container.querySelectorAll('button')].find(
    node => node.textContent === text,
  );
const render = async mocks => {
  const lists = mocks.filter(mock => mock.rest).map(mock => mock.rest);
  axiosClient.request.mockImplementation(async () => ({
    data: lists.length > 1 ? lists.shift() : lists[0] || [],
  }));
  const mutations = mocks.filter(mock => !mock.rest);
  await act(async () =>
    root.render(
      <Provider store={store}>
        <MockedProvider mocks={mutations} addTypename={false}>
          <MainCourseEditor />
        </MockedProvider>
      </Provider>,
    ),
  );
  await act(async () => jest.advanceTimersByTime(10));
};

test('owned courses are visible even when the Redux catalog has no matching course', async () => {
  await render([ownQuery([course])]);
  expect(container.textContent).toContain('Новый курс');
  expect(
    container.querySelector('[aria-label="Редактировать курс «Новый курс»"]'),
  ).not.toBeNull();
});

test('creating a course opens its editor and returning shows it without a page reload', async () => {
  const createResult = jest.fn(() => ({
    data: { createCardCourse: { course } },
  }));
  await render([
    ownQuery([]),
    { request: createRequest, result: createResult },
    ownQuery([course]),
  ]);
  act(() => button('Создать курс').click());
  expect(button('Создаём курс…').disabled).toBe(true);
  await act(async () => jest.advanceTimersByTime(10));
  expect(createResult).toHaveBeenCalledTimes(1);
  expect(container.textContent).toContain('Редактор курса №77');
  act(() => button('К списку').click());
  await act(async () => jest.advanceTimersByTime(10));
  expect(
    container.querySelector('[aria-label="Редактировать курс «Новый курс»"]'),
  ).not.toBeNull();
});

test('a failed creation shows an error and lets the user retry', async () => {
  await render([
    ownQuery([]),
    { request: createRequest, error: new Error('Unavailable') },
    {
      request: createRequest,
      result: { data: { createCardCourse: { course } } },
    },
  ]);
  act(() => button('Создать курс').click());
  await act(async () => jest.advanceTimersByTime(10));
  expect(container.textContent).toContain('Не удалось создать курс');
  expect(button('Создать курс').disabled).toBe(false);
  act(() => button('Создать курс').click());
  await act(async () => jest.advanceTimersByTime(10));
  expect(container.textContent).toContain('Редактор курса №77');
});
