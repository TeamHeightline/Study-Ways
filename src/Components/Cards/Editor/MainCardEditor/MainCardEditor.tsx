import React, {useState} from "react";
import CardMicroView from "../../CardView/#CardMicroView";
import {Col, Row, Spinner} from "react-bootstrap";
import CardEditByID from "../CardEditByID/CardEditByID";
import {AuthorSelector} from "./#AuthorSelector";
import CreateNewCard from "./#CreateNewCard";
import {useQuery} from "@apollo/client";
import {gql} from "graphql.macro";
import {ContentTypeSelector} from "./#ContentTypeSelector";
import {ThemeSelector} from "./#ThemeSelector";

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

const CHECK_USER_STATUS = gql`
    query CHECK_USER_STATUS{
        me{
            id
            username
            userAccessLevel
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
    const {data: user_data} = useQuery(CHECK_USER_STATUS)

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
    if(!card_data || !user_data){
        return (
            <Spinner animation="border" variant="success" className=" offset-6 mt-5"/>
        )
    }
    // if(user_data.me.userAccessLevel !== "TEACHER" && user_data.me.userAccessLevel !== "ADMIN"){
    //     return (
    //         <Alert severity="error">
    //             <AlertTitle>Доступ ограничен</AlertTitle>
    //             Вы не обладаете достаточными правами, чтобы просматривать этот раздел, для дополнитльной информации обратитесь к администрации
    //         </Alert>
    //     )
    // }
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
                <CreateNewCard className="mt-5 ml-3"/>
                {cardsDataAfterSelectAuthor && cardsDataAfterSelectAuthor.map((e) =>{
                    return(<CardMicroView key={e.id + "CardKey"} cardID={e.id}  className="mt-5 ml-3"
                                   onChange={selectCardForEditHandle}/>)
                })}
            </Row>
        </div>
    )
}
