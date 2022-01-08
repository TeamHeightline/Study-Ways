import {gql} from "@apollo/client";

export const ALL_QUESTIONS_STATISTIC = gql`
    query{
        me{
            questionSet{
                id
                text
                answers{
                    id
                    isTrue
                    text
                }
                detailquestionstatisticSet{
                    questionHasBeenCompleted
                    isUseexammode
                    id
                    userName
                    isLogin
                    statistic
                    maxSumOfAnswersPoint
                    createdAt
                    questionSequence{
                        id
                    }
                    question{
                        id
                    }
                }
            }
           
        }
    }`

export const MY_QUESTION_SEQUENCES = gql`
    query{
            me{
                questionsequenceSet{
                    id
                    name
                    sequenceData
                    description
                }
            }
    }
`

export const ALL_QUESTION_SEQUENCE = gql`
    query{
        questionSequence{
            id
            name
            sequenceData
            description
        }       
    }`


export const GET_QUESTION_DATA_BY_ID = gql`
    query GET_QUESTION_DATA_BY_ID($id: ID!){
        questionById(id: $id){
            id
            text
            videoUrl
            detailquestionstatisticSet{
                id
                userName
                isLogin
                createdAt
                statistic
                isUseexammode
                questionHasBeenCompleted
                question{
                    id
                    text
                }
                questionSequence{
                    id
                }
            }
            answers{
                id
                isTrue
                text
            }
        }
    }
`

export const GET_ALL_DETAIL_STATISTIC = gql`
    query GET_ALL_DETAIL_STATISTIC{
        question{
            id
            text
            answers{
                id
                isTrue
                text
            }
            detailquestionstatisticSet{
                questionHasBeenCompleted
                createdAt
                isUseexammode
                id
                userName
                isLogin
                statistic
                maxSumOfAnswersPoint
                questionSequence{
                    id
                }
                question{
                    id
                }
            }
        }
    }`