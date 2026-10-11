import { configureStore } from '@reduxjs/toolkit';
import reducer, {
  searchAICourse,
  expandAICourse,
  aiCourseActions,
} from './store';
import { studyWaysApi } from '../../../shared/server-layer/query-layer/api';
import recombeeClient from '../../../shared/store/recombee-client/recombee-client';
jest.mock('../../../shared/store/recombee-client/recombee-client', () => ({
  send: jest.fn(),
}));
let store, callbacks;
beforeEach(() => {
  callbacks = [];
  recombeeClient.send.mockImplementation((request, callback) => {
    callbacks.push(callback);
  });
  store = configureStore({
    reducer: {
      aiCourse: reducer,
      [studyWaysApi.reducerPath]: studyWaysApi.reducer,
    },
    middleware: get => get().concat(studyWaysApi.middleware),
  });
});
afterEach(() => store.dispatch(studyWaysApi.util.resetApiState()));
const result = ids => ({ recomms: ids.map(id => ({ id: String(id) })) });
test('a slower previous search cannot replace the latest course or its selected resource', async () => {
  const old = store.dispatch(searchAICourse({ search: 'old', userId: '7' }));
  const latest = store.dispatch(searchAICourse({ search: 'new', userId: '7' }));
  callbacks[1](null, result([20]));
  await latest;
  store.dispatch(aiCourseActions.selected(20));
  callbacks[0](null, result([10]));
  await old;
  expect(store.getState().aiCourse.nodes.map(n => n.id)).toEqual(['20']);
  expect(store.getState().aiCourse.selectedCardId).toBe(20);
});
test('branch requests are deduplicated, can be retried after failure, and cannot enter a newer search', async () => {
  const search = store.dispatch(
    searchAICourse({ search: 'physics', userId: '7' }),
  );
  callbacks[0](null, result([20]));
  await search;
  const generation = store.getState().aiCourse.searchRequest;
  const args = { id: 20, userId: '7', generation };
  const first = store.dispatch(expandAICourse(args));
  const duplicate = store.dispatch(expandAICourse(args));
  expect(callbacks).toHaveLength(2);
  callbacks[1](Error('offline'));
  await first;
  await duplicate;
  expect(store.getState().aiCourse.branches[20]).toBeUndefined();
  const retry = store.dispatch(expandAICourse(args));
  expect(callbacks).toHaveLength(3);
  const replacement = store.dispatch(
    searchAICourse({ search: 'optics', userId: '7' }),
  );
  callbacks[3](null, result([30]));
  await replacement;
  callbacks[2](null, result([21, 22]));
  await retry;
  expect(store.getState().aiCourse.nodes.map(n => n.id)).toEqual(['30']);
  await store.dispatch(expandAICourse(args));
  expect(callbacks).toHaveLength(4);
});
test('expansion never duplicates recommended cards or introduces self-links', async () => {
  const search = store.dispatch(
    searchAICourse({ search: 'physics', userId: '7' }),
  );
  callbacks[0](null, result([20]));
  await search;
  store.dispatch(aiCourseActions.rootSelected(20));
  const expansion = store.dispatch(
    expandAICourse({
      id: 20,
      userId: '7',
      generation: store.getState().aiCourse.searchRequest,
    }),
  );
  callbacks[1](null, result([20, 21, 21, 22]));
  await expansion;
  expect(store.getState().aiCourse.nodes.map(n => n.id)).toEqual([
    '20',
    '21',
    '22',
  ]);
  expect(store.getState().aiCourse.edges).toHaveLength(2);
});
