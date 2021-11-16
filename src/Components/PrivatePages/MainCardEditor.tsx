import React, {useState} from "react";
import CardMicroView from "../Elements/Cards/CardView/#CardMicroView";
import { Row} from "react-bootstrap";
import CardEditByID from "../Elements/Cards/Editor/CardEditByID/CardEditByID";
import {AuthorSelector} from "../Elements/Cards/Editor/MainCardEditor/#AuthorSelector";
import CreateNewCard from "../Elements/Cards/Editor/MainCardEditor/#CreateNewCard";
import {useQuery} from "@apollo/client";
import {gql} from "graphql.macro";
import {ContentTypeSelector} from "../Elements/Cards/Editor/MainCardEditor/#ContentTypeSelector";
import {ThemeSelector} from "../Elements/Cards/Editor/MainCardEditor/#ThemeSelector";
import {sort} from "fast-sort";
import {Pagination} from '@mui/material';
import {CircularProgress, Grid} from "@mui/material";
import {isMobileHook} from "../../CustomHooks/isMobileHook";

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
                cardContentType
            }
        }
    }`

const numbersOfCardsOnPage = 98
export default function MainCardEditor({...props}: any){
    const [isEditNow, setIsEditNow] = useState(false)
    const [selectedCardID, setSelectedCardID] = useState(0)
    const [cardsDataAfterSelectTheme, setCardsDataAfterSelectTheme] = useState()
    const [cardsDataAfterSelectContentType, setCardsDataAfterSelectContentType] = useState()
    const [cardsDataAfterSelectAuthor, setCardsDataAfterSelectAuthor] = useState<any>()
    const [activePageNumber, setActivePageNumber] = useState(1)
    const isMobile = isMobileHook()

    const {data: card_data, refetch, loading} = useQuery(GET_ALL_CARD_DATA, {
        fetchPolicy: "cache-and-network"
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
    if(loading){
        return (
            <Grid container justifyContent="center" style={{marginTop: 12}}>
                <Grid item>
                    <CircularProgress />
                </Grid>
            </Grid>
        );
    }
    return (
        <div style={{paddingLeft: 24, overflowX: 'auto', paddingTop: isMobile? 0: 24}}>
            <Grid container justifyContent={"space-around"} alignItems={"center"} rowSpacing={1} >
                <Grid item xs={12} md={3} >
                    <ThemeSelector cards_data={card_data?.me?.cardSet}
                                   changeSelectedData={(data)=>{
                                       setCardsDataAfterSelectTheme(data)
                                   }}/>
                </Grid>
                <Grid item xs={12} md={3}>
                    {cardsDataAfterSelectTheme &&
                    <ContentTypeSelector cards_data={cardsDataAfterSelectTheme}
                                         changeSelectedData={(data) =>{
                                             setCardsDataAfterSelectContentType(data)
                                         }}/>}
                </Grid>
                <Grid item xs={12} md={3}>
                    {cardsDataAfterSelectContentType &&
                    <AuthorSelector cards_data={cardsDataAfterSelectContentType}
                                    changeSelectedData={(data) =>{
                                        setCardsDataAfterSelectAuthor(data)
                                    }}/>}
                </Grid>
            </Grid>
            <Row className="justify-content-around col-12" style={{overflowX: 'auto'}}>
                <CreateNewCard className="mt-3 col-12 col-md-3 ml-1" onCreate={() =>refetch()}/>
                {cardsDataAfterSelectAuthor && sort(cardsDataAfterSelectAuthor)
                    .desc((card: any) => Number(card?.id))
                    .slice((activePageNumber - 1)* numbersOfCardsOnPage, activePageNumber* numbersOfCardsOnPage)
                    .map((card: any) =>{
                    return(
                            <CardMicroView  cardID={card?.id} key={card?.id + "CardKey"}
                                            isNowEditableCard={card?.id === selectedCardID}
                                            isEditNow={isEditNow}
                                            className="mt-3 ml-1 col-12 col-md-3"
                                            onChange={() => void(0)}
                                            onClick={()=> selectCardForEditHandle(card?.id)}
                            />
                        )
                })}
            </Row>
            <Grid container justifyContent="center" style={{marginTop: 12, overflowX: 'auto'}}>
                <Grid item xs="auto">
                    <Pagination
                        shape="rounded"
                        size="large"
                        count={Math.ceil(cardsDataAfterSelectAuthor?.length/numbersOfCardsOnPage)}
                        page={activePageNumber}
                        onChange={(_, value) => setActivePageNumber(value)}/>
                </Grid>
            </Grid>
        </div>
    );
}
