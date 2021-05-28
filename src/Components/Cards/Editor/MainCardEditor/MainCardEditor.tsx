import React, {useState} from "react";
import CardMicroView from "../../CardView/#CardMicroView";
import {Row, Spinner} from "react-bootstrap";
import CardEditByID from "../CardEditByID/CardEditByID";
import AuthorSelector from "./#AuthorSelector";
import CreateNewCard from "./#CreateNewCard";
import {useQuery} from "@apollo/client";
import {gql} from "graphql.macro";
import _ from 'lodash'
import ContentTypeSelector from "./#ContentTypeSelector";

const GET_ALL_CARD_DATA = gql`
    query GET_CARD_DATA{
        me{
            cardSet{
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
        }
    }`
export default function MainCardEditor(){
    const [isEditNow, setIsEditNow] = useState(false)
    const [selectedCardID, setSelectedCardID] = useState(0)
    const [cardsDataAfterSelectContentType, setCardsDataAfterSelectContentType] = useState()
    const [cardsDataAfterSelectAuthor, setCardsDataAfterSelectAuthor] = useState()
    const {data: card_data} = useQuery(GET_ALL_CARD_DATA, {
        pollInterval: 3000,

    })
    const selectCardForEditHandle = async(e) =>{
        await setSelectedCardID(e)
        console.log("select" + e)
        await setIsEditNow(true)
    }
    if (isEditNow){
        return (
            <CardEditByID cardId={selectedCardID} onChange={(e) =>{
                if (e === "goBack"){
                    setIsEditNow(false)
                }
            }}/>
        )
    }
    if(!card_data){
        return (
            <Spinner animation="border" variant="success" className=" offset-6 mt-5"/>
        )
    }
    return(
        <div className="col-12">
            <Row className="ml-1">
                <ContentTypeSelector className="ml-5 col-4" cards_data={card_data.me.cardSet}
                onChangeSelectedData={(data) =>{
                    console.log(data)
                    setCardsDataAfterSelectContentType(data)
                }}/>
                {cardsDataAfterSelectContentType &&
                <AuthorSelector cards_data={cardsDataAfterSelectContentType} className="ml-2 col-4"
                                onChangeSelectedData={(data) =>{
                                    console.log(data)
                                    setCardsDataAfterSelectAuthor(data)
                                }}/>}

            </Row>
            <Row className="mr-2 ml-2">
                <CreateNewCard className="mt-5 ml-5"/>
                {cardsDataAfterSelectAuthor && _.sortBy(cardsDataAfterSelectAuthor, 'id').reverse().map((e) =>{
                    return(<CardMicroView key={e.id + "CardKey"} cardID={e.id}  className="mt-5 ml-5"
                                   onChange={selectCardForEditHandle}/>)
                })}
            </Row>
        </div>
    )
}
