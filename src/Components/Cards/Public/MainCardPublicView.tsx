import React, {useState} from 'react'
import {useQuery} from "@apollo/client";
import {Col, Row, Spinner} from "react-bootstrap";
import {gql} from "graphql.macro";
import CardMicroView from "../CardView/#CardMicroView";
import ThemeSelector from "../Editor/MainCardEditor/#ThemeSelector";
import ContentTypeSelector from "../Editor/MainCardEditor/#ContentTypeSelector";
import AuthorSelector from "../Editor/MainCardEditor/#AuthorSelector";
import Card from "../Card"
const GET_ALL_CARDS = gql`
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

export default function MainCardPublicView({...props}: any){
    const [isCardOpen, setIsCardOpen] = useState(false)
    const [selectedCardID, setSelectedCardID] = useState(0)
    const [cardsDataAfterSelectTheme, setCardsDataAfterSelectTheme] = useState()
    const [cardsDataAfterSelectContentType, setCardsDataAfterSelectContentType] = useState()
    const [cardsDataAfterSelectAuthor, setCardsDataAfterSelectAuthor] = useState<any>()
    const {data: cards_data} = useQuery(GET_ALL_CARDS)

    if(!cards_data){
        return (
            <Spinner animation="border" variant="success" className=" offset-6 mt-5"/>
        )
    }
    // console.log(cards_data)
    if(isCardOpen && selectedCardID){
        return (
            <Card id={selectedCardID}
                  ButtonClick={(data) =>{
                      if(data === "Back"){
                          setSelectedCardID(selectedCardID - 1)
                      }
                      if(data === "Next"){
                          setSelectedCardID(Number(selectedCardID) + 1)
                      }
                  }}
                  onChange={(data) =>{
                        if(data === "goBack"){
                            setIsCardOpen(false)
                        }
            }}/>
        )
    }
    return(
        <div {...props}>
            <Row className="ml-1">
                <Col className="ml-5 col-4">
                    <ThemeSelector cards_data={cards_data.card}
                                   changeSelectedData={(data)=>{
                                       setCardsDataAfterSelectTheme(data)
                                   }}/>
                </Col>
                <Col className="col-3">
                    {cardsDataAfterSelectTheme &&
                    <ContentTypeSelector cards_data={cardsDataAfterSelectTheme}
                                         ChangeSelectedData={(data) =>{
                                             // console.log(data)
                                             setCardsDataAfterSelectContentType(data)
                                         }}/>}
                </Col>
                <Col className="ml-2 col-3">
                    {cardsDataAfterSelectContentType &&
                    <AuthorSelector cards_data={cardsDataAfterSelectContentType}
                                    ChangeSelectedData={(data) =>{
                                        // console.log(data)
                                        setCardsDataAfterSelectAuthor(data)
                                    }}/>}
                </Col>
            </Row>
            <Row className="justify-content-around mr-4 ml-4">
                {cardsDataAfterSelectAuthor && cardsDataAfterSelectAuthor.map((sameCard, sIndex) =>{
                    return(
                        <CardMicroView className="mt-4" cardID={sameCard.id} key={sIndex+ "CardMicroView"}
                        onChange={ async (data) =>{
                            await setSelectedCardID(data)
                            await setIsCardOpen(true)
                        }}/>
                    )
                })}
            </Row>
        </div>
    )
}