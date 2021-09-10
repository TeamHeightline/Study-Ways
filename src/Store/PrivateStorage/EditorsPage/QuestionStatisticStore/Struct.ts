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
                    userName
                    isLogin
                    statistic
                }
            }
           
        }
    }`
