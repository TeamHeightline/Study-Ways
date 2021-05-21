import React from "react";
import CardMicroView from "../../CardView/#CardMicroView";
import {Row} from "react-bootstrap";

export default function MainCardEditor(){
    return(
        <div className="col-12">
            <Row className="mr-2 ml-2">

                <CardMicroView id={1} className="mt-5 ml-5"/>
                <CardMicroView id={1} className="mt-5 ml-5"/>
                <CardMicroView id={1} className="mt-5 ml-5"/>
                <CardMicroView id={1} className="mt-5 ml-5"/>
                <CardMicroView id={1} className="mt-5 ml-5"/>

            </Row>
        </div>
    )
}