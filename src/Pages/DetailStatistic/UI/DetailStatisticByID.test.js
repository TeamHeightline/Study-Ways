import React from 'react';
import { act as legacyAct } from 'react-dom/test-utils';
import { createRoot } from 'react-dom/client';
import {
  ApolloClient,
  ApolloLink,
  InMemoryCache,
  Observable,
} from '@apollo/client';
import { buildSchema, execute } from 'graphql';
import { readFileSync } from 'fs';
import { ClientStorage } from '../../../Shared/Store/ApolloStorage/ClientStorage';
import { DetailStatisticByID } from './DetailStatisticByID';

jest.mock('../../../Shared/Store/ApolloStorage/ClientStorage', () => ({
  ClientStorage: { client: null },
}));
jest.mock('../../../Shared/Store/UserStore/UserStore', () => ({
  UserStorage: { userAccessLevel: 'TEACHER' },
}));
jest.mock('./ChartAndStepByStepStatistic', () => ({
  ChartAndStepByStepStatistic: () => null,
}));

const act = React.act || legacyAct;
// Execute the real query against the checked-in server schema, including its
// non-null firstname/lastname fields and GraphQL's null propagation.
const schema = buildSchema(readFileSync('schema.graphql', 'utf8'));
let root, container, attempt, responses, failNetwork;
beforeEach(() => {
  global.IS_REACT_ACT_ENVIRONMENT = true;
  responses = [];
  failNetwork = false;
  attempt = {
    id: '7',
    userName: 'student@example.com',
    isLogin: true,
    isUseexammode: false,
    maxSumOfAnswersPoint: 10,
    question: { id: '33' },
    questionHasBeenCompleted: true,
    questionSequence: null,
    statistic: {
      numberOfPasses: 2,
      ArrayForShowAnswerPoints: [
        { numberOfPasses: 1, answerPoints: 5 },
        { numberOfPasses: 2, answerPoints: 10 },
      ],
      ArrayForShowWrongAnswers: [
        { numberOfPasses: 1, numberOfWrongAnswers: [42] },
        { numberOfPasses: 2, numberOfWrongAnswers: [] },
      ],
    },
    createdAt: '2026-10-10T10:00:00Z',
    authorizedUser: { userprofile: null },
  };
  ClientStorage.client = new ApolloClient({
    cache: new InMemoryCache(),
    link: new ApolloLink(
      operation =>
        new Observable(observer => {
          if (failNetwork) {
            observer.error(new Error('Network unavailable'));
            return;
          }
          Promise.resolve(
            execute({
              schema,
              document: operation.query,
              variableValues: operation.variables,
              rootValue: {
                detailStatisticById: attempt,
                questionText: { id: '33', text: 'Тестовый вопрос' },
              },
            }),
          ).then(
            result => {
              responses.push(result);
              observer.next(result);
              observer.complete();
            },
            error => observer.error(error),
          );
        }),
    ),
  });
  container = document.createElement('div');
  document.body.appendChild(container);
  root = createRoot(container);
});
afterEach(async () => {
  await act(async () => root.unmount());
  ClientStorage.client.stop();
  container.remove();
  delete global.IS_REACT_ACT_ENVIRONMENT;
});
async function renderResult() {
  await act(async () =>
    root.render(
      <table>
        <tbody>
          <DetailStatisticByID attempt_id={7} />
        </tbody>
      </table>,
    ),
  );
  await act(async () => new Promise(resolve => setTimeout(resolve, 0)));
}
function expectStatistic() {
  expect(container.textContent).toContain('student@example.com');
  expect(container.textContent).toContain('8/10 (80%)');
  expect(container.querySelector('[role="alert"]')).toBeNull();
}

test.each([
  [
    'completely empty profile',
    { firstname: null, lastname: null, avatarSrc: null },
  ],
  ['missing lastname', { firstname: 'Анна', lastname: null, avatarSrc: null }],
  [
    'missing firstname',
    { firstname: null, lastname: 'Иванова', avatarSrc: null },
  ],
])(
  'statistics survives a non-null GraphQL error for %s',
  async (_, profile) => {
    attempt.authorizedUser.userprofile = profile;
    await renderResult();
    expect(responses[0].errors[0].message).toMatch(
      /Cannot return null for non-nullable field UserProfileNode\.(lastname|firstname)/,
    );
    expect(
      responses[0].data.detailStatisticById.authorizedUser.userprofile,
    ).toBeNull();
    expectStatistic();
    expect(container.textContent).toContain('Не указаны');
  },
);

test.each([
  ['no profile record', null],
  ['blank strings', { firstname: ' ', lastname: '', avatarSrc: null }],
])('statistics renders with %s', async (_, profile) => {
  attempt.authorizedUser.userprofile = profile;
  await renderResult();
  expect(responses[0].errors).toBeUndefined();
  expectStatistic();
  expect(container.textContent).toContain('Не указаны');
  expect(container.querySelector('img')).toBeNull();
});

test('a filled profile still shows its name and avatar', async () => {
  attempt.authorizedUser.userprofile = {
    firstname: 'Анна',
    lastname: 'Иванова',
    avatarSrc: '/avatar.jpg',
  };
  await renderResult();
  expectStatistic();
  expect(container.textContent).toContain('Анна Иванова');
  expect(container.querySelector('img').getAttribute('src')).toBe(
    '/avatar.jpg',
  );
});

test('an anonymous attempt does not require an authorized user', async () => {
  attempt.authorizedUser = null;
  attempt.userName = null;
  attempt.isLogin = false;
  await renderResult();
  expect(container.textContent).toContain('Анонимный пользователь');
  expect(container.textContent).toContain('8/10 (80%)');
  expect(container.textContent).toContain('Не указаны');
});

test('unrelated GraphQL errors remain visible and retry fetches fresh data', async () => {
  attempt.maxSumOfAnswersPoint = () => {
    throw new Error('Statistic unavailable');
  };
  await renderResult();
  expect(container.querySelector('[role="alert"]').textContent).toContain(
    'Не удалось загрузить результат №7',
  );
  attempt.maxSumOfAnswersPoint = 10;
  await act(async () => container.querySelector('button').click());
  await act(async () => new Promise(resolve => setTimeout(resolve, 0)));
  expectStatistic();
});

test('network failure offers retry instead of an unhandled rejection', async () => {
  failNetwork = true;
  await renderResult();
  expect(container.querySelector('[role="alert"]').textContent).toContain(
    'Не удалось загрузить результат №7',
  );
  failNetwork = false;
  await act(async () => container.querySelector('button').click());
  await act(async () => new Promise(resolve => setTimeout(resolve, 0)));
  expectStatistic();
});
