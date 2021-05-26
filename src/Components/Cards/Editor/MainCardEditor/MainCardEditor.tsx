import React, {useState} from "react";
import CardMicroView from "../../CardView/#CardMicroView";
import {Row, Spinner} from "react-bootstrap";
import CardEditByID from "../CardEditByID/CardEditByID";
import AuthorSelector from "./#AuthorSelector";
import CreateNewCard from "./#CreateNewCard";
import {useQuery} from "@apollo/client";
import {gql} from "graphql.macro";
import _ from 'lodash'

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
    const [sortedCardsData, setSortedCardsData] = useState()
    const {data: card_data} = useQuery(GET_ALL_CARD_DATA, {
        pollInterval: 3000,

    })
    const selectCardFroEditHandle = async(e) =>{
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
    console.log(_.filter(card_data.me.cardSet, ((obj) =>{
        if (obj.author.length === 0){
            return false
        }
       return (_.find(obj.author, (item) => {
           return(item.id == 2)
       }))
    })))
    return(
        <div className="col-12">
            <Row className="ml-1">
                <AuthorSelector className="ml-5"/>
            </Row>
            <Row className="mr-2 ml-2">
                <CreateNewCard className="mt-5 ml-5"/>
                {_.sortBy(card_data.me.cardSet, 'id').reverse().map((e) =>{
                    return(<CardMicroView key={e.id + "CardKey"} cardID={e.id}  className="mt-5 ml-5"
                                   onChange={selectCardFroEditHandle}/>)
                })}
                {/*<CardMicroView id={1} className="mt-5 ml-5" onChange={selectCardFroEditHandle}/>*/}
                {/*<CardMicroView id={1} className="mt-5 ml-5" onChange={selectCardFroEditHandle}/>*/}
                {/*<CardMicroView id={1} className="mt-5 ml-5" onChange={selectCardFroEditHandle}/>*/}
                {/*<CardMicroView id={1} className="mt-5 ml-5" onChange={selectCardFroEditHandle}/>*/}
                {/*<CardMicroView id={1} className="mt-5 ml-5" onChange={selectCardFroEditHandle}/>*/}
            </Row>
        </div>
    )
}