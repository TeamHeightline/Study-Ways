import {Grow} from "@mui/material";
import CardMicroView from "./#CardMicroView";
import {Row} from "react-bootstrap";
import React from "react";
import {observer} from "mobx-react";
import {useHistory} from "react-router-dom";

export const MCPVCards = observer(({cardsDataForRender}) => {
    const history = useHistory();
    return(
        <div>
            <Row className="justify-content-around col-12"  style={{overflow: 'auto'}}>
                {cardsDataForRender?.length > 0 && cardsDataForRender
                    ?.map((sameCard: any, sIndex) =>{
                        return(
                            <Grow in={true}  key={sIndex+ "CardMicroView"}>
                                <div>
                                    <CardMicroView
                                        className="mt-2" cardID={sameCard.id}
                                        onChange={(data) =>{
                                            history.push('/card/' + data)
                                            // CardPageStorage.selectedCardID = data
                                            // CardPageStorage.isOpenCard = true
                                        }}/>
                                </div>
                            </Grow>
                        )
                        }
                    )}
            </Row>
        </div>
    )})