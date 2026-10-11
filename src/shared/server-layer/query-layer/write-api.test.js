import themeReducer from '../../theme/theme-store';
import { configureStore } from '@reduxjs/toolkit';
import { studyWaysApi } from './api';
import { writeApi } from './write-api';
import { questionReadApi } from '../../../pages/question/question-read-api';
import { courseCatalogApi } from '../../../pages/course/page/store/course-catalog-api';
import axiosClient from './config';
import { cardPreviewsApi } from '../../../pages/cards/card-micro-view/store/api';
import { cardSelectorApi } from '../../../pages/cards/selector/store/card-selector-api';
import { cardApi } from '../../../pages/cards/card-by-id/api/card-api';
import { cardEditorApi } from '../../../pages/cards/editor/editor-by-id-v2/model/card-editor-api';
import { courseApi } from '../../../pages/course/course-api';
import { courseMaterialsApi } from '../../../pages/course/course-materials-api';
import { authorApi } from '../../../pages/author/store/author-api';
jest.mock('./config', () => ({ request: jest.fn() }));
let store, subscriptions, courseCreated;
const tick = () => new Promise(resolve => setTimeout(resolve, 0));
beforeEach(() => {
  courseCreated = false;
  subscriptions = [];
  store = configureStore({
    reducer: {
      theme: themeReducer,
      [studyWaysApi.reducerPath]: studyWaysApi.reducer,
    },
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

test('saving a card refreshes every active card cache, filtered list, author and course preview', async () => {
  let version = 'До';
  const reads = [];
  axiosClient.request.mockImplementation(async ({ url, method }) => {
    if (method === 'PUT') {
      version = 'После';
      return { data: { id: 812 } };
    }
    reads.push(url);
    const card = {
      id: 812,
      title: version,
      cards_cardimage: { image: version + '.png' },
    };
    return {
      data:
        url === '/page/card-micro-view/all'
          ? { 812: card }
          : url.startsWith('/page/card-selector')
            ? { IDs: ['812'], activePage: 1, numPages: 1 }
            : url.endsWith('/cards')
              ? [card]
              : url === '/page/course/catalog'
                ? {
                    items: [{ id: '5', name: version }],
                    total: 1,
                    activePage: 1,
                    numPages: 1,
                  }
                : url === '/page/course'
                  ? [{ id: 5, name: version }]
                  : { ...card, name: version },
    };
  });
  const searches = [
    { page: 1, search: '', mine: false },
    {
      page: 2,
      search: 'оптика',
      authorId: 7,
      themeId: 12,
      mine: true,
      userId: 7,
    },
  ];
  const entries = [
    [
      cardPreviewsApi.endpoints.getCardPreviews,
      undefined,
      data => data[812].title,
    ],
    ...searches.map(arg => [
      cardSelectorApi.endpoints.getCardSelectorPage,
      arg,
    ]),
    [cardApi.endpoints.getCard, 812, data => data.title],
    [cardApi.endpoints.getCard, 813, data => data.title],
    [
      cardEditorApi.endpoints.getCardEditorData,
      { id: 812, userId: 7 },
      data => data.title,
    ],
    [courseApi.endpoints.getCourseCardPreview, 812, data => data.title],
    [
      courseMaterialsApi.endpoints.getCoursePageCards,
      { courseId: 5, page: 1 },
      data => data[0].title,
    ],
    [courseApi.endpoints.getCourse, 5, data => data.name],
    [
      courseCatalogApi.endpoints.getCourseCatalogPage,
      { page: 1, search: '', authorId: null, levels: 'all', sort: 'default' },
      data => data.items[0].name,
    ],
    [authorApi.endpoints.getAuthor, 7, data => data.title],
    [authorApi.endpoints.getCourseCatalog, undefined, data => data[0].name],
  ];
  for (const [endpoint, arg] of entries) {
    const request = store.dispatch(endpoint.initiate(arg));
    subscriptions.push(request);
    await request.unwrap();
  }
  const before = [...reads];
  await store
    .dispatch(
      writeApi.endpoints.saveCard.initiate({
        id: 812,
        data: { title: 'После' },
      }),
    )
    .unwrap();
  await tick();
  expect(reads.slice(before.length).sort()).toEqual(before.sort());
  for (const [endpoint, arg, value] of entries) {
    const query = endpoint.select(arg)(store.getState());
    expect(query.status).toBe('fulfilled');
    if (value) expect(value(query.data)).toBe('После');
  }
});

test('saving removes inactive card previews so reopening cannot reuse stale data', async () => {
  let title = 'До';
  axiosClient.request.mockImplementation(async ({ method }) => {
    if (method === 'PUT') {
      title = 'После';
      return { data: { id: 812 } };
    }
    return { data: { 812: { id: 812, title } } };
  });
  await store
    .dispatch(
      cardPreviewsApi.endpoints.getCardPreviews.initiate(undefined, {
        subscribe: false,
      }),
    )
    .unwrap();
  await store
    .dispatch(writeApi.endpoints.saveCard.initiate({ id: 812, data: {} }))
    .unwrap();
  expect(
    cardPreviewsApi.endpoints.getCardPreviews.select()(store.getState())
      .isUninitialized,
  ).toBe(true);
  const request = store.dispatch(
    cardPreviewsApi.endpoints.getCardPreviews.initiate(),
  );
  subscriptions.push(request);
  expect((await request.unwrap())[812].title).toBe('После');
});

test.each([
  ['creating', () => writeApi.endpoints.createCard.initiate()],
  ['copying', () => writeApi.endpoints.copyCard.initiate(812)],
  [
    'uploading an image',
    () =>
      writeApi.endpoints.uploadMaterialImage.initiate({
        kind: 'card',
        id: 812,
        file: new File(['bytes'], 'image.png', { type: 'image/png' }),
      }),
  ],
])('%s a card also refreshes its shared previews', async (_name, action) => {
  let image = 'before.png';
  axiosClient.request.mockImplementation(async ({ method }) => {
    if (method) {
      image = 'after.png';
      return { data: { id: 812, image } };
    }
    return { data: { 812: { id: 812, cards_cardimage: { image } } } };
  });
  const request = store.dispatch(
    cardPreviewsApi.endpoints.getCardPreviews.initiate(),
  );
  subscriptions.push(request);
  await request.unwrap();
  await store.dispatch(action()).unwrap();
  await tick();
  expect(
    cardPreviewsApi.endpoints.getCardPreviews.select()(store.getState())
      .data[812].cards_cardimage.image,
  ).toBe('after.png');
});

test('failed card saves keep valid previews without refetching the catalog', async () => {
  axiosClient.request.mockResolvedValue({
    data: { 812: { id: 812, title: 'До' } },
  });
  const request = store.dispatch(
    cardPreviewsApi.endpoints.getCardPreviews.initiate(),
  );
  subscriptions.push(request);
  await request.unwrap();
  axiosClient.request.mockRejectedValueOnce({
    response: { status: 403, data: { message: 'Нет прав' } },
  });
  await expect(
    store
      .dispatch(writeApi.endpoints.saveCard.initiate({ id: 812, data: {} }))
      .unwrap(),
  ).rejects.toMatchObject({ status: 403 });
  await tick();
  expect(axiosClient.request).toHaveBeenCalledTimes(2);
  expect(
    cardPreviewsApi.endpoints.getCardPreviews.select()(store.getState())
      .data[812].title,
  ).toBe('До');
});
