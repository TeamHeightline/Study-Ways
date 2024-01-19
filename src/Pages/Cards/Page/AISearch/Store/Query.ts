// @ts-ignore
import recombee from 'recombee-js-api-client';
import recombeeClient from "../../../../../Store/RecombeeClient/recombee-client";
import {UserStorage} from "../../../../../Store/UserStore/UserStore";

export async function getAutocompleteCardDataAsync(searchString: string | undefined, filterString: string | undefined = undefined, callBackFn?: (data: any) => void, numberOfCards: number = 10) {
    console.log(searchString)
    if (searchString && UserStorage.userIDForRecombee) {
        // @ts-ignore
        recombeeClient.send(new recombee.SearchItems(
                String(UserStorage.userIDForRecombee),
                searchString,
                numberOfCards,
                {
                    'scenario': 'Search-Card',
                    'returnProperties': true,
                    'cascadeCreate': true,
                    includedProperties: ['title'],
                    'filter': filterString || undefined
                }
            ),
            (err, matches) => {
                // callback(matches)
                if (callBackFn) {
                    callBackFn(matches)
                }
                // AISObject.convertMatchToCardData(matches)
            }
        );
    } else {
        getRecommendedItemToUser("-1", filterString, callBackFn, numberOfCards)
    }
}

export async function getRecommendedItemToUser(
    userId: string,
    filterString: string | undefined = undefined,
    callBackFn?: (data: any) => void,
    numberOfCards: number = 10
) {
    // @ts-ignore
    recombeeClient.send(new recombee.RecommendItemsToUser(userId,
            numberOfCards,
            {
                'returnProperties': true,
                'cascadeCreate': true,
                includedProperties: ['title'],
                'filter': filterString || undefined
            }
        ),
        (err, matches) => {
            // callback(matches)
            if (callBackFn) {
                callBackFn(matches)
            }
            // AISObject.convertMatchToCardData(matches)
        }
    );
}

export async function selectRecommendedCardReport(recommendationID: string, itemId) {
    if (recommendationID && itemId) {
        // @ts-ignore
        recombeeClient.send(new recombee.AddDetailView(UserStorage.userIDForRecombee, itemId, {
            'recommId': recommendationID
        }));
    }
}





