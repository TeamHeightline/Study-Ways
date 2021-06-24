import {gql} from "graphql.macro";

export const  GET_MY_USER_TEST_THEMES = gql`
    query GET_MY_USER_TEST_THEMES{
        me{
            questionthemesSet{
                name
                id
            }
        }
    }
`
export const UPDATE_USER_TEST_THEME = gql`
    mutation UPDATE_USER_TEST_THEME($name: String!, $id: ID!){
        updateQuestionThemes(input: {name: $name, createdBy: 0, id: $id}){
            clientMutationId
        }
    }`
export const CREATE_NEW_USER_TEST_THEME = gql`
    mutation CREATE_NEW_USER_TEST_THEME($name: String!){
        createQuestionThemes(input: {name: $name, createdBy: 0}){
            clientMutationId
        }
    }`

export const columnsForAuthorsDataGrid = [
    {field: 'id', headerName: 'ID', width: 70},
    {field: 'name', headerName: 'Тема вопросов/тестов', width: 500},
]
