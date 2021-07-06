import {gql} from "graphql.macro";

 export const GET_ALL_CARDS = gql`
    query GET_ALL_CARDS{
        card{
            id
            author{
                id
                name
            }
            subTheme{
                id
                name
            }
            isCardUseAdditionalText
            isCardUseMainContent
            isCardUseMainText
            isCardUseTestBeforeCard
            isCardUseTestInCard
            cardContentType
            text
            title
            additionalText
            siteUrl
            videoUrl
            testBeforeCard{
                id
            }
            testInCard{
                id
            }
        }
    }`