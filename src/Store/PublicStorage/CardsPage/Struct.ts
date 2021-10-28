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

