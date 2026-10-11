import recombeeClient from '../../../shared/store/recombee-client/recombee-client';
// @ts-ignore
import recombee, { RecommendItemsToItem } from 'recombee-js-api-client';
import { studyWaysApi } from '../../../shared/server-layer/query-layer/api';

const NUMBER_OF_NEXT_CARDS = 3;

const NUMBER_OF_DEFAULT_CARDS = 5;

export async function getCardsBySearch(
  searchString: string,
  userId: string,
): Promise<number[]> {
  return new Promise((res, rej) => {
    // @ts-ignore
    recombeeClient.send(
      // @ts-ignore
      new recombee.SearchItems(userId, searchString, NUMBER_OF_DEFAULT_CARDS, {
        scenario: 'Search-Card',
        returnProperties: true,
        cascadeCreate: true,
        includedProperties: ['title'],
      }),
      (err, matches) => {
        if (err) {
          rej(err);
          return;
        }
        // @ts-ignore
        res(matches?.recomms?.map(recommItem => recommItem?.id));
      },
    );
  });
}

export async function getNextCards(
  cardID: number,
  userId: string,
): Promise<number[]> {
  return new Promise((res, rej) => {
    recombeeClient.send(
      new RecommendItemsToItem(String(cardID), userId, NUMBER_OF_NEXT_CARDS),
      (err, matches) => {
        if (err) {
          rej(err);
          return;
        }
        // @ts-ignore
        res(matches?.recomms?.map(recommItem => recommItem?.id));
      },
    );
  });
}

export const aiCourseApi = studyWaysApi.injectEndpoints({
  endpoints: build => ({
    getCourseRecommendations: build.query<
      number[],
      { search: string; userId: string }
    >({
      queryFn: async ({ search, userId }) => {
        try {
          return { data: (await getCardsBySearch(search, userId)).map(Number) };
        } catch {
          return {
            error: { status: 500, data: 'Не удалось построить маршрут' },
          };
        }
      },
    }),
    getNextCourseCards: build.query<number[], { id: number; userId: string }>({
      queryFn: async ({ id, userId }) => {
        try {
          return { data: (await getNextCards(id, userId)).map(Number) };
        } catch {
          return {
            error: { status: 500, data: 'Не удалось продолжить маршрут' },
          };
        }
      },
    }),
  }),
});
