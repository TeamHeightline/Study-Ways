import {gql} from "@apollo/client";

export const GET_CARD_DATA_BY_ID = gql`query GET_CARD_DATA_BY_ID($id: ID!){
    cardById(id: $id){
        id
        author{
            id
        }
        subTheme{
            id
        }
        copyright
        isCardUseAdditionalText
        isCardUseMainContent
        isCardUseMainText
        isCardUseTestBeforeCard
        isCardUseTestInCard
        isCardUseCopyright
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
        arrowBefore
        arrowUp
        arrowDown
        arrowNext
    }
}`

export const GET_OWN_AUTHOR = gql`
    query GET_OWN_AUTHOR{
        me{
            cardauthorSet{
                id
                name
            }
        }
    }
`
export const QUESTION_BY_ID = gql`
    query QUESTION_BY_ID($id: ID!){
        questionById(id: $id){
            text
        }
    }`

export const UPDATE_CARD = gql`
    mutation UPDATE_CARD($id: ID, $author: [ID], $additionalText:  String, $cardContentType: String!, $subTheme: [ID]!,
        $title: String!, $text: String, $videoUrl: String, $testInCard: ID, $testBeforeCard: ID, $siteUrl: String,
        $isCardUseAdditionalText: Boolean, $isCardUseMainContent: Boolean, $isCardUseMainText: Boolean,
        $isCardUseTestBeforeCard: Boolean, $isCardUseTestInCard: Boolean, $isCardUseCopyright: Boolean,
        $copyright: String
    ){
        card(input: {id: $id, author: $author, subTheme: $subTheme,  additionalText: $additionalText, cardContentType: $cardContentType,
            createdBy: 0, title: $title, text: $text, videoUrl: $videoUrl, testInCard: $testInCard, testBeforeCard: $testBeforeCard,
            siteUrl: $siteUrl, isCardUseAdditionalText: $isCardUseAdditionalText, isCardUseMainContent: $isCardUseMainContent,
            isCardUseMainText: $isCardUseMainText, isCardUseTestBeforeCard: $isCardUseTestBeforeCard, isCardUseTestInCard: $isCardUseTestInCard,
            isCardUseCopyright: $isCardUseCopyright, copyright: $copyright}){
            errors{
                field
                messages
            }
        }
    }`

export const GET_THEMES = gql`
    query GET_THEMES{
        cardGlobalTheme{
            id
            name
            cardthemeSet{
                id
                name
                cardsubthemeSet{
                    id
                    name
                }
            }
        }
    }`

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;

export const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: ITEM_HEIGHT * 7.5 + ITEM_PADDING_TOP,
            // width: "250vw",
        },
    },
};