import {gql} from "graphql.macro";
import {number} from "prop-types";
import {CardThemeNode, Scalars} from "../../../../SchemaTypes";

export const GET_MY_CARD_THEMES = gql`
    query GET_MY_CARD_THEMES{
        me{
            globalcardthemeSet{
                id
                name
                cardthemeSet{
                    id
                    name
                    cardsubthemeSet{
                        id
                        name
                    }
                }
            }
        }
    }
`

export type GlobalCardThemeNode = {
    __typename?: "GlobalCardThemeNode"
    cardthemeSet: Array<CardThemeNode>
    id: Scalars["ID"]
    name: Scalars["String"]
}
export type CARD_SUB_THEMES =
    [
        {name: string,
        id: string}
    ]


export const ALL_CARD_THEMES = gql`
    query ALL_CARD_THEMES{
        cardGlobalTheme{
            id
            name
            cardthemeSet{
                id
                name
                cardsubthemeSet{
                    id
                    name
                }
            }
        }
    }
`
export const UPDATE_CARD_SUB_THEME = gql`
    mutation UPDATE_CARD_SUB_THEME{
        cardSubTheme(input: {name: "", id: 0, createdBy: 0}){
            clientMutationId
        }
    }
    `