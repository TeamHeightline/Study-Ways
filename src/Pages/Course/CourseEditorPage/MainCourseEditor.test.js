import React from 'react';
import { act as legacyAct } from 'react-dom/test-utils';
import { createRoot } from 'react-dom/client';
import { MockedProvider } from '@apollo/client/testing';
import { useSelector } from 'react-redux';
import { useAppDispatch } from '../../../App/ReduxStore/RootStore';
import MainCourseEditor, {
  CREATE_COURSE_WITH_DEFAULT_VALUE,
  GET_OWN_COURSE,
} from './MainCourseEditor';
import {
  CourseLines,
  normalizeCourseData,
} from '../EditCourseByID/course-data';

jest.mock('react-redux', () => ({ useSelector: jest.fn() }));
jest.mock('../../../App/ReduxStore/RootStore', () => ({
  useAppDispatch: jest.fn(),
}));
jest.mock('../Page/redux-store/async-functions', () => ({
  loadCourseDataThunk: () => ({ type: 'load' }),
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
const ownQuery = courses => ({
  request: { query: GET_OWN_COURSE },
  result: { data: { me: { cardcourseSet: courses } } },
});
const createRequest = {
  query: CREATE_COURSE_WITH_DEFAULT_VALUE,
  variables: { default_data: normalizeCourseData(CourseLines) },
};
let root, container;
beforeEach(() => {
  global.IS_REACT_ACT_ENVIRONMENT = true;
  jest.useFakeTimers();
  useSelector.mockImplementation(select =>
    select({ coursePage: { courses_data: [] } }),
  );
  useAppDispatch.mockReturnValue(jest.fn());
  container = document.createElement('div');
  document.body.appendChild(container);
  root = createRoot(container);
});
afterEach(async () => {
  await act(async () => root.unmount());
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
  await act(async () =>
    root.render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <MainCourseEditor />
      </MockedProvider>,
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
