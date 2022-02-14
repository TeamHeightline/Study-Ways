import makeStyles from '@mui/styles/makeStyles';
import {gql} from "@apollo/client/core";

export const useStyles = makeStyles(() => ({
    root: {
        display: 'flex',
        width: "400px",
        height: "170px"
    },
    details: {
        display: 'flex',
        flexDirection: 'column',
    },
    content: {
        flex: '1 0 auto',
        alignItems: 'left',
    },
    cover: {
        width: 200,
    },
    controls: {
        display: 'flex',
        alignItems: 'left',
        paddingLeft: 12,
        paddingBottom: 12,
    },
    playIcon: {
        height: 38,
        width: 38,
    },
}));

export const GET_CARD_FOR_MICRO_VIEW_BY_ID = gql`
    query GET_CARD_FOR_MICRO_VIEW_BY_ID($id: ID!){
        cardById(id: $id){
            id
            title
            cardContentType
            videoUrl
            hardLevel
            connectedTheme {
                id
                text
            }
            author{
                id
                name
            }

        }
    }`
export const SHOW_CARD_BY_ID = gql`
    query SHOW_CARD_BY_ID($id: ID!){
        cardById(id: $id){
            id
            videoUrl
            title
            text
            cardUp {
                id
            }
            cardNext {
                id
            }
            cardDown {
                id
            }
            cardBefore {
                id
            }
            siteUrl
            testInCard{
                id
            }
            testBeforeCard{
                id
            }
            isCardUseTestInCard
            isCardUseTestBeforeCard
            isCardUseMainText
            isCardUseMainContent
            isCardUseAdditionalText
            isCardUseCopyright
            isCardUseArrowNavigation
            arrowBefore
            arrowDown
            arrowUp
            arrowNext
            copyright
            cardContentType
            additionalText
            author{
                name
                id
            }

        }
    }`

export const GET_ALL_COURSE = gql`
    query GET_ALL_COURSE{
        cardCourse{
            id
            courseData
            name
        }
    }
`

export const CARD_VIEW_REPORT = gql`
    mutation CARD_VIEW_REPORT($card_id: Int){
        cardDetailView(cardId: $card_id){
            ok
        }
    }
`