import {gql} from "@apollo/client";
// @ts-ignore
import recombee from 'recombee-js-api-client';
import recombeeClient from "../../../../../../Store/RecombeeClient/recombee-client";
import {useEffect, useState} from 'react'
import {AISObject} from "./AISearch";

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

export async function getAutocompleteCardDataAsync(searchString: string) {
    recombeeClient.send(new recombee.SearchItems('-1', searchString, 10,
            {
                'scenario': 'Search-Card',
                'returnProperties': true,
                'cascadeCreate': true,
                includedProperties: ['title']
            }
        ),
        (err, matches) => {
            // callback(matches)
            AISObject.convertMatchToCardData(matches)
        }
    );
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
