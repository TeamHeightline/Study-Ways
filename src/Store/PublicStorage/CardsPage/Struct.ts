import {gql} from "graphql.macro";

export const GET_ALL_CARDS = gql`
    query GET_ALL_CARDS{
        card{
            id
            author{
                id
                name
            }
            subTheme{
                id
                name
            }
            hardLevel
            cardContentType
        }
    }`

export const GET_THEMES = gql`
    query GET_THEMES{
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
    }`

export const GET_CARDS_ID_BY_SEARCH_STRING= gql`
    query GET_CARDS_ID_BY_SEARCH_STRING($searchString: String!){
        ftSearchInCards(searchString: $searchString){
            id
            author{
                id
                name
            }
            subTheme{
                id
                name
            }
            cardContentType
            hardLevel
        }
    }
`

