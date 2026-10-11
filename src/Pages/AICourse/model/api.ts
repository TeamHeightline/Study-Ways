import recombeeClient from '../../../Shared/Store/RecombeeClient/recombee-client';
// @ts-ignore
import recombee, { RecommendItemsToItem } from 'recombee-js-api-client';
import { getUserSession } from '../../../Shared/Store/UserStore/session-access';

const NUMBER_OF_NEXT_CARDS = 3;

const NUMBER_OF_DEFAULT_CARDS = 5;

export async function getCardsBySearch(
  searchString: string,
): Promise<number[]> {
  return new Promise((res, rej) => {
    // @ts-ignore
    recombeeClient.send(
      // @ts-ignore
      new recombee.SearchItems(
        String(getUserSession().recommendationUserId),
        searchString,
        NUMBER_OF_DEFAULT_CARDS,
        {
          scenario: 'Search-Card',
          returnProperties: true,
          cascadeCreate: true,
          includedProperties: ['title'],
        },
      ),
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

export async function getNextCards(cardID: number): Promise<number[]> {
  return new Promise((res, rej) => {
    recombeeClient.send(
      new RecommendItemsToItem(
        String(cardID),
        String(getUserSession().recommendationUserId),
        NUMBER_OF_NEXT_CARDS,
      ),
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
