import React from 'react'
import {Col, Row} from "react-bootstrap";
import CardMicroView from "../Elements/Cards/CardView/#CardMicroView";
import {ThemeSelector} from "../Elements/Cards/Editor/MainCardEditor/#ThemeSelector";
import {ContentTypeSelector} from "../Elements/Cards/Editor/MainCardEditor/#ContentTypeSelector";
import {AuthorSelector} from "../Elements/Cards/Editor/MainCardEditor/#AuthorSelector";
import {CARD} from "../Elements/Cards/Card"
import {CardPageStorage} from "../../Store/PublicStorage/CardsPage/CardPageStorage";
import {observer} from "mobx-react";
import {toJS} from "mobx";
import {Grow} from "@material-ui/core";

export const MainCardPublicView = observer(({...props}: any) =>{

    // if(!CardPageStorage.dataHasBeenGot){
    //     return (
    //         <div className="justify-content-center">
    //             <Spinner animation="border" variant="success" className="mt-5"/>
    //         </div>
    //     )
    // }
    if(CardPageStorage.isOpenCard && CardPageStorage.selectedCardID){
        return (
            <CARD id={CardPageStorage.selectedCardID}/>
        )
    }
    return(
        <div {...props}>
            <Row className="ml-1 mt-3">
                <Col className="ml-lg-5 col-lg-4 col-12">
                    <ThemeSelector openFromPublicView={true}
                                   cards_data={[]}
                                   changeSelectedData={()=>{
                                       void(0)
                                   }}/>

                </Col>
                <Col className="col-lg-3 col-12">
                    {CardPageStorage.cardsDataAfterSelectTheme &&
                    <ContentTypeSelector
                        openFromPublicView={true}
                        cards_data={[]}
                        ChangeSelectedData={() =>{
                             // console.log(data)
                            void(0)
                        }}/>}
                </Col>
                <Col className="ml-lg-2 col-lg-3 col-12">
                    {CardPageStorage.cardsDataAfterSelectContentType &&
                    <AuthorSelector cards_data={[]}
                                    openFromPublicView={true}
                                    ChangeSelectedData={() =>{
                                        void(0)
                                    }}/>}
                </Col>
            </Row>
            <Row className="justify-content-around mr-4 ml-4">
                {toJS(CardPageStorage.cardsDataAfterSelectAuthor) && toJS(CardPageStorage.cardsDataAfterSelectAuthor).map((sameCard: any, sIndex) =>{
                    return(
                        <Grow in={true}  key={sIndex+ "CardMicroView"}>
                            <div>
                                <CardMicroView className="mt-2" cardID={sameCard.id}
                                onChange={(data) =>{
                                    CardPageStorage.selectedCardID = data
                                    CardPageStorage.isOpenCard = true
                                }}/>
                            </div>
                        </Grow>
                    )
                })}
            </Row>
        </div>
    )
})