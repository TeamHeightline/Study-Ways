import {gql} from "@apollo/client";

export const LOAD_ATTEMPTS_ID = gql`
    query LOAD_ATTEMPTS_ID($questions: [String]!, $page: Int!, $userName: String!, $afterTime: DateTime!, 
        $onlyInExam: Boolean!, $onlyInQs: Boolean!){
        detailStatIdArray(page: $page, questions: $questions, userName: $userName, afterTime: $afterTime, 
            onlyInExam: $onlyInExam, onlyInQs: $onlyInQs){
            IDs,
            numPages,
            activePage
        }
    }
    `

export const GET_QUESTION_TEXT_BY_ID = gql`
    query GET_QUESTION_TEXT_BY_ID($id: ID!){
        questionById(id: $id){
            id
            text
        }
    }
    `