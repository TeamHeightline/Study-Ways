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
                    id
                    userName
                    isLogin
                    statistic
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
                statistic
                question{
                    id
                    text
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