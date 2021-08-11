import {gql} from "graphql.macro";

export const GET_MY_USER_TEST_AUTHORS = gql`
    query GET_MY_USER_TEST_AUTHORS{
        me{
            questionauthorSet{
                id
                name
            }
        }
    }`

export const UPDATE_USER_TEST_AUTHOR = gql`
    mutation UPDATE_USER_TEST_AUTHOR($name: String!, $id: ID!){
        updateQuestionAuthor(input: {name: $name, id: $id, createdBy: 0}){
            clientMutationId
        }
    }`
export const CREATE_NEW_USER_TEST_AUTHOR = gql`
    mutation CREATE_NEW_USER_TEST_AUTHOR($name: String!){
        createQuestionAuthor(input: {name: $name, createdBy: 0}){
            clientMutationId
        }
    }`
export const columnsForAuthorsDataGrid = [
    {field: 'id', headerName: 'ID', width: 70},
    {field: 'name', headerName: 'Автор вопросов/тестов', width: 500},
]
