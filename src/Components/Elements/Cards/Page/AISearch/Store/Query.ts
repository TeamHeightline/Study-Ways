import {gql} from "@apollo/client";
// @ts-ignore
import recombee from 'recombee-js-api-client';
import recombeeClient from "../../../../../../Store/RecombeeClient/recombee-client";
import {useEffect, useState} from 'react'

export const GET_PERSONAL_HOME_PAGE = gql`
    query GET_PERSONAL_HOME_PAGE{
        personalCardHomePage {
            IDs
        }
    }
`

export const GET_AI_SEARCH_CARDS = gql`
    query GET_AI_SEARCH_CARDS($searchString: String){
        aiCardSearch(searchString: $searchString){
            IDs
        }
    }`

export async function getAutocompleteCardDataAsync(searchString: string | undefined, filterString: string | undefined = undefined, callBackFn?: (data: any) => void, numberOfCards: number = 10) {
    console.log(searchString)
    if (searchString) {
        recombeeClient.send(new recombee.SearchItems('-1',
                searchString || undefined,
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
        recombeeClient.send(new recombee.AddDetailView("-1", itemId, {
            'recommId': recommendationID
        }));
    }
}


export function useDebounce<T>(value: T, delay?: number): T {
    const [debouncedValue, setDebouncedValue] = useState<T>(value)

    useEffect(() => {
        const timer = setTimeout(() => setDebouncedValue(value), delay || 500)

        return () => {
            clearTimeout(timer)
        }
    }, [value, delay])

    return debouncedValue
}
