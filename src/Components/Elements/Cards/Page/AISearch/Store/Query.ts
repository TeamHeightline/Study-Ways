import {gql} from "@apollo/client";

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