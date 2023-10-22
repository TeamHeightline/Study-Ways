import {gql} from "@apollo/client";

export const GET_CARD_ID_BY_SEARCHING_PARAMS = gql`
    query GET_CARD_ID_BY_SEARCHING_PARAMS(
        $cardType: Int,
        $createdByMe: Boolean,
        $cardAuthor: ID,
        $cardHardLevel: Int,
        $smartSearchString: String,
        $connectedTheme: String,
        $activePage: Int
        
    ){
        cardIdResolverForSelector(
            createdByMe: $createdByMe, 
            cardType: $cardType, 
            cardAuthor: $cardAuthor, 
            cardHardLevel:$cardHardLevel, 
            smartSearchString: $smartSearchString, 
            connectedTheme: $connectedTheme, 
            activePage: $activePage){
            IDs
            numPages
            activePage
        }
    }
    `

export const GET_CONNECTED_THEME= gql`
    query GET_CONNECTED_THEME{
        unstructuredTheme {
            id
            text
            parent {
                id
            }
        }
    }`


export const CREATE_NEW_CARD = gql`
    mutation CREATE_NEW_CARD{
        card(input: {cardContentType: "0", isCardUseMainContent: true, isCardUseMainText: true,
            title: "Название карточки по умолчанию", createdBy: 0, text: "Описание карточки"}){
            errors{
                field
            },
            card{
                id
            }
        }
    }`