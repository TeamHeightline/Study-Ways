import React, {useState} from "react";
import CardMicroView from "../Elements/Cards/CardView/#CardMicroView";
import {Col, Row, Spinner} from "react-bootstrap";
import CardEditByID from "../Elements/Cards/Editor/CardEditByID/CardEditByID";
import {AuthorSelector} from "../Elements/Cards/Editor/MainCardEditor/#AuthorSelector";
import CreateNewCard from "../Elements/Cards/Editor/MainCardEditor/#CreateNewCard";
import {useQuery} from "@apollo/client";
import {gql} from "graphql.macro";
import {ContentTypeSelector} from "../Elements/Cards/Editor/MainCardEditor/#ContentTypeSelector";
import {ThemeSelector} from "../Elements/Cards/Editor/MainCardEditor/#ThemeSelector";
import {sort} from "fast-sort";

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

export default function MainCardEditor({...props}: any){
    const [isEditNow, setIsEditNow] = useState(false)
    const [selectedCardID, setSelectedCardID] = useState(0)
    const [cardsDataAfterSelectTheme, setCardsDataAfterSelectTheme] = useState()
    const [cardsDataAfterSelectContentType, setCardsDataAfterSelectContentType] = useState()
    const [cardsDataAfterSelectAuthor, setCardsDataAfterSelectAuthor] = useState<any>()
    const {data: card_data, refetch} = useQuery(GET_ALL_CARD_DATA, {
        // pollInterval: 3000,
    })

    const selectCardForEditHandle = async(e) =>{
        await setSelectedCardID(e)
        console.log("select" + e)
        await setIsEditNow(true)
        if(props.onSetIsEditNow){
            props.onSetIsEditNow(true)
        }
    }
    if (isEditNow){
        return (
            <CardEditByID cardId={selectedCardID}
                          returnStateOfSave={(e) =>{
                              if(props.returnStateOfSave){
                                  props.returnStateOfSave(e)
                              }
                          }}
                          onChange={(e) =>{
                                if (e === "goBack"){
                                    setIsEditNow(false)
                                    if(props.onSetIsEditNow){
                                        props.onSetIsEditNow(false)
                                    }
                                    refetch()
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
                <Col className="ml-5 col-4">
                    <ThemeSelector cards_data={card_data.me.cardSet}
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
            <Row className="mr-2 justify-content-around">
                <CreateNewCard className="mt-5 ml-3" onCreate={() =>refetch()}/>
                {cardsDataAfterSelectAuthor && sort(cardsDataAfterSelectAuthor).desc((card: any) => Number(card?.id))
                    .map((e: any) =>{
                    return(<CardMicroView key={e?.id + "CardKey"} cardID={e?.id}  className="mt-5 ml-3"
                                   onChange={selectCardForEditHandle}/>)
                })}
            </Row>
        </div>
    )
}
