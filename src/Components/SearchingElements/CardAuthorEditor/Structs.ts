import {gql} from "graphql.macro";

export const GET_CARD_AUTHOR = gql`
    query GET_CARD_AUTHOR{
        me{
            cardauthorSet{
                id
                name
            }
        }
    }`
export const UPDATE_CARD_AUTHOR = gql`
    mutation UPDATE_CARD_AUTHOR($name: String!, $id: ID!){
        cardAuthor(input: {name: $name, id: $id, createdBy: 0}){
            clientMutationId
        }
    }`
export const CREATE_NEW_AUTHOR = gql`
    mutation CREATE_NEW_AUTHOR($name:String!){
        cardAuthor(input: {name: $name, createdBy: 0, }){
            clientMutationId
        }
    }`