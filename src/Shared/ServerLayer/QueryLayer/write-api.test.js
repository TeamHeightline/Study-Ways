import { configureStore } from '@reduxjs/toolkit';
import { studyWaysApi } from './api';
import { writeApi } from './write-api';
import { questionReadApi } from '../../../Pages/Question/question-read-api';
import { courseCatalogApi } from '../../../Pages/Course/Page/Store/course-catalog-api';
import axiosClient from './config';
jest.mock('./config', () => ({ request: jest.fn() }));
let store, subscriptions, courseCreated;
const tick = () => new Promise(resolve => setTimeout(resolve, 0));
beforeEach(() => {
  courseCreated = false;
  subscriptions = [];
  store = configureStore({
    reducer: { [studyWaysApi.reducerPath]: studyWaysApi.reducer },
    middleware: getDefault => getDefault().concat(studyWaysApi.middleware),
  });
  axiosClient.request
    .mockReset()
    .mockImplementation(async ({ url, method }) => {
      if (url === '/page/write/courses') {
        courseCreated = true;
        return { data: { id: 77, name: 'Новый курс' } };
      }
      if (url === '/page/course/catalog')
        return {
          data: {
            items: courseCreated ? [{ id: '77', name: 'Новый курс' }] : [],
            total: courseCreated ? 1 : 0,
            activePage: 1,
            numPages: 1,
          },
        };
      return {
        data: {
          id: Number(url.split('/')[3]),
          text: method === 'PUT' ? 'После' : 'До',
        },
      };
    });
});
afterEach(() => {
  subscriptions.forEach(request => request.unsubscribe());
  store.dispatch(studyWaysApi.util.resetApiState());
});
test('saving refreshes the affected question without fetching unrelated questions', async () => {
  for (const id of [42, 43]) {
    const request = store.dispatch(
      questionReadApi.endpoints.getQuestionPreview.initiate(id),
    );
    subscriptions.push(request);
    await request.unwrap();
  }
  await store
    .dispatch(
      writeApi.endpoints.saveQuestion.initiate({
        id: 42,
        data: { text: 'После' },
      }),
    )
    .unwrap();
  await tick();
  const reads = axiosClient.request.mock.calls
    .filter(([args]) => !args.method)
    .map(([args]) => args.url);
  expect(reads.filter(url => url.includes('/42/'))).toHaveLength(2);
  expect(reads.filter(url => url.includes('/43/'))).toHaveLength(1);
});
test('a rejected save preserves cached data and does not trigger a refetch', async () => {
  const request = store.dispatch(
    questionReadApi.endpoints.getQuestionPreview.initiate(42),
  );
  subscriptions.push(request);
  await request.unwrap();
  axiosClient.request.mockRejectedValueOnce({
    response: { status: 403, data: { message: 'Нет прав' } },
  });
  await expect(
    store
      .dispatch(writeApi.endpoints.saveQuestion.initiate({ id: 42, data: {} }))
      .unwrap(),
  ).rejects.toMatchObject({ status: 403 });
  await tick();
  expect(axiosClient.request).toHaveBeenCalledTimes(2);
  expect(
    questionReadApi.endpoints.getQuestionPreview.select(42)(store.getState())
      .data.text,
  ).toBe('До');
});
test('creating a course refreshes an active paginated catalog automatically', async () => {
  const filters = {
    page: 1,
    search: '',
    authorId: null,
    levels: 'all',
    sort: 'default',
  };
  const request = store.dispatch(
    courseCatalogApi.endpoints.getCourseCatalogPage.initiate(filters),
  );
  subscriptions.push(request);
  await request.unwrap();
  await store
    .dispatch(writeApi.endpoints.createCourse.initiate({ lines: [] }))
    .unwrap();
  await tick();
  expect(
    courseCatalogApi.endpoints.getCourseCatalogPage.select(filters)(
      store.getState(),
    ).data.items,
  ).toEqual([{ id: '77', name: 'Новый курс' }]);
});
