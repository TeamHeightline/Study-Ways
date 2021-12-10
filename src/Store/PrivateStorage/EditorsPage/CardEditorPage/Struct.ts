import {gql} from "@apollo/client";


export const GET_CARD_DATA_BY_ID = gql`
    query GET_CARD_DATA_BY_ID($id: ID!){
        cardById(id: $id){
            id
            text
            additionalText
            arrowBefore
            arrowDown
            arrowNext
            arrowUp
            author{id}
            cardContentType
            copyright
            hardLevel
            isCardUseAdditionalText
            isCardUseArrowNavigation
            isCardUseCopyright
            isCardUseMainContent
            isCardUseMainText
            isCardUseTestBeforeCard
            isCardUseTestInCard
            siteUrl
            subTheme{id}
            testBeforeCard{id}
            testInCard{id}
            text
            title
            videoUrl
        }
    }
    `