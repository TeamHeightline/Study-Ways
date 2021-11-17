import {gql} from "graphql.macro";

export const GET_ALL_UNSTRUCTURED_THEME = gql`
    query GET_ALL_UNSTRUCTURED_THEME{
        unstructuredTheme{
            id
            text
            parent{
                id
            }
        }
    }`

export const UpdateSubTheme = gql`
    mutation UpdateTheme(
        $text: String!,
        $id: ID!,
        $parent: ID!
    ){
        updateUnstructuredTheme(input: {
            text: $text,
            id: $id,
            parent: $parent
        }){
            clientMutationId
            theme{
                id
            }
        }
    }
    `

export const CreateTheme = gql`
    mutation CreateTheme(
        $text: String!,
        $parent: ID!
    ){
        unstructuredTheme(input: {
            text: $text,
            createdBy: 0,
            parent: $parent,
        }){
            clientMutationId
            unstructuredTheme{
                id
            }
        }
    }
    `