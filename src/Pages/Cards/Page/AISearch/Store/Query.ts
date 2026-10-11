// @ts-ignore
import recombee from 'recombee-js-api-client';
import recombeeClient from '../../../../../Shared/Store/RecombeeClient/recombee-client';
import { getUserSession } from '../../../../../Shared/Store/UserStore/session-access';

export async function getAutocompleteCardDataAsync(
  searchString: string | undefined,
  filterString: string | undefined = undefined,
  callBackFn?: (data: any) => void,
  numberOfCards = 10,
) {
  console.log(searchString);
  if (searchString && getUserSession().recommendationUserId) {
    // @ts-ignore
    recombeeClient.send(
      // @ts-ignore
      new recombee.SearchItems(
        String(getUserSession().recommendationUserId),
        searchString,
        numberOfCards,
        {
          scenario: 'Search-Card',
          returnProperties: true,
          cascadeCreate: true,
          includedProperties: ['title'],
          filter: filterString || undefined,
        },
      ),
      (err, matches) => {
        // callback(matches)
        if (callBackFn) {
          callBackFn(matches);
        }
        // AISObject.convertMatchToCardData(matches)
      },
    );
  } else {
    getRecommendedItemToUser('-1', filterString, callBackFn, numberOfCards);
  }
}

export async function getRecommendedItemToUser(
  userId: string,
  filterString: string | undefined = undefined,
  callBackFn?: (data: any) => void,
  numberOfCards = 10,
) {
  // @ts-ignore
  recombeeClient.send(
    // @ts-ignore
    new recombee.RecommendItemsToUser(userId, numberOfCards, {
      returnProperties: true,
      cascadeCreate: true,
      includedProperties: ['title'],
      filter: filterString || undefined,
    }),
    (err, matches) => {
      // callback(matches)
      if (callBackFn) {
        callBackFn(matches);
      }
      // AISObject.convertMatchToCardData(matches)
    },
  );
}

export async function selectRecommendedCardReport(
  recommendationID: string,
  itemId,
) {
  if (recommendationID && itemId) {
    // @ts-ignore
    recombeeClient.send(
      // @ts-ignore
      new recombee.AddDetailView(
        getUserSession().recommendationUserId,
        itemId,
        {
          recommId: recommendationID,
        },
      ),
    );
  }
}
