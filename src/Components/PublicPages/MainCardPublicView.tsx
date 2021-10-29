import React, {useEffect} from 'react'
import {Col, Row} from "react-bootstrap";
import {ThemeSelector} from "../Elements/Cards/Editor/MainCardEditor/#ThemeSelector";
import {ContentTypeSelector} from "../Elements/Cards/Editor/MainCardEditor/#ContentTypeSelector";
import {AuthorSelector} from "../Elements/Cards/Editor/MainCardEditor/#AuthorSelector";
import {CARD} from "../Elements/Cards/Card"
import {CardPageStorage} from "../../Store/PublicStorage/CardsPage/CardPageStorage";
import {observer} from "mobx-react";
import {toJS} from "mobx";
import {CircularProgress, Grid} from "@material-ui/core";
import {Pagination} from "@material-ui/lab";
import {MCPVSearchString} from "../Elements/Cards/CardView/#MCPVSearchString";
import {MCPVCards} from "../Elements/Cards/CardView/#MCPVCards";

export const MainCardPublicView = observer(({...props}: any) =>{
    useEffect(() =>{CardPageStorage.getCardsDataFromServer()}, [])

    if(CardPageStorage.isOpenCard && CardPageStorage.selectedCardID){
        return (
            <CARD id={CardPageStorage.selectedCardID}/>
        )
    }
    return(
        <div {...props}>
            <MCPVSearchString/>
            <Row className="mt-3 justify-content-around col-12">
                <Col className="col-lg-4 col-12">
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
                <Col className=" col-lg-3 col-12">
                    {CardPageStorage.cardsDataAfterSelectContentType &&
                    <AuthorSelector cards_data={[]}
                                    openFromPublicView={true}
                                    ChangeSelectedData={() =>{
                                        void(0)
                                    }}/>}
                </Col>
            </Row>

            <Grid container justify="center" style={{marginTop: 12}}>
                <Grid item>
                    {!toJS(CardPageStorage.cardsDataForRender).length && <CircularProgress />}
                </Grid>
            </Grid>
            <MCPVCards/>
            {toJS(CardPageStorage.cardsDataForRender).length !== 0 && CardPageStorage.cardsDataForRender &&
                <Grid container justify="center" style={{marginTop: 12}}>
                    <Grid item>
                            <Pagination
                                page={CardPageStorage.pageNumber}
                                onChange={(e, value) =>
                                    CardPageStorage.changeActiveCardMicroViewPage(value)}
                                size="large"
                                count={CardPageStorage.numberOfPages}
                                shape="rounded" />
                    </Grid>
                </Grid>}
        </div>
    )
})