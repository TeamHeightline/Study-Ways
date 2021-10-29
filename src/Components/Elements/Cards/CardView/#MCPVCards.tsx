import {toJS} from "mobx";
import {CardPageStorage} from "../../../../Store/PublicStorage/CardsPage/CardPageStorage";
import {Grow} from "@material-ui/core";
import CardMicroView from "./#CardMicroView";
import {Row} from "react-bootstrap";
import React from "react";
import {observer} from "mobx-react";

export const MCPVCards = observer(() => {
    return(
        <div>
            <Row className="justify-content-around col-12">
                {toJS(CardPageStorage.cardsDataForRender) && toJS(CardPageStorage.cardsDataForRender)
                    ?.map((sameCard: any, sIndex) =>{
                        return(
                            <Grow in={true}  key={sIndex+ "CardMicroView"}>
                                <div>
                                    <CardMicroView
                                        disableReload={true}
                                        className="mt-2" cardID={sameCard.id}
                                        onChange={(data) =>{
                                            CardPageStorage.selectedCardID = data
                                            CardPageStorage.isOpenCard = true
                                        }}/>
                                </div>
                            </Grow>
                        )
                        }
                    )}
            </Row>
        </div>
    )})