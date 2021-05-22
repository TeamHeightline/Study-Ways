import React, {useState} from "react";
import CardMicroView from "../../CardView/#CardMicroView";
import {Row} from "react-bootstrap";
import CardEditByID from "../CardEditByID/CardEditByID";

export default function MainCardEditor(){
    const [isEditNow, setIsEditNow] = useState(false)
    const [selectedCardID, setSelectedCardID] = useState(0)
    const selectCardFroEditHandle = async(e) =>{
        await setIsEditNow(true)
        await setSelectedCardID(e)
        console.log("select" + e)
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
    return(
        <div className="col-12">
            <Row className="mr-2 ml-2">
                <CardMicroView id={1} className="mt-5 ml-5" onChange={selectCardFroEditHandle}/>
                <CardMicroView id={1} className="mt-5 ml-5" onChange={selectCardFroEditHandle}/>
                <CardMicroView id={1} className="mt-5 ml-5" onChange={selectCardFroEditHandle}/>
                <CardMicroView id={1} className="mt-5 ml-5" onChange={selectCardFroEditHandle}/>
                <CardMicroView id={1} className="mt-5 ml-5" onChange={selectCardFroEditHandle}/>
            </Row>
        </div>
    )
}