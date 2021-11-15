import {gql} from "graphql.macro";
import {CardThemeNode, Scalars} from "../../../../SchemaTypes";

export const GET_MY_SUB_THEMES = gql`
    query GET_MY_SUB_THEMES{
        me{
            cardsubthemeSet{
                id
                name
            }
        }
    }`
export const GET_MY_THEMES = gql`
    query GET_MY_THEMES{
        me{
            cardthemeSet{
                id
                name
            }
        }
    }`
export const GET_MY_GLOBAL_THEMES = gql`
    query GET_MY_GLOBAL_THEMES{
        me{
            globalcardthemeSet{
                id
                name
            }
        }
    }`
export type GlobalCardThemeNode = {
    __typename?: "GlobalCardThemeNode"
    cardthemeSet: Array<CardThemeNode>
    id: Scalars["ID"]
    name: Scalars["String"]
}

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
    mutation UPDATE_CARD_SUB_THEME($name: String!, $id: ID!){
        cardSubTheme(input: {name: $name, id: $id, createdBy: 0}){
            clientMutationId
        }
    }
    `
export const UPDATE_CARD_THEMES = gql`
    mutation UPDATE_CARD_THEMES($name: String!, $id: ID!){
        cardTheme(input: {name: $name, id: $id, createdBy: 0, }){
            clientMutationId
        }
    }`

export const UPDATE_CARD_GLOBAL_THEME = gql`
    mutation UPDATE_CARD_GLOBAL_THEME($name: String!, $id: ID!){
        globalCardTheme(input: {name: $name, id: $id, createdBy: 0, }){
            clientMutationId
        }
    }`

export const CREATE_SUB_THEME = gql`
    mutation CREATE_SUB_THEME($name: String!, $theme: ID!){
        cardSubTheme(input: {name: $name, theme: $theme, createdBy: 0}){
            clientMutationId
        }
    }`

export const CREATE_THEME = gql`
    mutation CREATE_THEME($name: String!, $globalTheme: ID!){
        cardTheme(input: {createdBy: 0, name: $name, globalTheme: $globalTheme}){
            clientMutationId
        }
    }`

export const CREATE_GLOBAL_THEME = gql`
    mutation CREATE_GLOBAL_THEME($name: String!){
        globalCardTheme(input: {name: $name, createdBy: 0}){
            clientMutationId
        }
    }`