import {gql} from "@apollo/client";
// @ts-ignore
import recombee from 'recombee-js-api-client';
import recombeeClient from "../../../../../../Store/RecombeeClient/recombee-client";
import {useEffect, useState} from 'react'
import {UserStorage} from "../../../../../../Store/UserStore/UserStore";
import axiosClient from "../../../../../../ServerLayer/QueryLayer/config";

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
        recombeeClient.send(new recombee.SearchItems(
                UserStorage.userIDForRecombee,
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
        recombeeClient.send(new recombee.AddDetailView(UserStorage.userIDForRecombee, itemId, {
            'recommId': recommendationID
        }));
    }
}





