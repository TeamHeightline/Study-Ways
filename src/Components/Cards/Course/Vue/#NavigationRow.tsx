import React from 'react'
import {Button} from "@material-ui/core";
import {Row} from "antd";
import RowFragment from "./##RowFragment";

export default function NavigationRow(){
    return(
        <Row style={{width: 830*2}}>
            <RowFragment/>
            <RowFragment/>
        </Row>
    )
}