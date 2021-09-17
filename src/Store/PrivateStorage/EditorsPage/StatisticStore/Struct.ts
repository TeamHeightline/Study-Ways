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
