import {gql} from "graphql.macro";

export const GET_QS_DATA_BY_ID = gql`
    query GET_QS_DATA_BY_ID($id: ID!){
        questionSequenceById(id: $id){
            id
            name
            sequenceData
        }
    }
    `

export const GET_QUESTION_DATA_BY_ID = gql`
    query GET_QUESTION_DATA_BY_ID($id: ID!){
        questionById(id: $id){
            id
            numberOfShowingAnswers
            text
            videoUrl
            answers{
                id
                checkQueue
                hardLevelOfAnswer
                helpTextv1
                helpTextv2
                helpTextv3
                isTrue
                text
                videoUrl
                isDeleted
                isInvisible
                isRequired
            }
        }
    }
    `
export const GET_ENCRYPT_QUESTION_DATA_BY_ID = gql`
    query GET_ENCRYPT_QUESTION_DATA_BY_ID($id: ID!){
        eqbi(id: $id){
            qbs
            abs
        }
    }
`

export const SAVE_DETAIL_STATISTIC = gql`
    mutation SAVE_DETAIL_STATISTIC($question: ID!, $userName: String, $isLogin: Boolean, $statistic: GenericScalar, 
        $isUseexammode: Boolean, $questionHasBeenCompleted: Boolean, $maxSumOfAnswersPoint: Int){
        createDetailQuestionStatistic(input: {
            question: $question,
            userName: $userName,
            isLogin: $isLogin,
            statistic: $statistic,
            isUseexammode: $isUseexammode,
            maxSumOfAnswersPoint: $maxSumOfAnswersPoint,
            questionHasBeenCompleted: $questionHasBeenCompleted,
#            questionSequence: $questionSequence
        }){
            clientMutationId
        }
    }
    `

export const SAVE_DETAIL_STATISTIC_WITH_QS = gql`
    mutation SAVE_DETAIL_STATISTIC($question: ID!, $userName: String, $isLogin: Boolean, $statistic: GenericScalar,
        $isUseexammode: Boolean, $questionSequence: ID, $questionHasBeenCompleted: Boolean, $maxSumOfAnswersPoint: Int){
        createDetailQuestionStatistic(input: {
            question: $question,
            userName: $userName,
            isLogin: $isLogin,
            statistic: $statistic,
            isUseexammode: $isUseexammode,
            questionSequence: $questionSequence,
            questionHasBeenCompleted: $questionHasBeenCompleted,
            maxSumOfAnswersPoint: $maxSumOfAnswersPoint
        }){
            clientMutationId
        }
    }
`