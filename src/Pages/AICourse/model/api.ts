import recombeeClient from "../../../Store/RecombeeClient/recombee-client";
// @ts-ignore
import recombee, {RecommendItemsToItem} from 'recombee-js-api-client';
import {UserStorage} from "../../../Store/UserStore/UserStore";

const NUMBER_OF_CARDS = 5

export async function getCardsBySearch(searchString: string): Promise<number[]> {
    return new Promise((res, rej) => {
        // @ts-ignore
        recombeeClient.send(new recombee.SearchItems(
                String(UserStorage.userIDForRecombee),
                searchString,
                NUMBER_OF_CARDS,
                {
                    'scenario': 'Search-Card',
                    'returnProperties': true,
                    'cascadeCreate': true,
                    includedProperties: ['title']
                }
            ),
            (err, matches) => {
                if (err) {
                    rej(err)
                    return
                }
                res(matches?.recomms?.map((recommItem) => recommItem?.id))
            }
        );
    })
}

export async function getNextCards(cardID: number): Promise<number[]> {
    return new Promise((res, rej) => {
        recombeeClient.send(new RecommendItemsToItem(String(cardID), String(UserStorage.userIDForRecombee), NUMBER_OF_CARDS),
            (err, matches) => {
                if (err) {
                    rej(err)
                    return
                }
                res(matches?.recomms?.map((recommItem) => recommItem?.id))
            })
    })
}